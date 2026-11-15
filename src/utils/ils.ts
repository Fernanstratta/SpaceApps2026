/**
 * Índice de Similitud Lunar (ILS) — cálculo puro, según el documento
 * «ILS: métricas y criterios de comparación» (esquema de datos 1.0.0).
 *
 *   Lineal:            S = 100 · max(0, 1 − |x_T − x_L| / R)
 *   Razón logarítmica: S = 100 · max(0, 1 − |log10(x_T / x_L)| / log10(R))
 *   Índice total:      ILS = Σ(w·S) / Σ w   (solo ejes con datos utilizables en los dos sitios)
 *
 * Reglas:
 *  - Un valor «provisional» nunca entra al ILS: su similitud se muestra aparte, con insignia.
 *  - Completitud = peso de los ejes con puntuación / peso total de los nueve ejes (9.25).
 *  - Similitud por ausencia: si en el eje de hielo ambos sitios son secos (clase 0),
 *    la similitud es 100 pero el peso baja (de 1.0 a 0.5) y se marca.
 */

export type AxisFormula = 'linear' | 'log';
export type Confidence = 'A' | 'B' | 'C';
/** Origen de cada dato. `provisional` queda fuera del cálculo. */
export type DataStatus = 'measured' | 'published' | 'reference' | 'provisional';

export interface AxisSpec {
  id: string;
  formula: AxisFormula;
  /** Tolerancia R: diferencia a partir de la cual la similitud llega a 0. */
  tolerance: number;
  weight: number;
  /** Peso reducido cuando ambos valores son 0 («similitud por ausencia»). */
  weightIfBothAbsent?: number;
  confidence: Confidence;
}

export interface AxisValue {
  value: number;
  status: DataStatus;
}

export interface AxisPairValues {
  earth?: AxisValue;
  moon?: AxisValue;
}

/** Similitud de un eje (0–100). `null` si no se puede calcular. */
export function similarity(axis: Pick<AxisSpec, 'formula' | 'tolerance'>, earth: number, moon: number): number | null {
  if (!Number.isFinite(earth) || !Number.isFinite(moon)) return null;
  if (axis.formula === 'linear') {
    if (axis.tolerance <= 0) return null;
    return 100 * Math.max(0, 1 - Math.abs(earth - moon) / axis.tolerance);
  }
  // Razón logarítmica: solo magnitudes positivas y R > 1.
  if (earth <= 0 || moon <= 0 || axis.tolerance <= 1) return null;
  return 100 * Math.max(0, 1 - Math.abs(Math.log10(earth / moon)) / Math.log10(axis.tolerance));
}

export type AxisState =
  /** Entra al ILS. */
  | 'scored'
  /** Hay valores en los dos lados, pero alguno es provisional: no entra al ILS. */
  | 'provisional'
  /** Solo hay dato en un lado (por ejemplo, un valor de referencia lunar). */
  | 'partial'
  | 'missing';

export interface AxisResult {
  axisId: string;
  state: AxisState;
  /** Similitud (también para ejes provisionales, que se muestran aparte). */
  similarity: number | null;
  /** Peso con el que entra al ILS (0 si no entra). */
  weight: number;
  /** Ambos sitios en 0: similitud 100 que no aporta información. */
  byAbsence: boolean;
}

export interface IlsResult {
  /** `null` si ningún eje tiene datos utilizables en los dos sitios. */
  ils: number | null;
  axes: AxisResult[];
  scoredCount: number;
  /** Fracción (0–1) del peso total cubierta por ejes con puntuación. */
  completeness: number;
  /** El ILS no cubre todos los ejes. */
  partial: boolean;
  hasProvisional: boolean;
}

/** Peso total de los ejes (9.25 con los nueve del documento). */
export function totalWeight(axes: readonly AxisSpec[]): number {
  return axes.reduce((sum, axis) => sum + axis.weight, 0);
}

export function computeIls(axes: readonly AxisSpec[], values: Readonly<Record<string, AxisPairValues | undefined>>): IlsResult {
  let weighted = 0;
  let usedWeight = 0;
  let coveredWeight = 0;
  let hasProvisional = false;

  const results = axes.map((axis): AxisResult => {
    const pair = values[axis.id];
    const earth = pair?.earth;
    const moon = pair?.moon;
    if (earth?.status === 'provisional' || moon?.status === 'provisional') hasProvisional = true;
    if (!earth && !moon) return { axisId: axis.id, state: 'missing', similarity: null, weight: 0, byAbsence: false };
    if (!earth || !moon) return { axisId: axis.id, state: 'partial', similarity: null, weight: 0, byAbsence: false };

    const s = similarity(axis, earth.value, moon.value);
    if (earth.status === 'provisional' || moon.status === 'provisional') {
      return { axisId: axis.id, state: 'provisional', similarity: s, weight: 0, byAbsence: false };
    }
    if (s === null) return { axisId: axis.id, state: 'partial', similarity: null, weight: 0, byAbsence: false };

    const byAbsence = axis.weightIfBothAbsent !== undefined && earth.value === 0 && moon.value === 0;
    const weight = byAbsence ? (axis.weightIfBothAbsent ?? axis.weight) : axis.weight;
    weighted += weight * s;
    usedWeight += weight;
    coveredWeight += axis.weight;
    return { axisId: axis.id, state: 'scored', similarity: s, weight, byAbsence };
  });

  const scoredCount = results.filter((r) => r.state === 'scored').length;
  const total = totalWeight(axes);
  return {
    ils: usedWeight > 0 ? weighted / usedWeight : null,
    axes: results,
    scoredCount,
    completeness: total > 0 ? coveredWeight / total : 0,
    partial: scoredCount > 0 && scoredCount < axes.length,
    hasProvisional,
  };
}
