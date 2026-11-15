import { getMissionSite, MISSION_SITE_IDS, type MissionSiteId } from '../../data/missions/roverMission';
import {
  hillshadeGrid,
  slopeGrid,
  transectProfile,
  transectStats,
  type ProfilePoint,
  type SlopeClass,
  type TransectDirection,
  type TransectStats,
} from '../../utils/terrain';

/** Colores de las clases de pendiente (RGB), compartidos por el mapa y el perfil. */
export const SLOPE_COLORS: Record<SlopeClass, [number, number, number]> = {
  gentle: [47, 181, 165],
  moderate: [242, 179, 61],
  steep: [226, 113, 74],
  'over-limit': [215, 38, 61],
};

export const slopeColor = (slope: SlopeClass, alpha = 1) => {
  const [r, g, b] = SLOPE_COLORS[slope];
  return alpha === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${alpha})`;
};

export const DIRECTIONS: readonly TransectDirection[] = ['west-east', 'north-south'];

interface SiteTerrain {
  shade: number[];
  slopes: number[];
  profiles: Record<TransectDirection, { points: ProfilePoint[]; stats: TransectStats }>;
}

/** Cálculos por sitio (se hacen una sola vez; los datos son estáticos). */
const cache = new Map<MissionSiteId, SiteTerrain>();

export function getSiteTerrain(id: MissionSiteId): SiteTerrain {
  let terrain = cache.get(id);
  if (!terrain) {
    const { grid } = getMissionSite(id);
    const profile = (direction: TransectDirection) => {
      const points = transectProfile(grid, direction);
      return { points, stats: transectStats(points) };
    };
    terrain = {
      shade: hillshadeGrid(grid),
      slopes: slopeGrid(grid),
      profiles: { 'west-east': profile('west-east'), 'north-south': profile('north-south') },
    };
    cache.set(id, terrain);
  }
  return terrain;
}

/**
 * Altura máxima del eje vertical, común a los tres sitios y a las dos
 * direcciones: así los perfiles se comparan con la misma escala.
 */
export const PROFILE_Y_MAX = (() => {
  const max = Math.max(
    ...MISSION_SITE_IDS.flatMap((id) =>
      DIRECTIONS.flatMap((direction) => getSiteTerrain(id).profiles[direction].points.map((p) => p.height)),
    ),
  );
  return Math.ceil(max / 50) * 50;
})();
