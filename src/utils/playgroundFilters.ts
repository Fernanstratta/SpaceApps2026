import type { AxisId } from '../types/Axis';

/**
 * Filtros de Starman Playground (funciones puras, probadas en
 * `scripts/verify-playground.ts`). Todos son opcionales: sin filtros se ven
 * todas las comparaciones.
 *
 *  - Ejes: se puede elegir uno o varios. Un área se muestra si está asociada a
 *    CUALQUIERA de los ejes elegidos (unión).
 *  - Similitud mínima (0–100 %): preparado para cuando existan porcentajes
 *    reales. Un área SIN dato (`similarity === null`) nunca se excluye, así
 *    que mientras no haya datos el filtro no produce resultados y no afecta
 *    a los demás filtros.
 */

export interface FilterableArea {
  axes: readonly AxisId[];
  similarity: number | null;
}

export interface PlaygroundFilters {
  axes: readonly AxisId[];
  /** Similitud mínima en porcentaje (0 = sin filtro). */
  minSimilarity: number;
}

export const NO_FILTERS: PlaygroundFilters = { axes: [], minSimilarity: 0 };

export const SIMILARITY_MIN = 0;
export const SIMILARITY_MAX = 100;
export const SIMILARITY_STEP = 5;

export function clampSimilarity(value: number): number {
  if (!Number.isFinite(value)) return SIMILARITY_MIN;
  return Math.min(SIMILARITY_MAX, Math.max(SIMILARITY_MIN, Math.round(value)));
}

export function matchesAxes(area: FilterableArea, axes: readonly AxisId[]): boolean {
  return axes.length === 0 || axes.some((axis) => area.axes.includes(axis));
}

export function matchesSimilarity(area: FilterableArea, minSimilarity: number): boolean {
  if (minSimilarity <= SIMILARITY_MIN) return true;
  // Sin datos reales todavía: no se filtra (ni se inventa un valor).
  if (area.similarity === null) return true;
  return area.similarity >= minSimilarity;
}

export function filterAreas<T extends FilterableArea>(areas: readonly T[], filters: PlaygroundFilters): T[] {
  return areas.filter((area) => matchesAxes(area, filters.axes) && matchesSimilarity(area, filters.minSimilarity));
}

/** ¿Algún área tiene porcentaje de similitud real? Mientras sea `false`, el slider solo muestra su valor. */
export function hasSimilarityData(areas: readonly FilterableArea[]): boolean {
  return areas.some((area) => area.similarity !== null);
}

export function hasActiveFilters(filters: PlaygroundFilters): boolean {
  return filters.axes.length > 0 || filters.minSimilarity > SIMILARITY_MIN;
}

/** Añade o quita un eje de la selección, conservando el orden del documento. */
export function toggleAxis(selected: readonly AxisId[], axis: AxisId, order: readonly AxisId[]): AxisId[] {
  const next = selected.includes(axis) ? selected.filter((a) => a !== axis) : [...selected, axis];
  return order.filter((a) => next.includes(a));
}
