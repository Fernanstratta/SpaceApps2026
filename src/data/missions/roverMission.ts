import type { TerrainGrid } from '../../utils/terrain';
import terrain from './rover-terrain.generated.json';

/**
 * Misión 01 — «¿Dónde probarías un rover antes de enviarlo a la Luna?»
 * Datos independientes del idioma: sitios, imágenes, DEM y fuentes.
 * Los textos están en `src/i18n/missions/rover.{es,en}.ts`.
 *
 * Todo lo que aparece aquí está verificado en la fuente enlazada (ver
 * `docs/mission-rover.md`). El DEM se regenera con `npm run fetch:terrain`.
 */

export type MissionSiteId = 'el-elegante' | 'meteor-crater' | 'north-ray';
/** Los dos candidatos en la Tierra; North Ray es la referencia lunar. */
export type CandidateSiteId = Exclude<MissionSiteId, 'north-ray'>;

export const CANDIDATE_SITE_IDS: readonly CandidateSiteId[] = ['el-elegante', 'meteor-crater'];
export const MISSION_SITE_IDS: readonly MissionSiteId[] = ['el-elegante', 'meteor-crater', 'north-ray'];

export type SourceId =
  | 'copernicus-dem'
  | 'open-meteo'
  | 'sldem2015'
  | 'alsj-north-ray'
  | 'sp4214-lrv'
  | 'nssdc-lrv'
  | 'nssdc-moon'
  | 'nasa-eo-pinacate'
  | 'usgs-arizona-training'
  | 'photo-elegante'
  | 'photo-barringer'
  | 'photo-north-ray'
  | 'photo-station-11'
  // Terranauta Playground (análogos de la Luna y de Marte)
  | 'arads-nasa'
  | 'pia03714-devon'
  | 'osinski-2020-gullies'
  | 'wiki-haughton'
  | 'yungay-location'
  | 'photo-pinacate-sentinel'
  | 'photo-meteor-aster'
  | 'photo-haughton-landsat'
  | 'photo-haughton-edge'
  | 'photo-k10-haughton';

export interface MissionSource {
  /** Título original de la fuente (no se traduce). */
  title: string;
  publisher: string;
  url: string;
  /**
   * `true` si el dato es un valor de ejemplo y no una medición real. El visor,
   * la bitácora y la ficha muestran entonces la etiqueta «dato simulado».
   * Hoy ninguna fuente lo es.
   */
  simulated?: boolean;
}

/** ¿Alguna de estas fuentes es un dato simulado? */
export function isSimulated(sourceIds: readonly SourceId[]): boolean {
  return sourceIds.some((id) => MISSION_SOURCES[id]?.simulated === true);
}

export const MISSION_SOURCES: Record<SourceId, MissionSource> = {
  // ---- Terranauta Playground ----
  'arads-nasa': {
    title: 'NASA Tests Life Detection Drill in the Atacama Desert (25 de abril de 2017)',
    publisher: 'NASA Astrobiology',
    url: 'https://astrobiology.nasa.gov/news/nasa-tests-life-detection-drill-in-the-atacama-desert/',
  },
  'pia03714-devon': {
    title: 'Mars Researchers Rendezvous on Remote Arctic Island (PIA03714)',
    publisher: 'NASA / JPL Photojournal',
    url: 'https://science.nasa.gov/photojournal/mars-researchers-rendezvous-on-remote-arctic-island',
  },
  'osinski-2020-gullies': {
    title:
      'Osinski et al. (2020), Gully Formation at the Haughton Impact Structure (Arctic Canada) Through the Melting of Snow and Ground Ice, with Implications for Gully Formation on Mars. LPSC 2020',
    publisher: 'NASA Technical Reports Server',
    url: 'https://ntrs.nasa.gov/citations/20200001979',
  },
  'wiki-haughton': {
    title: 'Haughton impact crater (coordenadas del cráter)',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Haughton_impact_crater',
  },
  'yungay-location': {
    title: 'Yungay, le cimetière.JPG — foto geolocalizada del pueblo de Yungay (ubicación aproximada)',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Yungay,_le_cimeti%C3%A8re.JPG',
  },
  'photo-pinacate-sentinel': {
    title: 'Craters dot the lava fields of El Pinacate in Mexico — contiene datos modificados de Copernicus Sentinel 2026',
    publisher: 'Wikimedia Commons / Copernicus (UE)',
    url: 'https://commons.wikimedia.org/wiki/File:Craters_dot_the_lava_fields_of_El_Pinacate_in_Mexico_(Copernicus_2026-11-08).webp',
  },
  'photo-meteor-aster': {
    title: 'Meteor Crater, Arizona (ASTER) — NASA/METI/AIST/Japan Space Systems, dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Meteor_Crater,_Arizona_(ASTER).jpg',
  },
  'photo-haughton-landsat': {
    title: 'Haughton Crater - Landsat 8 — Justin Cowart (datos de Landsat 8), dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Haughton_Crater_-_Landsat_8_(48010457521).png',
  },
  'photo-haughton-edge': {
    title: 'Edge of Haughton Crater — Haughton Mars Project (2008), dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Edge_of_Haughton_Crater_(2672692755).jpg',
  },
  'photo-k10-haughton': {
    title: 'K10 black rover at Haughton Crater — NASA (2007), dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:K10_black_rover_at_Haughton_Crater.jpg',
  },
  'copernicus-dem': {
    title: 'Copernicus DEM GLO-90 (2021)',
    publisher: 'ESA / Unión Europea (Copernicus)',
    url: 'https://doi.org/10.5270/ESA-c5d3d65',
  },
  'open-meteo': {
    title: 'Elevation API',
    publisher: 'Open-Meteo',
    url: 'https://open-meteo.com/en/docs/elevation-api',
  },
  sldem2015: {
    title: 'Moon LRO LOLA – SELENE Kaguya TC DEM Merge 60N60S 59m (SLDEM2015)',
    publisher: 'NASA (LRO/LOLA) · JAXA (Kaguya) · USGS Astrogeology',
    url: 'https://astrogeology.usgs.gov/search/map/moon_lro_lola_selene_kaguya_tc_dem_merge_60n60s_59m',
  },
  'alsj-north-ray': {
    title: 'Apollo 16 Lunar Surface Journal — Geology Station 11 at North Ray Crater',
    publisher: 'NASA Apollo Lunar Surface Journal',
    url: 'https://www.apollojournals.org/alsj/a16/a16.sta11.html',
  },
  'sp4214-lrv': {
    title: 'Where No Man Has Gone Before (NASA SP-4214), cap. 13-3 «Lunar Exploration Concluded»',
    publisher: 'NASA History',
    url: 'https://www.nasa.gov/wp-content/uploads/static/history/SP-4214/ch13-3.html',
  },
  'nssdc-lrv': {
    title: 'The Apollo Lunar Roving Vehicle',
    publisher: 'NASA Space Science Data Coordinated Archive',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html',
  },
  'nssdc-moon': {
    title: 'Moon Fact Sheet',
    publisher: 'NASA Space Science Data Coordinated Archive',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
  },
  'nasa-eo-pinacate': {
    title: 'Pinacates Biosphere Reserve',
    publisher: 'NASA Earth Observatory / Gateway to Astronaut Photography of Earth',
    url: 'https://eol.jsc.nasa.gov/Collections/EarthObservatory/articles/PinacatesBiosphereReservehtm.htm',
  },
  'usgs-arizona-training': {
    title: 'Walk in the footsteps of the Apollo astronauts: A field guide to northern Arizona astronaut training sites',
    publisher: 'USGS — Vaughan, Schindler, Stevens y Hough (2019)',
    url: 'https://www.usgs.gov/publications/walk-footsteps-apollo-astronauts-a-field-guide-northern-arizona-astronaut-training',
  },
  'photo-elegante': {
    title: 'Pinacate volcanic field.jpg — Richard Waitt, USGS (1988), dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Pinacate_volcanic_field.jpg',
  },
  'photo-barringer': {
    title: 'Barringer Crater aerial photo by USGS.jpg — USGS / D. Roddy, dominio público',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Barringer_Crater_aerial_photo_by_USGS.jpg',
  },
  'photo-north-ray': {
    title: 'North Ray crater AS16-P-4618 ASU.jpg — NASA (Apollo 16, cámara panorámica), CC0',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:North_Ray_crater_AS16-P-4618_ASU.jpg',
  },
  'photo-station-11': {
    title: 'Apollo 16 Station 11 rover TV panorama.jpg — NASA (cámara de TV del rover), montaje de J. Stuby, CC0',
    publisher: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Apollo_16_Station_11_rover_TV_panorama.jpg',
  },
};

export interface MissionPhoto {
  /** URL directa del archivo en Wikimedia Commons (o de una miniatura estándar). */
  src: string;
  width: number;
  height: number;
  sourceId: SourceId;
}

export interface MissionSite {
  id: MissionSiteId;
  body: 'earth' | 'moon';
  /** Centro del cráter (punto más bajo encontrado en el DEM). */
  center: { lat: number; lon: number };
  grid: TerrainGrid;
  demSourceId: SourceId;
  photo: MissionPhoto;
}

const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons';

const PHOTOS: Record<MissionSiteId, MissionPhoto> = {
  // Original de 640 px (no hay miniaturas mayores).
  'el-elegante': { src: `${COMMONS}/8/86/Pinacate_volcanic_field.jpg`, width: 640, height: 418, sourceId: 'photo-elegante' },
  'meteor-crater': {
    src: `${COMMONS}/thumb/0/0c/Barringer_Crater_aerial_photo_by_USGS.jpg/960px-Barringer_Crater_aerial_photo_by_USGS.jpg`,
    width: 960,
    height: 642,
    sourceId: 'photo-barringer',
  },
  'north-ray': { src: `${COMMONS}/a/aa/North_Ray_crater_AS16-P-4618_ASU.jpg`, width: 900, height: 900, sourceId: 'photo-north-ray' },
};

/** Panorama de la estación 11 tomado por la cámara del rover (contexto del reto). */
export const STATION_11_PANORAMA: MissionPhoto = {
  // Miniatura estándar: Commons limita la descarga directa del original (3036 px).
  src: `${COMMONS}/thumb/4/49/Apollo_16_Station_11_rover_TV_panorama.jpg/1280px-Apollo_16_Station_11_rover_TV_panorama.jpg`,
  width: 1280,
  height: 129,
  sourceId: 'photo-station-11',
};

/** Datos físicos del rover y de la Luna usados en la misión (con su fuente). */
export const ROVER_FACTS = {
  /** Pendiente máxima para subir y bajar (grados). */
  maxSlopeDeg: 25,
  maxSlopeSource: 'sp4214-lrv' as SourceId,
  /** Pendiente máxima para estacionarse (grados). */
  parkingSlopeDeg: 35,
  massKg: 210,
  groundClearanceCm: 36,
  vehicleSource: 'nssdc-lrv' as SourceId,
  moonGravity: 1.62,
  earthGravity: 9.8,
  gravitySource: 'nssdc-moon' as SourceId,
};

const sites = terrain.sites.map((site): MissionSite => {
  const id = site.id as MissionSiteId;
  const body = id === 'north-ray' ? 'moon' : 'earth';
  return {
    id,
    body,
    center: site.center,
    grid: { size: terrain.grid.size, step: terrain.grid.stepMeters, elevations: site.elevations },
    demSourceId: body === 'moon' ? 'sldem2015' : 'copernicus-dem',
    photo: PHOTOS[id],
  };
});

const siteMap = new Map(sites.map((site) => [site.id, site]));

export function getMissionSite(id: MissionSiteId): MissionSite {
  const site = siteMap.get(id);
  if (!site) throw new Error(`Sitio de misión no encontrado: ${id}`);
  return site;
}

export function isCandidateSite(value: unknown): value is CandidateSiteId {
  return value === 'el-elegante' || value === 'meteor-crater';
}

/** Metadatos de la descarga del DEM (fecha y resolución). */
export const TERRAIN_META = {
  generatedAt: terrain.generatedAt,
  earthResolutionMeters: terrain.sources.earth.resolutionMeters,
  moonResolutionMeters: terrain.sources.moon.resolutionMeters,
  gridStepMeters: terrain.grid.stepMeters,
  gridSize: terrain.grid.size,
};
