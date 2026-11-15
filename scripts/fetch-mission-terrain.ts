/**
 * Descarga los datos de elevación de la misión «¿Dónde probarías un rover?»
 * y los guarda en `src/data/missions/rover-terrain.generated.json`.
 *
 *   npm run fetch:terrain     (necesita internet; no hace falta para usar la app)
 *
 * Para cada sitio muestrea una malla de 41 × 41 puntos cada 75 m (3 km × 3 km)
 * centrada en el punto más bajo del cráter:
 *  - Tierra: Copernicus DEM GLO-90 (ESA / Unión Europea, 90 m) a través de la
 *    API de elevación de Open-Meteo.
 *  - Luna: SLDEM2015, mezcla LOLA (LRO, NASA) + Terrain Camera (Kaguya, JAXA),
 *    59 m/píxel, publicada por USGS Astrogeology. Se leen solo los bytes
 *    necesarios del GeoTIFF de 22 GB mediante peticiones HTTP por rangos.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const GRID = 41; // puntos por lado (impar: el centro es una fila/columna)
const STEP_M = 75; // separación entre puntos, en metros
const SEARCH_RADIUS_M = 600; // radio para buscar el fondo del cráter

const EARTH_RADIUS_M = 6_371_008.8;
const MOON_RADIUS_M = 1_737_400;

interface SiteRequest {
  id: string;
  body: 'earth' | 'moon';
  /** Coordenadas aproximadas publicadas (se afinan buscando el fondo del cráter). */
  approx: { lat: number; lon: number };
}

const SITES: SiteRequest[] = [
  { id: 'el-elegante', body: 'earth', approx: { lat: 31.8467, lon: -113.3913 } },
  { id: 'meteor-crater', body: 'earth', approx: { lat: 35.0274, lon: -111.0228 } },
  { id: 'north-ray', body: 'moon', approx: { lat: -8.82, lon: 15.48 } },
];

// ---------------------------------------------------------------------------
// Tierra: Open-Meteo (Copernicus DEM GLO-90), hasta 100 puntos por petición.

const OPEN_METEO = 'https://api.open-meteo.com/v1/elevation';

async function earthElevations(points: { lat: number; lon: number }[]): Promise<number[]> {
  const out: number[] = [];
  for (let i = 0; i < points.length; i += 100) {
    const chunk = points.slice(i, i + 100);
    const url = `${OPEN_METEO}?latitude=${chunk.map((p) => p.lat.toFixed(6)).join(',')}&longitude=${chunk
      .map((p) => p.lon.toFixed(6))
      .join(',')}`;
    const data = (await fetchWithRetry(url).then((r) => r.json())) as { elevation: number[] };
    out.push(...data.elevation);
    await sleep(2500); // el plan gratuito cuenta cada 10 puntos como una llamada
  }
  return out;
}

// ---------------------------------------------------------------------------
// Luna: SLDEM2015 (BigTIFF sin comprimir, int16, 1 fila por franja, escala 0,5 m).

const SLDEM_URL =
  'https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/LolaKaguya_Topo/Lunar_LRO_LOLAKaguya_DEMmerge_60N60S_512ppd.tif';
const SLDEM = {
  pixelsPerDegree: 512,
  width: 184_320,
  originLon: -180,
  originLat: 60,
  scale: 0.5,
  stripOffsetsTag: { offset: 491_912 }, // array de 61 440 offsets (uint64)
};

async function rangeBytes(url: string, start: number, length: number): Promise<Buffer> {
  const res = await fetchWithRetry(url, { headers: { Range: `bytes=${start}-${start + length - 1}` } });
  return Buffer.from(await res.arrayBuffer());
}

/** Devuelve una función de elevación (bilineal) para una ventana del ráster lunar. */
async function moonSampler(center: { lat: number; lon: number }, radiusM: number) {
  const degPerM = 180 / (Math.PI * MOON_RADIUS_M);
  const latSpan = radiusM * degPerM;
  const lonSpan = latSpan / Math.cos((center.lat * Math.PI) / 180);
  const row0 = Math.floor((SLDEM.originLat - (center.lat + latSpan)) * SLDEM.pixelsPerDegree) - 1;
  const row1 = Math.ceil((SLDEM.originLat - (center.lat - latSpan)) * SLDEM.pixelsPerDegree) + 1;
  const col0 = Math.floor((center.lon - lonSpan - SLDEM.originLon) * SLDEM.pixelsPerDegree) - 1;
  const col1 = Math.ceil((center.lon + lonSpan - SLDEM.originLon) * SLDEM.pixelsPerDegree) + 1;

  const offsetsBuf = await rangeBytes(SLDEM_URL, SLDEM.stripOffsetsTag.offset + row0 * 8, (row1 - row0 + 1) * 8);
  const rows: Int16Array[] = [];
  for (let r = row0; r <= row1; r += 1) {
    const stripStart = Number(offsetsBuf.readBigUInt64LE((r - row0) * 8));
    const bytes = await rangeBytes(SLDEM_URL, stripStart + col0 * 2, (col1 - col0 + 1) * 2);
    const values = new Int16Array(col1 - col0 + 1);
    for (let c = 0; c < values.length; c += 1) values[c] = bytes.readInt16LE(c * 2);
    rows.push(values);
  }

  return (lat: number, lon: number): number => {
    // Centro de píxel en (fila + 0,5, columna + 0,5).
    const y = (SLDEM.originLat - lat) * SLDEM.pixelsPerDegree - 0.5 - row0;
    const x = (lon - SLDEM.originLon) * SLDEM.pixelsPerDegree - 0.5 - col0;
    const y0 = Math.floor(y);
    const x0 = Math.floor(x);
    const fy = y - y0;
    const fx = x - x0;
    const at = (yy: number, xx: number) => {
      const v = rows[yy]?.[xx];
      if (v === undefined) throw new Error('Fuera de la ventana leída');
      return v * SLDEM.scale;
    };
    return (
      at(y0, x0) * (1 - fx) * (1 - fy) + at(y0, x0 + 1) * fx * (1 - fy) + at(y0 + 1, x0) * (1 - fx) * fy + at(y0 + 1, x0 + 1) * fx * fy
    );
  };
}

// ---------------------------------------------------------------------------

/** Malla de puntos (fila 0 = norte, columna 0 = oeste) alrededor de un centro. */
function gridPoints(center: { lat: number; lon: number }, size: number, stepM: number, radiusM: number) {
  const degPerM = 180 / (Math.PI * radiusM);
  const half = (size - 1) / 2;
  const points: { lat: number; lon: number }[] = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const lat = center.lat + (half - r) * stepM * degPerM;
      const lon = center.lon + ((c - half) * stepM * degPerM) / Math.cos((center.lat * Math.PI) / 180);
      points.push({ lat, lon });
    }
  }
  return points;
}

async function sampleSite(site: SiteRequest) {
  const radius = site.body === 'earth' ? EARTH_RADIUS_M : MOON_RADIUS_M;
  const halfExtent = ((GRID - 1) / 2) * STEP_M;
  const moon = site.body === 'moon' ? await moonSampler(site.approx, halfExtent + SEARCH_RADIUS_M + 300) : null;
  const elevations = (points: { lat: number; lon: number }[]) =>
    moon ? Promise.resolve(points.map((p) => moon(p.lat, p.lon))) : earthElevations(points);

  // 1) Buscar el fondo del cráter cerca de las coordenadas publicadas.
  const searchSize = (2 * SEARCH_RADIUS_M) / STEP_M + 1;
  const searchPoints = gridPoints(site.approx, searchSize, STEP_M, radius);
  const searchElev = await elevations(searchPoints);
  const lowest = searchElev.indexOf(Math.min(...searchElev));
  const center = searchPoints[lowest]!;

  // 2) Malla principal centrada en el fondo.
  const points = gridPoints(center, GRID, STEP_M, radius);
  const elev = await elevations(points);
  console.log(
    `✓ ${site.id}: centro ${center.lat.toFixed(5)}, ${center.lon.toFixed(5)} · ` +
      `min ${Math.min(...elev).toFixed(1)} m · max ${Math.max(...elev).toFixed(1)} m`,
  );
  return {
    id: site.id,
    center: { lat: round(center.lat, 5), lon: round(center.lon, 5) },
    elevations: elev.map((v) => round(v, 1)),
  };
}

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 && attempt < 6) {
        console.log("  … límite de peticiones (429); esperando 65 s");
        await sleep(65_000);
        continue;
      }
      if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status} en ${url.slice(0, 80)}`);
      return res;
    } catch (error) {
      if (attempt >= 6) throw error;
      await sleep(800 * (attempt + 1));
    }
  }
}

const sites = [];
for (const site of SITES) sites.push(await sampleSite(site));

const output = {
  generatedAt: new Date().toISOString().slice(0, 10),
  grid: { size: GRID, stepMeters: STEP_M, rowOrder: 'north-to-south', columnOrder: 'west-to-east' },
  sources: {
    earth: {
      dataset: 'Copernicus DEM GLO-90 (2021)',
      via: OPEN_METEO,
      resolutionMeters: 90,
    },
    moon: {
      dataset: 'SLDEM2015 — LRO LOLA + SELENE/Kaguya TC DEM merge 60N60S 512ppd',
      via: SLDEM_URL,
      resolutionMeters: 59,
    },
  },
  sites,
};

const outFile = join(dirname(fileURLToPath(import.meta.url)), '../src/data/missions/rover-terrain.generated.json');
writeFileSync(outFile, `${JSON.stringify(output)}\n`);
console.log(`\nGuardado en ${outFile}`);
