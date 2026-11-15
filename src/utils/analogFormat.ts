import type { AxisId } from '../types/Axis';

/**
 * Formato de los valores del catálogo de análogos. Aquí solo se da formato:
 * ninguna función calcula similitudes ni el ILS (eso lo hace el backend).
 */

const formatters = new Map<string, Intl.NumberFormat>();

function numberFormat(locale: string, min: number, max: number): Intl.NumberFormat {
  const key = `${locale}|${min}|${max}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, { minimumFractionDigits: min, maximumFractionDigits: max });
    formatters.set(key, format);
  }
  return format;
}

/** Decimales máximos con que se muestra el valor comparado de cada eje. */
const VALUE_DIGITS: Record<AxisId, number> = {
  slope: 3,
  roughness: 3,
  mineralogy: 3,
  albedo: 3,
  thermal: 1,
  aridity: 3,
  ice: 0,
  dust: 3,
  craters: 3,
};

export function formatNumber(value: number, locale: string, maxDigits = 3, minDigits = 0): string {
  return numberFormat(locale, minDigits, maxDigits).format(value);
}

/** Valor comparado de un eje, solo el número (p. ej. «0.667», «31.4», «0»). */
export function formatAxisNumber(axisId: AxisId, value: number, locale: string): string {
  return formatNumber(value, locale, VALUE_DIGITS[axisId]);
}

export interface ValueLabels {
  /** «31.4 K». */
  kelvin: (value: string) => string;
  /** «clase 0». */
  iceClass: (value: string) => string;
}

/** Valor comparado de un eje con su unidad corta cuando la tiene («31.4 K», «clase 0», «0.667»). */
export function formatAxisValue(axisId: AxisId, value: number, locale: string, labels: ValueLabels): string {
  const number = formatAxisNumber(axisId, value, locale);
  if (axisId === 'thermal') return labels.kelvin(number);
  if (axisId === 'ice') return labels.iceClass(number);
  return number;
}

/** ILS y similitudes: siempre con una decimal, como los envía la API («53.3», «0.0», «100.0»). */
export function formatScore(value: number, locale: string): string {
  return numberFormat(locale, 1, 1).format(value);
}

/** Fracción 0–1 como porcentaje entero («89 %»). */
export function formatPercent(fraction: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(fraction);
}

export function formatKm(meters: number, locale: string): string {
  return `${formatNumber(meters / 1000, locale, 2)} km`;
}

/**
 * Cuántas veces es mayor un valor que el otro (para explicar la amplitud
 * térmica: «la Luna oscila ~9 veces más»). `null` si no se puede dividir.
 */
export function timesLarger(a: number, b: number): number | null {
  const [small, large] = a < b ? [a, b] : [b, a];
  if (!(small > 0) || !Number.isFinite(large)) return null;
  return large / small;
}

export interface CardinalLabels {
  n: string;
  s: string;
  e: string;
  w: string;
}

/** «31.8467° N, 113.3913° O» (4 decimales, como las coordenadas del backend). */
export function formatLatLon(lat: number, lon: number, locale: string, dir: CardinalLabels): string {
  const part = (value: number, positive: string, negative: string) =>
    `${formatNumber(Math.abs(value), locale, 4)}° ${value >= 0 ? positive : negative}`;
  return `${part(lat, dir.n, dir.s)}, ${part(lon, dir.e, dir.w)}`;
}
