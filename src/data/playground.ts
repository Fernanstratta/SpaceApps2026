import type { MissionSiteId } from './missions/roverMission';
import { type AnalogyType, type AxisId, getLunarAnalogCatalog, pairAxes, type PairId, type PhotoCredit } from './lunarAnalogs';

export type PlaygroundPhoto = PhotoCredit;

/** Un área del Playground: el sitio terrestre de un par del catálogo ILS. */
export interface PlaygroundArea {
  id: PairId;
  /** Número fijo del área (1…n, orden del documento): se muestra en el mapa y en el selector. */
  number: number;
  analogOf: 'moon';
  analogyType: AnalogyType;
  /** Ejes comparativos asociados al par (filtro por eje). */
  axes: readonly AxisId[];
  /**
   * Porcentaje de similitud Tierra–Luna (0–100). `null` mientras no existan
   * datos reales: el filtro de similitud no excluye áreas sin dato.
   */
  similarity: number | null;
  lat: number;
  lon: number;
  zoom: number;
  /** Coordenadas provisionales (pendientes de confirmar). */
  approximate: boolean;
  photos: readonly PlaygroundPhoto[];
  terrainSiteId: MissionSiteId | null;
}

export const PLAYGROUND_AREAS: readonly PlaygroundArea[] = getLunarAnalogCatalog().pairs.map((pair, index) => ({
  id: pair.id,
  number: index + 1,
  analogOf: 'moon',
  analogyType: pair.analogyType,
  axes: pairAxes(pair),
  similarity: pair.similarityPercent,
  lat: pair.earth.lat,
  lon: pair.earth.lon,
  zoom: pair.earth.zoom,
  approximate: pair.earth.provisionalCoords,
  photos: pair.earth.photos,
  terrainSiteId: pair.terrainSiteId,
}));
