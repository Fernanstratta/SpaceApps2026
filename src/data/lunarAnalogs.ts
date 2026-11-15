import indexJson from '../../backend/data/lunar-analogs/index.json';
import cerroPrietoJson from '../../backend/data/lunar-analogs/pairs/cerro_prieto_gruithuisen.json';
import cucapaJson from '../../backend/data/lunar-analogs/pairs/cucapa_shackleton.json';
import eleganteJson from '../../backend/data/lunar-analogs/pairs/elegante_linne.json';
import lagunaSaladaJson from '../../backend/data/lunar-analogs/pairs/laguna_salada_tranquillitatis.json';
import pinacateJson from '../../backend/data/lunar-analogs/pairs/pinacate_marius.json';
import type {
  AnalogAxis,
  AnalogPairSummary,
  AxisNormalization,
  AxisSideValue,
  Comparison,
  Confidence,
  EarthSite,
  Metric,
  MoonSite,
  SimilarityMode,
  ValueStatus,
} from '../../backend/src/lib/spaceApiTypes';
import { AXIS_IDS, type AxisId } from '../types/Axis';

/**
 * Catálogo de análogos lunares: los cinco pares del Índice de Similitud Lunar.
 *
 * FUENTE ÚNICA: los JSON de `backend/data/lunar-analogs/`, los mismos que
 * sirve `GET /api/lunar-analogs`. Aquí se importan tal cual (no se copian ni
 * se recalculan): valores, estados, similitudes, pesos, ILS y completitud son
 * los del backend. Los tipos son los de `backend/src/lib/spaceApiTypes.ts`.
 *
 * Lo único propio del frontend es la presentación de cada par (fotos, zoom
 * del mapa, tipo de analogía, modelo 3D): no son datos de comparación.
 *
 * BACKEND EN VIVO: `getLunarAnalogCatalog` es el único punto de acceso. Para
 * leer de la API basta con que esta función obtenga `Comparison[]` de
 * `getAnalogPairs` / `getAnalogPair` (ver `backend/src/lib/spaceApi.ts`).
 */

export { AXIS_IDS };
export type {
  AnalogAxis,
  AnalogPairSummary,
  AxisId,
  AxisNormalization,
  Comparison,
  Confidence,
  EarthSite,
  MoonSite,
  SimilarityMode,
  ValueStatus,
};

/** Las claves de eje del frontend son las del backend (`Metric['key']`). */
type AssertSame<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const AXIS_KEYS_MATCH_BACKEND: AssertSame<AxisId, Metric['key']> = true;

/** Valor de un lado, con los campos que el JSON trae y el tipo del backend aún no declara. */
export type AxisSide = AxisSideValue & {
  /** Anclas de la escala félsica–máfica (eje 3). */
  calibration?: { felsic: number; mafic: number; source: string };
};

/** Sitio (terrestre o lunar) con el método con que se fijó su coordenada. */
export type AnalogSite = (EarthSite | MoonSite) & { coordinate_method?: string };

export type Body = 'earth' | 'moon';
export const BODIES: readonly Body[] = ['earth', 'moon'];

/* ------------------------------------------------------------------ */
/* Pares                                                               */
/* ------------------------------------------------------------------ */

export const PAIR_IDS = [
  'elegante_linne',
  'pinacate_marius',
  'cerro_prieto_gruithuisen',
  'laguna_salada_tranquillitatis',
  'cucapa_shackleton',
] as const;
export type PairId = (typeof PAIR_IDS)[number];

export function isPairId(value: unknown): value is PairId {
  return typeof value === 'string' && (PAIR_IDS as readonly string[]).includes(value);
}

export const ANALOGY_TYPES = ['crater-morphology', 'basaltic-volcanism', 'silicic-volcanism', 'landing-terrain', 'risk-counterexample'] as const;
export type AnalogyType = (typeof ANALOGY_TYPES)[number];

export interface PhotoCredit {
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  /** Página del archivo (crédito y licencia completos). */
  page: string;
}

/** Id de un relieve en `analog-terrain.generated.json` (= `site_id` del backend). */
export type TerrainId = string;

/** Presentación de un par: lo que el frontend añade a los datos del backend. */
interface PairPresentation {
  analogyType: AnalogyType;
  /** Zoom inicial del mapa terrestre. */
  zoom: number;
  photos: Record<Body, PhotoCredit[]>;
}

export interface AnalogPair extends PairPresentation {
  id: PairId;
  /** Número fijo del par (1…5, orden del catálogo del backend). */
  number: number;
  /** Registro completo del backend, sin modificar. */
  data: Comparison;
}

const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons';
const PAGE = 'https://commons.wikimedia.org/wiki/File:';

/** Foto de Wikimedia Commons; con `thumb` usa la miniatura estándar de ese ancho. */
function commons(hashPath: string, file: string, width: number, height: number, author: string, license: string, thumb?: number): PhotoCredit {
  const page = `${PAGE}${file}`;
  if (!thumb) return { src: `${COMMONS}/${hashPath}/${file}`, width, height, author, license, page };
  return {
    src: `${COMMONS}/thumb/${hashPath}/${file}/${thumb}px-${file}`,
    width: thumb,
    height: Math.round((height * thumb) / width),
    author,
    license,
    page,
  };
}

const PINACATE_SENTINEL = commons(
  'f/f1',
  'Craters_dot_the_lava_fields_of_El_Pinacate_in_Mexico_%28Copernicus_2026-11-08%29.webp',
  4961,
  3508,
  'Unión Europea, Copernicus Sentinel-2',
  'Atribución (datos Copernicus Sentinel modificados)',
  1280,
);

const PRESENTATION: Record<PairId, PairPresentation> = {
  elegante_linne: {
    analogyType: 'crater-morphology',
    zoom: 13,
    photos: {
      earth: [commons('8/86', 'Pinacate_volcanic_field.jpg', 640, 418, 'Richard Waitt, USGS', 'Dominio público'), PINACATE_SENTINEL],
      moon: [
        commons('9/92', 'Linne_%28LRO%29_1.png', 3000, 3000, 'NASA (LRO, cámara NAC)', 'Dominio público', 1280),
        commons('7/75', 'LRO_Linn%C3%A9_crater_color_coded_shaded_relief_map.png', 2307, 3725, 'NASA/GSFC/Arizona State University', 'Dominio público', 960),
      ],
    },
  },
  pinacate_marius: {
    analogyType: 'basaltic-volcanism',
    zoom: 11,
    photos: {
      earth: [
        commons(
          'e/e9',
          'Reserva_de_la_Biosfera_El_Pinacate%2C_Sonora-Biosphere_Reserve%2C_El_Pinacate%2C_Sonora_%2823107632322%29.jpg',
          4592,
          3056,
          'Comisión Mexicana de Filmaciones',
          'CC BY-SA 2.0',
          1280,
        ),
        PINACATE_SENTINEL,
      ],
      moon: [
        commons('6/63', 'Marius_hills_pit.png', 1430, 908, 'NASA / equipo LROC, Arizona State University', 'Dominio público', 1280),
        commons(
          '2/20',
          'Marius_Hills_Pit_-_Lava_Tube_Skylight%3F_%28LROC202_-_M114328462R_thumb%29.png',
          1000,
          1000,
          'NASA/GSFC/Arizona State University',
          'Dominio público',
        ),
      ],
    },
  },
  cerro_prieto_gruithuisen: {
    analogyType: 'silicic-volcanism',
    zoom: 13,
    photos: {
      earth: [
        commons('1/12', 'Cerro_Prieto.jpg', 640, 435, 'Marshall Reed, U.S. Department of Energy', 'Dominio público'),
        commons('e/e2', 'Cerro_prieto_visto_desde_el_noreste_1.jpg', 1382, 1037, 'Verdelunar', 'CC BY-SA 4.0', 1280),
      ],
      moon: [
        commons('6/65', 'Gruithuisen_domes_AS15-93-12717.jpg', 1700, 1000, 'James Stuby, a partir de una imagen de NASA (Apolo 15)', 'Dominio público', 1280),
        commons('a/af', 'Gruithuisen_domes_%28LRO%29.png', 677, 508, 'NASA (LRO)', 'Dominio público'),
      ],
    },
  },
  laguna_salada_tranquillitatis: {
    analogyType: 'landing-terrain',
    zoom: 10,
    photos: {
      earth: [commons('b/b1', 'Entrada_norte_a_la_Laguna_salada..jpg', 4160, 3120, 'Tacicuri', 'CC BY-SA 4.0', 1280)],
      moon: [
        commons(
          'a/a5',
          'LRO_Gets_Additional_View_of_Apollo_11_Landing_Site_%284092985062%29.jpg',
          1400,
          1400,
          'NASA Goddard Space Flight Center (LRO)',
          'Dominio público',
          1280,
        ),
      ],
    },
  },
  cucapa_shackleton: {
    analogyType: 'risk-counterexample',
    zoom: 12,
    photos: {
      earth: [
        commons('3/38', 'Vista_de_Mexicali_desde_la_Tinaja_Cucapah_-_panoramio.jpg', 2048, 1536, 'mbagoogle', 'CC BY 3.0', 1280),
        commons('2/21', 'Ca%C3%B1on_de_la_Tinaja_Cucapah_-_panoramio.jpg', 2048, 1536, 'mbagoogle', 'CC BY 3.0', 1280),
      ],
      moon: [
        commons('d/d5', 'Shackleton_Crater.jpg', 3032, 2637, 'Equipos de LROC y ShadowCam (NASA/KARI/ASU)', 'Dominio público', 1280),
        commons('9/9a', 'Rimlight-_Shackleton_Crater_%283929168011%29.jpg', 1182, 1170, 'NASA Goddard (LROC)', 'Dominio público'),
      ],
    },
  },
};

/* ------------------------------------------------------------------ */
/* Carga y validación del catálogo del backend                         */
/* ------------------------------------------------------------------ */

const SUMMARIES = indexJson as unknown as AnalogPairSummary[];
const RECORDS = [eleganteJson, pinacateJson, cerroPrietoJson, lagunaSaladaJson, cucapaJson] as unknown as Comparison[];

/** Mismas comprobaciones que `getAnalogPair` en el cliente del backend, más el orden de los ejes. */
function assertBackendRecord(record: Comparison | undefined, id: PairId): Comparison {
  if (!record) throw new Error(`El backend no trae el par «${id}».`);
  if (!Array.isArray(record.axes) || record.axes.length !== AXIS_IDS.length) {
    throw new Error(`El par «${id}» del backend no tiene ${AXIS_IDS.length} ejes.`);
  }
  record.axes.forEach((axis, index) => {
    if (axis.key !== AXIS_IDS[index] || axis.id !== index + 1) {
      throw new Error(`El par «${id}» tiene el eje ${index + 1} fuera de orden (${axis.key}).`);
    }
  });
  return record;
}

if (SUMMARIES.length !== PAIR_IDS.length || SUMMARIES.some((summary, index) => summary.pair_id !== PAIR_IDS[index])) {
  throw new Error('El índice del backend (index.json) no coincide con los pares que conoce el frontend.');
}

const PAIRS: readonly AnalogPair[] = PAIR_IDS.map((id, index) => ({
  id,
  number: index + 1,
  data: assertBackendRecord(
    RECORDS.find((record) => record.pair_id === id),
    id,
  ),
  ...PRESENTATION[id],
}));

export interface LunarAnalogCatalog {
  schemaVersion: string;
  /** Fecha en que el pipeline generó los datos (ISO 8601). */
  generatedAt: string;
  /** Resúmenes de `index.json`, en el orden del backend. */
  summaries: readonly AnalogPairSummary[];
  pairs: readonly AnalogPair[];
}

/** Punto único de acceso al catálogo (hoy, los JSON del backend empaquetados; después, la API). */
export function getLunarAnalogCatalog(): LunarAnalogCatalog {
  const first = PAIRS[0]!.data;
  return { schemaVersion: first.schema_version, generatedAt: first.generated_at, summaries: SUMMARIES, pairs: PAIRS };
}

export function getPair(id: PairId): AnalogPair {
  const pair = PAIRS.find((item) => item.id === id);
  if (!pair) throw new Error(`Par desconocido: ${id}`);
  return pair;
}

export function getSite(pair: AnalogPair, body: Body): AnalogSite {
  return body === 'earth' ? pair.data.earth_site : pair.data.moon_site;
}

/* ------------------------------------------------------------------ */
/* Ejes                                                                */
/* ------------------------------------------------------------------ */

/** El eje de un par, tal como lo envía el backend. */
export function pairAxis(pair: AnalogPair, axisId: AxisId): AnalogAxis {
  const axis = pair.data.axes.find((item) => item.key === axisId);
  if (!axis) throw new Error(`El par ${pair.id} no tiene el eje ${axisId}.`);
  return axis;
}

export function axisSide(axis: AnalogAxis, body: Body): AxisSide | null {
  return axis[body];
}

/** Definición de un eje (métrica, modo, tolerancia, peso nominal, confianza). */
export type AxisDefinition = Metric;

/**
 * Definición nominal de cada eje, leída de los pares del backend. Los campos
 * son iguales en los cinco pares salvo el peso del eje de hielo, que el
 * backend baja a 0.5 cuando marca «similitud por ausencia»: la definición
 * nominal se toma de un par sin esa marca.
 */
const AXIS_DEFINITIONS: Record<AxisId, AxisDefinition> = Object.fromEntries(
  AXIS_IDS.map((axisId) => {
    const candidates = PAIRS.map((pair) => pairAxis(pair, axisId));
    const nominal = candidates.find((axis) => axis.flag === null) ?? candidates[0]!;
    const { flag: _flag, earth: _earth, moon: _moon, similarity: _similarity, available: _available, ...definition } = nominal;
    return [axisId, definition];
  }),
) as Record<AxisId, AxisDefinition>;

export function getAxisDefinition(axisId: AxisId): AxisDefinition {
  return AXIS_DEFINITIONS[axisId];
}

export const AXIS_DEFINITION_LIST: readonly AxisDefinition[] = AXIS_IDS.map((axisId) => AXIS_DEFINITIONS[axisId]);

/** Peso del eje de hielo cuando el backend marca «similitud por ausencia» (leído de los datos; `null` si ningún par la tiene). */
export const ABSENCE_WEIGHT: number | null =
  PAIRS.map((pair) => pairAxis(pair, 'ice')).find((axis) => axis.flag === 'similitud_por_ausencia')?.weight ?? null;

/** ¿El eje entra al ILS de este par? (`available` del backend; nunca se deduce de la similitud). */
export function isComparable(axis: AnalogAxis): axis is AnalogAxis & { similarity: number; earth: AxisSide; moon: AxisSide } {
  return axis.available && axis.similarity !== null && axis.earth !== null && axis.moon !== null;
}

/**
 * Ejes comparables de un par, del más al menos parecido según la similitud
 * que envía el backend (solo se ordenan; no se recalcula nada).
 */
export function axesBySimilarity(pair: AnalogPair): AnalogAxis[] {
  return pair.data.axes.filter(isComparable).sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
}

export interface AxisAcrossPairs {
  pair: AnalogPair;
  axis: AnalogAxis;
}

/**
 * Un eje en los cinco pares: primero los comparables, del más al menos
 * parecido; al final, los que no tienen dato comparable en ese eje.
 */
export function axisAcrossPairs(axisId: AxisId, pairIds: readonly PairId[] = PAIR_IDS): AxisAcrossPairs[] {
  const rows = pairIds.map((id) => {
    const pair = getPair(id);
    return { pair, axis: pairAxis(pair, axisId) };
  });
  return [
    ...rows.filter((row) => isComparable(row.axis)).sort((a, b) => (b.axis.similarity ?? 0) - (a.axis.similarity ?? 0)),
    ...rows.filter((row) => !isComparable(row.axis)),
  ];
}

/** Pares con dato comparable en un eje, en el orden del catálogo. */
export function pairsWithAxis(axisId: AxisId): AnalogPair[] {
  return PAIRS.filter((pair) => isComparable(pairAxis(pair, axisId)));
}

/* ------------------------------------------------------------------ */
/* Textos del backend que el propio backend marcó como desactualizados  */
/* ------------------------------------------------------------------ */

/**
 * `contexto.txt` (§8.7) avisa de textos del backend que ya no son ciertos y
 * pide no repetirlos como actuales. Cada entrada sustituye el texto SOLO si
 * el backend sigue enviando exactamente el original: en cuanto el backend lo
 * corrija, se muestra su versión y `verify:data` avisa de que la entrada sobra.
 */
export interface StaleText {
  id: string;
  /** Texto exacto que hoy envía el backend. */
  original: string;
  /** Lo que se muestra mientras tanto (el mismo texto, sin la parte desactualizada). */
  shown: string;
  reason: string;
}

export const STALE_BACKEND_TEXTS: readonly StaleText[] = [
  {
    id: 'elegante_linne/breaks/thermal',
    original:
      'La atmósfera terrestre y la duración del día lunar influyen en las diferencias térmicas. Falta calcular la amplitud en las dos áreas con productos comparables.',
    shown: 'La atmósfera terrestre y la duración del día lunar influyen en las diferencias térmicas.',
    reason: 'La amplitud térmica de este par ya está medida en los dos sitios.',
  },
  {
    id: 'marius_hills/aoi',
    original: 'Radio de trabajo provisional centrado en el pozo Marius Hills.',
    shown: 'Círculo centrado en el pozo de Marius Hills.',
    reason: 'Las coordenadas ya son de referencia; el radio dejó de ser provisional.',
  },
  {
    id: 'gruithuisen/aoi',
    original: 'Radio provisional. La referencia publicada está en el domo Gamma.',
    shown: 'La referencia publicada está en el domo Gamma.',
    reason: 'Las coordenadas ya son de referencia; el radio dejó de ser provisional.',
  },
  {
    id: 'tranquillitatis_apollo11/aoi',
    original: 'Radio de trabajo provisional alrededor del módulo lunar.',
    shown: 'Círculo alrededor del módulo lunar del Apolo 11.',
    reason: 'Las coordenadas ya son de referencia; el radio dejó de ser provisional.',
  },
];

/** Devuelve el texto a mostrar: el del backend, salvo que sea uno de los marcados como desactualizados. */
export function currentText(id: string, backendText: string): string {
  const stale = STALE_BACKEND_TEXTS.find((item) => item.id === id);
  return stale && stale.original === backendText ? stale.shown : backendText;
}

/** Nota del área de análisis de un sitio, sin afirmaciones desactualizadas. */
export function aoiNote(site: AnalogSite): string {
  return currentText(`${site.site_id}/aoi`, site.aoi.note);
}

export interface EducationBreak {
  /** Clave que envía el backend: un eje (`thermal`) u otra etiqueta (`origen`). */
  key: string;
  /** El eje, cuando la clave es uno de los nueve. */
  axisId: AxisId | null;
  text: string;
}

/** «Dónde se rompe la analogía», en español, tal como lo envía el backend. */
export function educationBreaks(pair: AnalogPair): EducationBreak[] {
  return pair.data.education.breaks_es.map((item) => ({
    key: item.axis,
    axisId: (AXIS_IDS as readonly string[]).includes(item.axis) ? (item.axis as AxisId) : null,
    text: currentText(`${pair.id}/breaks/${item.axis}`, item.text),
  }));
}
