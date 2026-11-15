import type { AxisPairValues, AxisSpec, AxisValue } from '../utils/ils';
import type { MissionSiteId } from './missions/roverMission';

/**
 * Catálogo de análogos lunares del Starman Playground.
 *
 * Fuente: documento del equipo «Índice de Similitud Lunar (ILS): métricas y
 * criterios de comparación entre sitios de Baja California y Sonora y la
 * Luna», esquema de datos 1.0.0 (15 de noviembre de 2026).
 *
 * BACKEND: este archivo tiene la forma del catálogo que publicará la API
 * (`/api/lunar-analogs`). Cuando exista, basta con que `getLunarAnalogCatalog`
 * lea de ahí; el resto del Playground no cambia.
 *
 * Solo contiene lo que dice el documento. Los textos (nombres, analogías,
 * preguntas) están en `i18n/playground.ts`.
 */

export const ILS_SCHEMA_VERSION = '1.0.0';
export const ILS_DATA_DATE = '2026-11-15';

/* ------------------------------------------------------------------ */
/* Los nueve ejes                                                      */
/* ------------------------------------------------------------------ */

export const AXIS_IDS = ['slope', 'roughness', 'mineralogy', 'albedo', 'thermal', 'aridity', 'volatiles', 'dust', 'craters'] as const;
export type AxisId = (typeof AXIS_IDS)[number];

export interface IlsAxis extends AxisSpec {
  id: AxisId;
  /** Número del eje en el documento (1–9). */
  number: number;
  /** Nombre técnico de la métrica. */
  metric: string;
  /** Decimales con que se muestra un valor del eje. */
  decimals: number;
  /** Unidad corta para mostrar junto al valor ('' si es adimensional). */
  unit: string;
}

export const ILS_AXES: readonly IlsAxis[] = [
  { id: 'slope', number: 1, metric: 'f_safe', formula: 'linear', tolerance: 0.5, weight: 1.5, confidence: 'A', decimals: 2, unit: '' },
  { id: 'roughness', number: 2, metric: 'roughness_percentile', formula: 'linear', tolerance: 1.0, weight: 1.0, confidence: 'B', decimals: 2, unit: '' },
  { id: 'mineralogy', number: 3, metric: 'mafic_score', formula: 'linear', tolerance: 1.0, weight: 1.5, confidence: 'B', decimals: 2, unit: '' },
  { id: 'albedo', number: 4, metric: 'albedo_broadband', formula: 'linear', tolerance: 0.15, weight: 1.0, confidence: 'A', decimals: 2, unit: '' },
  { id: 'thermal', number: 5, metric: 'delta_T', formula: 'log', tolerance: 10, weight: 1.0, confidence: 'A', decimals: 0, unit: 'K' },
  { id: 'aridity', number: 6, metric: 'ndvi_median', formula: 'linear', tolerance: 0.3, weight: 0.5, confidence: 'A', decimals: 2, unit: '' },
  { id: 'volatiles', number: 7, metric: 'volatile_class', formula: 'linear', tolerance: 3, weight: 1.0, weightIfBothAbsent: 0.5, confidence: 'C', decimals: 0, unit: '' },
  { id: 'dust', number: 8, metric: 'fine_fraction', formula: 'linear', tolerance: 1.0, weight: 0.75, confidence: 'C', decimals: 2, unit: '' },
  { id: 'craters', number: 9, metric: 'depth_diameter_ratio', formula: 'linear', tolerance: 0.2, weight: 1.0, confidence: 'B', decimals: 3, unit: '' },
];

export function getAxis(id: AxisId): IlsAxis {
  const axis = ILS_AXES.find((a) => a.id === id);
  if (!axis) throw new Error(`Eje desconocido: ${id}`);
  return axis;
}

/* ------------------------------------------------------------------ */
/* Fuentes de datos (sección 7 del documento)                          */
/* ------------------------------------------------------------------ */

export const ILS_SOURCES = [
  { id: 'cop-dem', name: 'Copernicus DEM GLO-30', url: 'https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM.html' },
  { id: 'sentinel-1', name: 'Sentinel-1 GRD IW', url: 'https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel1.html' },
  { id: 'sentinel-2', name: 'Sentinel-2 L2A', url: 'https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel2.html' },
  { id: 'aster-ged', name: 'ASTER GED AG100 v3', url: 'https://doi.org/10.5067/COMMUNITY/ASTER_GED/AG100.003' },
  { id: 'modis', name: 'Aqua MODIS MYD11A2 v061', url: 'https://doi.org/10.5067/MODIS/MYD11A2.061' },
  { id: 'smap', name: 'SMAP SPL3SMP_E', url: 'https://nsidc.org/data/spl3smp_e' },
  { id: 'soilgrids', name: 'ISRIC SoilGrids', url: 'https://www.isric.org/explore/soilgrids' },
  { id: 'diviner', name: 'LRO Diviner (GDR, RCP, GCP, PRP)', url: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm' },
  { id: 'mini-rf', name: 'LRO Mini-RF', url: 'https://pds-geosciences.wustl.edu/missions/lro/mrf.htm' },
  { id: 'lola', name: 'LRO LOLA', url: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm' },
  { id: 'sldem2015', name: 'SLDEM2015', url: 'https://pgda.gsfc.nasa.gov/products/54' },
  { id: 'lroc-nac', name: 'LROC NAC DTM', url: 'https://lroc.im-ldi.com/data' },
  { id: 'gutmann-2006', name: 'Gutmann y Turrin (2006), El Elegante', url: 'https://gsa.confex.com/gsa/2006RM/webprogram/Paper104697.html' },
  { id: 'martellato-2017', name: 'Martellato et al. (2017), Linné', url: 'https://doi.org/10.1111/maps.12892' },
] as const;
export type IlsSourceId = (typeof ILS_SOURCES)[number]['id'];

export function getIlsSource(id: IlsSourceId) {
  return ILS_SOURCES.find((s) => s.id === id)!;
}

/* ------------------------------------------------------------------ */
/* Pares de sitios                                                     */
/* ------------------------------------------------------------------ */

export const ANALOGY_TYPES = ['crater-morphology', 'basaltic-volcanism', 'silicic-volcanism', 'landing-terrain', 'risk-counterexample'] as const;
export type AnalogyType = (typeof ANALOGY_TYPES)[number];

export const EARTH_STATES = ['sonora', 'baja-california'] as const;
export type EarthState = (typeof EARTH_STATES)[number];

export const PAIR_IDS = ['elegante-linne', 'pinacate-marius', 'cerro-prieto-gruithuisen', 'laguna-salada-tranquillitatis', 'cucapa-shackleton'] as const;
export type PairId = (typeof PAIR_IDS)[number];

export interface PhotoCredit {
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  /** Página del archivo (crédito y licencia completos). */
  page: string;
}

export interface AnalogSite {
  /** Grados decimales; longitud positiva hacia el este. */
  lat: number;
  lon: number;
  /** Coordenada de trabajo, pendiente de confirmar. */
  provisionalCoords: boolean;
  /** Radio del área de análisis circular (km); `null` si aún no está definida. */
  analysisRadiusKm: number | null;
  provisionalArea: boolean;
  photos: PhotoCredit[];
}

/** Valor de un eje con su origen; `range` cuando el documento da un intervalo. */
export interface CatalogValue extends AxisValue {
  range?: [number, number];
  sourceId?: IlsSourceId;
}

export interface AnalogPair {
  id: PairId;
  analogyType: AnalogyType;
  state: EarthState;
  earth: AnalogSite & { zoom: number };
  moon: AnalogSite;
  /** Ejes que deberían mostrar mayor similitud. */
  strongAxes: AxisId[];
  /** Valores por eje. Los ejes sin entrada todavía no tienen datos. */
  axes: Partial<Record<AxisId, { earth?: CatalogValue; moon?: CatalogValue }>>;
  /** Posición en el ranking esperado del ILS (los empates comparten número). */
  expectedRank: number;
  /** Sitio con modelo de elevación en el proyecto (habilita la vista 3D). */
  terrainSiteId: MissionSiteId | null;
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

/** NDVI lunar = 0 por definición (no hay vegetación): valor de referencia en todos los pares. */
const MOON_NDVI: CatalogValue = { value: 0, status: 'reference' };

const PAIRS: readonly AnalogPair[] = [
  {
    id: 'elegante-linne',
    analogyType: 'crater-morphology',
    state: 'sonora',
    earth: {
      lat: 31.8467,
      lon: -113.3913,
      provisionalCoords: false,
      analysisRadiusKm: 1.2,
      provisionalArea: false,
      zoom: 13,
      photos: [
        commons('8/86', 'Pinacate_volcanic_field.jpg', 640, 418, 'Richard Waitt, USGS', 'Dominio público'),
        commons(
          'f/f1',
          'Craters_dot_the_lava_fields_of_El_Pinacate_in_Mexico_%28Copernicus_2026-11-08%29.webp',
          4961,
          3508,
          'Unión Europea, Copernicus Sentinel-2',
          'Atribución (datos Copernicus Sentinel modificados)',
          1280,
        ),
      ],
    },
    moon: {
      lat: 27.73,
      lon: 11.79,
      provisionalCoords: false,
      analysisRadiusKm: 1.65,
      provisionalArea: false,
      photos: [
        commons('9/92', 'Linne_%28LRO%29_1.png', 3000, 3000, 'NASA (LRO, cámara NAC)', 'Dominio público', 1280),
        commons('7/75', 'LRO_Linn%C3%A9_crater_color_coded_shaded_relief_map.png', 2307, 3725, 'NASA/GSFC/Arizona State University', 'Dominio público', 960),
      ],
    },
    strongAxes: ['craters', 'mineralogy', 'albedo'],
    axes: {
      // d/D = profundidad / diámetro, de dimensiones publicadas: 244/1600 y 520/2230.
      craters: {
        earth: { value: 244 / 1600, status: 'published', sourceId: 'gutmann-2006' },
        moon: { value: 520 / 2230, status: 'published', sourceId: 'martellato-2017' },
      },
      // Estimaciones del documento (~40 K y ~270 K), pendientes de medir: fuera del ILS.
      thermal: {
        earth: { value: 40, status: 'provisional' },
        moon: { value: 270, status: 'provisional' },
      },
      aridity: { moon: MOON_NDVI },
    },
    expectedRank: 1,
    terrainSiteId: 'el-elegante',
  },
  {
    id: 'pinacate-marius',
    analogyType: 'basaltic-volcanism',
    state: 'sonora',
    earth: {
      lat: 31.77,
      lon: -113.49,
      provisionalCoords: true,
      analysisRadiusKm: 5,
      provisionalArea: true,
      zoom: 11,
      photos: [
        commons(
          'e/e9',
          'Reserva_de_la_Biosfera_El_Pinacate%2C_Sonora-Biosphere_Reserve%2C_El_Pinacate%2C_Sonora_%2823107632322%29.jpg',
          4592,
          3056,
          'Comisión Mexicana de Filmaciones',
          'CC BY-SA 2.0',
          1280,
        ),
        commons(
          'f/f1',
          'Craters_dot_the_lava_fields_of_El_Pinacate_in_Mexico_%28Copernicus_2026-11-08%29.webp',
          4961,
          3508,
          'Unión Europea, Copernicus Sentinel-2',
          'Atribución (datos Copernicus Sentinel modificados)',
          1280,
        ),
      ],
    },
    moon: {
      lat: 14.09,
      lon: -56.77,
      provisionalCoords: false,
      analysisRadiusKm: 5,
      provisionalArea: false,
      photos: [
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
    strongAxes: ['mineralogy', 'albedo', 'craters', 'roughness'],
    axes: { aridity: { moon: MOON_NDVI } },
    expectedRank: 1,
    terrainSiteId: null,
  },
  {
    id: 'cerro-prieto-gruithuisen',
    analogyType: 'silicic-volcanism',
    state: 'baja-california',
    earth: {
      lat: 32.418,
      lon: -115.305,
      provisionalCoords: false,
      analysisRadiusKm: 2,
      provisionalArea: false,
      zoom: 13,
      photos: [
        commons('1/12', 'Cerro_Prieto.jpg', 640, 435, 'Marshall Reed, U.S. Department of Energy', 'Dominio público'),
        commons('e/e2', 'Cerro_prieto_visto_desde_el_noreste_1.jpg', 1382, 1037, 'Verdelunar', 'CC BY-SA 4.0', 1280),
      ],
    },
    moon: {
      lat: 36.46,
      lon: -40.8,
      provisionalCoords: false,
      analysisRadiusKm: 2,
      provisionalArea: false,
      photos: [
        commons('6/65', 'Gruithuisen_domes_AS15-93-12717.jpg', 1700, 1000, 'James Stuby, a partir de una imagen de NASA (Apolo 15)', 'Dominio público', 1280),
        commons('a/af', 'Gruithuisen_domes_%28LRO%29.png', 677, 508, 'NASA (LRO)', 'Dominio público'),
      ],
    },
    strongAxes: ['mineralogy', 'craters'],
    axes: { aridity: { moon: MOON_NDVI } },
    expectedRank: 3,
    terrainSiteId: null,
  },
  {
    id: 'laguna-salada-tranquillitatis',
    analogyType: 'landing-terrain',
    state: 'baja-california',
    earth: {
      lat: 32.36,
      lon: -115.65,
      provisionalCoords: true,
      analysisRadiusKm: 5,
      provisionalArea: false,
      zoom: 10,
      photos: [
        commons('b/b1', 'Entrada_norte_a_la_Laguna_salada..jpg', 4160, 3120, 'Tacicuri', 'CC BY-SA 4.0', 1280),
      ],
    },
    moon: {
      lat: 0.67,
      lon: 23.47,
      provisionalCoords: false,
      analysisRadiusKm: 5,
      provisionalArea: false,
      photos: [
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
    strongAxes: ['slope', 'aridity', 'dust'],
    axes: {
      // Intervalos del documento (playa salina α ≈ 0.30–0.40; basalto del mar α ≈ 0.07–0.10), pendientes de medir.
      albedo: {
        earth: { value: 0.35, range: [0.3, 0.4], status: 'provisional' },
        moon: { value: 0.085, range: [0.07, 0.1], status: 'provisional' },
      },
      aridity: { moon: MOON_NDVI },
    },
    expectedRank: 4,
    terrainSiteId: null,
  },
  {
    id: 'cucapa-shackleton',
    analogyType: 'risk-counterexample',
    state: 'baja-california',
    earth: {
      lat: 32.4,
      lon: -115.5,
      provisionalCoords: true,
      analysisRadiusKm: 5,
      provisionalArea: true,
      zoom: 11,
      photos: [
        commons('3/38', 'Vista_de_Mexicali_desde_la_Tinaja_Cucapah_-_panoramio.jpg', 2048, 1536, 'mbagoogle', 'CC BY 3.0', 1280),
        commons('2/21', 'Ca%C3%B1on_de_la_Tinaja_Cucapah_-_panoramio.jpg', 2048, 1536, 'mbagoogle', 'CC BY 3.0', 1280),
      ],
    },
    moon: {
      lat: -89.67,
      lon: 129.78,
      provisionalCoords: false,
      // «Hay que elegir un tramo del borde antes de medir».
      analysisRadiusKm: null,
      provisionalArea: true,
      photos: [
        commons('d/d5', 'Shackleton_Crater.jpg', 3032, 2637, 'Equipos de LROC y ShadowCam (NASA/KARI/ASU)', 'Dominio público', 1280),
        commons('9/9a', 'Rimlight-_Shackleton_Crater_%283929168011%29.jpg', 1182, 1170, 'NASA Goddard (LROC)', 'Dominio público'),
      ],
    },
    strongAxes: ['slope', 'roughness', 'albedo'],
    axes: { aridity: { moon: MOON_NDVI } },
    expectedRank: 5,
    terrainSiteId: null,
  },
];

export interface LunarAnalogCatalog {
  schemaVersion: string;
  dataDate: string;
  axes: readonly IlsAxis[];
  pairs: readonly AnalogPair[];
}

/** Punto único de acceso al catálogo (hoy local; después, la API). */
export function getLunarAnalogCatalog(): LunarAnalogCatalog {
  return { schemaVersion: ILS_SCHEMA_VERSION, dataDate: ILS_DATA_DATE, axes: ILS_AXES, pairs: PAIRS };
}

/** Valores de un par en la forma que espera `computeIls`. */
export function pairAxisValues(pair: AnalogPair): Record<string, AxisPairValues | undefined> {
  return pair.axes;
}
