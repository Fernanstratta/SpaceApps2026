import type { MissionSiteId } from './missions/roverMission';
import { getLunarAnalogCatalog, type AnalogyType, type PairId, type PhotoCredit } from './lunarAnalogs';

export type PlaygroundPhoto = PhotoCredit;

/** Un área del Playground: el sitio terrestre de un par del catálogo ILS. */
export interface PlaygroundArea {
  id: PairId;
  analogOf: 'moon';
  analogyType: AnalogyType;
  lat: number;
  lon: number;
  zoom: number;
  /** Coordenadas provisionales (pendientes de confirmar). */
  approximate: boolean;
  photos: readonly PlaygroundPhoto[];
  terrainSiteId: MissionSiteId | null;
}

export const PLAYGROUND_AREAS: readonly PlaygroundArea[] = getLunarAnalogCatalog().pairs.map((pair) => ({
  id: pair.id,
  analogOf: 'moon',
  analogyType: pair.analogyType,
  lat: pair.earth.lat,
  lon: pair.earth.lon,
  zoom: pair.earth.zoom,
  approximate: pair.earth.provisionalCoords,
  photos: pair.earth.photos,
  terrainSiteId: pair.terrainSiteId,
}));
