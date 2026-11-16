/**
 * A single sourced measurement shown in an Earth / Moon information panel.
 * Values must never be invented. Earth–Moon comparison data does NOT live in
 * this type: it comes from the backend catalog (`data/lunarAnalogs.ts`) and
 * is referenced by a `SubmoduleComparison`.
 */
export interface Measurement {
  id: string;
  label: string;
  value: number | string;
  unit: string | null;
  sourceId: string | null;
  notes: string | null;
}
