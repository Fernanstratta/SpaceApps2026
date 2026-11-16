/**
 * Filtro de Terranauta Playground (funciones puras, probadas en
 * `scripts/verify-playground.ts`).
 *
 * El único filtro es el ILS mínimo (0–100). Un par SIN índice
 * (`similarity === null`) nunca se excluye ni se trata como 0: no tener dato
 * no es lo mismo que parecerse poco.
 *
 * Los ejes ya no filtran pares (con los datos del backend casi todos los
 * pares tienen los nueve ejes): elegir un eje abre su comparación en los
 * cinco pares («Explorar por eje»).
 */

export interface FilterableArea {
  similarity: number | null;
}

export interface PlaygroundFilters {
  /** ILS mínimo (0 = sin filtro). */
  minSimilarity: number;
}

export const NO_FILTERS: PlaygroundFilters = { minSimilarity: 0 };

export const SIMILARITY_MIN = 0;
export const SIMILARITY_MAX = 100;
export const SIMILARITY_STEP = 5;

export function clampSimilarity(value: number): number {
  if (!Number.isFinite(value)) return SIMILARITY_MIN;
  return Math.min(SIMILARITY_MAX, Math.max(SIMILARITY_MIN, Math.round(value)));
}

export function matchesSimilarity(area: FilterableArea, minSimilarity: number): boolean {
  if (minSimilarity <= SIMILARITY_MIN) return true;
  // Sin índice: no se filtra (ni se inventa un valor).
  if (area.similarity === null) return true;
  return area.similarity >= minSimilarity;
}

export function filterAreas<T extends FilterableArea>(areas: readonly T[], filters: PlaygroundFilters): T[] {
  return areas.filter((area) => matchesSimilarity(area, filters.minSimilarity));
}

export function hasActiveFilters(filters: PlaygroundFilters): boolean {
  return filters.minSimilarity > SIMILARITY_MIN;
}
