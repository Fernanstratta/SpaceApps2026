import { type AnalogPair, type AnalogyType, getLunarAnalogCatalog, type PairId, type PhotoCredit } from './lunarAnalogs';

export type PlaygroundPhoto = PhotoCredit;

/** Un área del Playground: un par del catálogo ILS, visto desde su sitio terrestre. */
export interface PlaygroundArea {
  id: PairId;
  /** Número fijo del área (1…n, orden del catálogo): se muestra en el mapa y en el selector. */
  number: number;
  analogOf: 'moon';
  analogyType: AnalogyType;
  /** ILS del par (0–100), tal como lo envía el backend. `null` si el par no tiene ejes comparables. */
  similarity: number | null;
  /** Centro del sitio terrestre (grados decimales). */
  lat: number;
  lon: number;
  zoom: number;
  /** Radio del área de análisis terrestre, en metros. */
  radiusM: number;
  /** La coordenada terrestre todavía es provisional (`coordinate_status` del backend). */
  approximate: boolean;
  pair: AnalogPair;
}

export const PLAYGROUND_AREAS: readonly PlaygroundArea[] = getLunarAnalogCatalog().pairs.map((pair) => ({
  id: pair.id,
  number: pair.number,
  analogOf: 'moon',
  analogyType: pair.analogyType,
  similarity: pair.data.ils.value,
  lat: pair.data.earth_site.lat,
  lon: pair.data.earth_site.lon,
  zoom: pair.zoom,
  radiusM: pair.data.earth_site.aoi.radius_m,
  approximate: pair.data.earth_site.coordinate_status === 'provisional',
  pair,
}));
