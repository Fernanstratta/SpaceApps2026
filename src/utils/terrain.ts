/**
 * Análisis de terreno a partir de una malla de elevaciones (DEM).
 * Funciones puras: se usan en el visor y en `scripts/verify-mission.ts`.
 *
 * Convenciones: la malla es cuadrada, fila 0 = norte, columna 0 = oeste,
 * separación `step` metros entre puntos. Las pendientes salen en grados.
 */

export interface TerrainGrid {
  size: number;
  step: number;
  /** `size × size` valores en metros, por filas. */
  elevations: readonly number[];
}

export type TransectDirection = 'west-east' | 'north-south';

export interface ProfilePoint {
  /** Distancia desde el inicio del tramo, en metros. */
  distance: number;
  /** Elevación del DEM, en metros. */
  elevation: number;
  /** Altura sobre el punto más bajo del tramo, en metros. */
  height: number;
  /** Pendiente del segmento que llega a este punto (0 en el primero), en grados. */
  slope: number;
}

export interface TransectStats {
  /** Profundidad: altura del borde más bajo sobre el fondo, en metros. */
  depth: number;
  /** Pendiente máxima de un segmento de la pared (entre los dos bordes), en grados. */
  maxSlope: number;
  /** Pendiente media de los segmentos de la pared, en grados. */
  meanSlope: number;
  /** Distancia horizontal entre los dos bordes del cráter, en metros. */
  rimToRim: number;
  /** Índices del perfil: borde oeste/norte, fondo y borde este/sur. */
  rimStart: number;
  bottom: number;
  rimEnd: number;
}

/** Tolerancia para no cortar la pared por pequeñas irregularidades del DEM (m). */
const RIM_TOLERANCE_M = 3;

/**
 * Borde del cráter a un lado del fondo: se sube mientras el terreno siga
 * ascendiendo (con una pequeña tolerancia) y se toma el punto más alto.
 * Así el borde no se confunde con terreno más alto que haya más lejos.
 */
function findRim(heights: number[], bottom: number, direction: -1 | 1): number {
  let i = bottom;
  let best = bottom;
  while (i + direction >= 0 && i + direction < heights.length) {
    const next = heights[i + direction] ?? 0;
    if (next < (heights[best] ?? 0) - RIM_TOLERANCE_M) break;
    i += direction;
    if (next > (heights[best] ?? 0)) best = i;
  }
  return best;
}

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export function elevationAt(grid: TerrainGrid, row: number, col: number): number {
  const r = Math.min(grid.size - 1, Math.max(0, row));
  const c = Math.min(grid.size - 1, Math.max(0, col));
  return grid.elevations[r * grid.size + c] ?? 0;
}

/** Pendiente de cada celda (diferencias centradas; en los bordes, laterales). */
export function slopeGrid(grid: TerrainGrid): number[] {
  const out: number[] = [];
  for (let r = 0; r < grid.size; r += 1) {
    for (let c = 0; c < grid.size; c += 1) {
      const dx = (elevationAt(grid, r, c + 1) - elevationAt(grid, r, c - 1)) / (2 * grid.step);
      const dy = (elevationAt(grid, r + 1, c) - elevationAt(grid, r - 1, c)) / (2 * grid.step);
      out.push(toDegrees(Math.atan(Math.hypot(dx, dy))));
    }
  }
  return out;
}

/**
 * Relieve sombreado (0–1) con luz desde el noroeste (azimut 315°, 45° de
 * altura), el estándar cartográfico. `exaggeration` acentúa el relieve.
 */
export function hillshadeGrid(grid: TerrainGrid, exaggeration = 2): number[] {
  // Fórmula estándar (ESRI / GDAL): ángulo cenital y azimut en ángulo matemático.
  const zenith = ((90 - 45) * Math.PI) / 180;
  const azimuthMath = ((360 - 315 + 90) * Math.PI) / 180;
  const out: number[] = [];
  for (let r = 0; r < grid.size; r += 1) {
    for (let c = 0; c < grid.size; c += 1) {
      const dzdx = ((elevationAt(grid, r, c + 1) - elevationAt(grid, r, c - 1)) / (2 * grid.step)) * exaggeration;
      // Fila creciente = hacia el sur (igual que las filas de un ráster en GDAL).
      const dzdy = ((elevationAt(grid, r + 1, c) - elevationAt(grid, r - 1, c)) / (2 * grid.step)) * exaggeration;
      const slope = Math.atan(Math.hypot(dzdx, dzdy));
      const aspect = Math.atan2(dzdy, -dzdx);
      const shade =
        Math.cos(zenith) * Math.cos(slope) + Math.sin(zenith) * Math.sin(slope) * Math.cos(azimuthMath - aspect);
      out.push(Math.min(1, Math.max(0, shade)));
    }
  }
  return out;
}

/** Perfil del tramo que cruza el centro de la malla. */
export function transectProfile(grid: TerrainGrid, direction: TransectDirection): ProfilePoint[] {
  const middle = (grid.size - 1) / 2;
  const elevations = Array.from({ length: grid.size }, (_, i) =>
    direction === 'west-east' ? elevationAt(grid, middle, i) : elevationAt(grid, i, middle),
  );
  const lowest = Math.min(...elevations);
  return elevations.map((elevation, i) => ({
    distance: i * grid.step,
    elevation,
    height: elevation - lowest,
    slope: i === 0 ? 0 : toDegrees(Math.atan(Math.abs(elevation - (elevations[i - 1] ?? elevation)) / grid.step)),
  }));
}

export function transectStats(profile: ProfilePoint[]): TransectStats {
  const heights = profile.map((point) => point.height);
  const bottom = heights.indexOf(Math.min(...heights));
  const rimStart = findRim(heights, bottom, -1);
  const rimEnd = findRim(heights, bottom, 1);
  // Segmentos de la pared: los que llegan a los puntos rimStart+1 … rimEnd.
  const wallSlopes = profile.slice(rimStart + 1, rimEnd + 1).map((point) => point.slope);
  return {
    depth: Math.min(heights[rimStart] ?? 0, heights[rimEnd] ?? 0) - (heights[bottom] ?? 0),
    maxSlope: wallSlopes.length ? Math.max(...wallSlopes) : 0,
    meanSlope: wallSlopes.reduce((sum, s) => sum + s, 0) / Math.max(1, wallSlopes.length),
    rimToRim: (profile[rimEnd]?.distance ?? 0) - (profile[rimStart]?.distance ?? 0),
    rimStart,
    bottom,
    rimEnd,
  };
}

/** Clase de pendiente para colorear capas y perfiles (umbral del rover: 25°). */
export type SlopeClass = 'gentle' | 'moderate' | 'steep' | 'over-limit';

export const SLOPE_CLASS_LIMITS = { gentle: 10, moderate: 20, steep: 25 } as const;

export function slopeClass(degrees: number): SlopeClass {
  if (degrees < SLOPE_CLASS_LIMITS.gentle) return 'gentle';
  if (degrees < SLOPE_CLASS_LIMITS.moderate) return 'moderate';
  if (degrees < SLOPE_CLASS_LIMITS.steep) return 'steep';
  return 'over-limit';
}
