/**
 * Data availability states used across the app.
 *  - 'pending'   → value is `null` / `undefined` (data not yet provided).
 *  - 'empty'     → value was provided but has no entries (e.g. `[]`, `''`).
 *  - 'available' → value can be rendered.
 */
export type DataState = 'pending' | 'empty' | 'available';

export function getDataState(value: unknown): DataState {
  if (value === null || value === undefined) return 'pending';
  if (Array.isArray(value) && value.length === 0) return 'empty';
  if (typeof value === 'string' && value.trim().length === 0) return 'empty';
  return 'available';
}

export function isProvided<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
