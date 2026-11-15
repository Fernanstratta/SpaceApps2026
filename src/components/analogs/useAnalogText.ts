import { useMemo } from 'react';
import type { AnalogAxis, AnalogPair, AxisSide } from '../../data/lunarAnalogs';
import { useI18n } from '../../i18n/I18nContext';
import { PLAYGROUND_TEXT } from '../../i18n/playground';
import type { AxisId } from '../../types/Axis';
import { formatAxisValue, formatNumber, formatPercent, formatScore, type ValueLabels } from '../../utils/analogFormat';

/**
 * Textos y formato del catálogo de análogos en el idioma activo. Todos los
 * componentes de `components/analogs` leen de aquí, así que las lecciones del
 * Portal y el Playground muestran los datos del backend exactamente igual.
 */
export function useAnalogText() {
  const { language, locale } = useI18n();
  return useMemo(() => {
    const t = PLAYGROUND_TEXT[language];
    const labels: ValueLabels = t.table.value;
    return {
      t,
      language,
      locale,
      labels,
      /** Valor de un lado («0.667», «31.4 K», «clase 0») o «Sin dato». */
      value: (axisId: AxisId, side: AxisSide | null) => (side ? formatAxisValue(axisId, side.value, locale, labels) : t.table.noValue),
      /** Similitud con una decimal, o «Sin dato comparable». Nunca convierte un faltante en 0. */
      similarity: (axis: AnalogAxis) => (axis.available && axis.similarity !== null ? formatScore(axis.similarity, locale) : t.table.noComparable),
      score: (value: number) => formatScore(value, locale),
      weight: (value: number) => formatNumber(value, locale, 2),
      number: (value: number, digits = 3) => formatNumber(value, locale, digits),
      percent: (fraction: number) => formatPercent(fraction, locale),
      ils: (pair: AnalogPair) => (pair.data.ils.value === null ? null : formatScore(pair.data.ils.value, locale)),
    };
  }, [language, locale]);
}

export type AnalogText = ReturnType<typeof useAnalogText>;
