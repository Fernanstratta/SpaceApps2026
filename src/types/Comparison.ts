/**
 * A single sourced measurement. Values must never be invented: every
 * measurement should reference a resource id from `src/data/resources.ts`.
 */
export interface Measurement {
  id: string;
  label: string;
  value: number | string;
  unit: string | null;
  sourceId: string | null;
  notes: string | null;
}

/** An Earth–Moon comparison for one property. */
export interface Comparison {
  id: string;
  /** Property being compared, e.g. "Radio ecuatorial". */
  label: string;
  earth: Measurement;
  moon: Measurement;
  /** Optional Moon/Earth ratio as published by the source. */
  ratio: number | null;
  explanation: string | null;
  sourceIds: string[];
}
