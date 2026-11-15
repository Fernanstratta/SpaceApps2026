import type { CaveatContext, CaveatId, CaveatText } from '../i18n/playground.es';
import type { AxisId } from '../types/Axis';
import { formatAxisValue, formatNumber, formatPercent, formatScore, timesLarger, type ValueLabels } from '../utils/analogFormat';
import { type AnalogAxis, type AnalogPair, type AxisSide, getPair, isComparable, pairAxis, type PairId } from './lunarAnalogs';

/**
 * Advertencias de lectura de cada eje (sección 8 de `contexto.txt`).
 *
 * Cada regla decide, mirando SOLO los datos del backend, si una advertencia
 * aplica a un eje de un par. Los textos están en `i18n/playground.{es,en}.ts`
 * y citan los valores del backend a través de `CaveatContext`, así que no
 * repiten números a mano.
 *  - `limitation`: el dato tiene una limitación conocida (se marca con una insignia).
 *  - `note`: cómo debe leerse el dato.
 */
export type CaveatKind = 'limitation' | 'note';

interface CaveatRule {
  id: CaveatId;
  axis: AxisId;
  kind: CaveatKind;
  applies: (axis: AnalogAxis, pair: AnalogPair) => boolean;
}

/** Celdas de más de 5 km: valor regional, mayor que cualquier área de análisis del catálogo. */
const REGIONAL_CELL_M = 5000;

const sourceIncludes = (side: AxisSide | null, text: string) => Boolean(side?.source.includes(text));

const RULES: readonly CaveatRule[] = [
  // Eje 1
  { id: 'slopeResolution', axis: 'slope', kind: 'note', applies: (axis) => axis.earth?.resolution_m !== undefined },
  // Eje 2
  { id: 'roughnessPercentile', axis: 'roughness', kind: 'note', applies: (axis) => Boolean(axis.earth?.raw && axis.moon?.raw) },
  // Eje 3
  { id: 'mineralogyLinne', axis: 'mineralogy', kind: 'limitation', applies: (_axis, pair) => pair.data.moon_site.site_id === 'linne' },
  { id: 'mineralogyQuartz', axis: 'mineralogy', kind: 'limitation', applies: (axis) => sourceIncludes(axis.earth, 'MODIS') },
  { id: 'mineralogySubstitute', axis: 'mineralogy', kind: 'limitation', applies: (axis) => sourceIncludes(axis.earth, 'sustituto') },
  // Eje 4
  { id: 'albedoShackleton', axis: 'albedo', kind: 'limitation', applies: (axis) => sourceIncludes(axis.moon, 'LOLA') },
  // Eje 5
  { id: 'thermalReal', axis: 'thermal', kind: 'note', applies: (axis) => isComparable(axis) },
  { id: 'thermalRegional', axis: 'thermal', kind: 'limitation', applies: (axis) => (axis.moon?.resolution_m ?? 0) > REGIONAL_CELL_M },
  // Eje 6
  { id: 'aridityReference', axis: 'aridity', kind: 'note', applies: (axis) => axis.moon?.status === 'reference' },
  // Eje 7
  { id: 'iceAbsence', axis: 'ice', kind: 'note', applies: (axis) => axis.flag === 'similitud_por_ausencia' },
  { id: 'iceShackleton', axis: 'ice', kind: 'limitation', applies: (_axis, pair) => pair.data.moon_site.site_id === 'shackleton' },
  {
    id: 'iceSubstitute',
    axis: 'ice',
    kind: 'limitation',
    applies: (axis) => sourceIncludes(axis.earth, 'sustituto') || (axis.earth?.resolution_m ?? 0) > REGIONAL_CELL_M,
  },
  // Eje 8
  { id: 'dustModel', axis: 'dust', kind: 'limitation', applies: (axis) => sourceIncludes(axis.earth, 'SoilGrids') },
  // Eje 9
  { id: 'cratersMissing', axis: 'craters', kind: 'note', applies: (axis) => !axis.available },
];

export interface Caveat {
  id: CaveatId;
  axis: AxisId;
  kind: CaveatKind;
}

/** Advertencias que aplican a un eje de un par, primero las limitaciones. */
export function caveatsFor(pair: AnalogPair, axisId: AxisId): Caveat[] {
  const axis = pairAxis(pair, axisId);
  return RULES.filter((rule) => rule.axis === axisId && rule.applies(axis, pair))
    .map(({ id, axis: ruleAxis, kind }) => ({ id, axis: ruleAxis, kind }))
    .sort((a, b) => Number(b.kind === 'limitation') - Number(a.kind === 'limitation'));
}

/** ¿El eje de este par lleva la insignia «dato con limitaciones conocidas»? */
export function hasKnownLimitation(pair: AnalogPair, axisId: AxisId): boolean {
  return caveatsFor(pair, axisId).some((caveat) => caveat.kind === 'limitation');
}

/** Valor crudo del instrumento con sus unidades («-6.434 dB»). */
export function formatRaw(side: AxisSide | null, locale: string): string | null {
  if (!side?.raw) return null;
  const number = formatNumber(side.raw.value, locale, 3);
  return side.raw.units ? `${number} ${side.raw.units}` : number;
}

/** Valores del backend, ya con formato, que el texto de una advertencia puede citar. */
export function caveatContext(pair: AnalogPair, axisId: AxisId, locale: string, labels: ValueLabels): CaveatContext {
  const axis = pairAxis(pair, axisId);
  const side = (value: AxisSide | null) => (value ? formatAxisValue(axisId, value.value, locale, labels) : '—');
  const times = axis.earth && axis.moon ? timesLarger(axis.earth.value, axis.moon.value) : null;
  const cellM = Math.max(axis.earth?.resolution_m ?? 0, axis.moon?.resolution_m ?? 0);
  return {
    earth: side(axis.earth),
    moon: side(axis.moon),
    earthRaw: formatRaw(axis.earth, locale) ?? '—',
    moonRaw: formatRaw(axis.moon, locale) ?? '—',
    similarity: axis.similarity === null ? '—' : formatScore(axis.similarity, locale),
    weight: formatNumber(axis.weight, locale, 2),
    completeness: formatPercent(pair.data.ils.data_completeness, locale),
    times: times === null ? '—' : formatNumber(times, locale, 0),
    cellKm: cellM > 0 ? formatNumber(cellM / 1000, locale, 0) : '—',
    resolutionM: axis.earth?.resolution_m !== undefined ? formatNumber(axis.earth.resolution_m, locale, 0) : '—',
    value: (otherPair: PairId, otherAxis: AxisId, body) => {
      const other = pairAxis(getPair(otherPair), otherAxis)[body];
      return other ? formatAxisValue(otherAxis, other.value, locale, labels) : '—';
    },
  };
}

/** Texto ya resuelto de una advertencia. */
export function resolveCaveat(caveat: Caveat, text: CaveatText, pair: AnalogPair, locale: string, labels: ValueLabels): { title: string; body: string } {
  return { title: text.title, body: text.text(caveatContext(pair, caveat.axis, locale, labels)) };
}
