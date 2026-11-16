import type { AnalogPair } from '../../data/lunarAnalogs';
import { useAnalogText } from './useAnalogText';

/**
 * ILS de un par, con una decimal como lo envía la API, junto con la
 * completitud y los ejes usados. Si el backend no envía índice (`null`), se
 * dice «sin datos comparables»: nunca se muestra 0.
 */
export function IlsSummary({ pair, compact = false, showDisclaimer = !compact }: { pair: AnalogPair; compact?: boolean; showDisclaimer?: boolean }) {
  const { t, ils, percent } = useAnalogText();
  const { ils: data, axes } = pair.data;
  const value = ils(pair);
  const completeness = percent(data.data_completeness);

  return (
    <div className={`ils-summary${compact ? ' ils-summary--compact' : ''}`}>
      <div className="ils-summary__score" role="group" aria-label={value ? t.ils.aria(value, completeness) : t.ils.noData}>
        <span className="ils-summary__label">{compact ? t.ils.short : t.ils.name}</span>
        {value ? (
          <span className="ils-summary__value" aria-hidden="true">
            {value}
            <span className="ils-summary__out-of"> {t.ils.outOf}</span>
          </span>
        ) : (
          <span className="ils-summary__value ils-summary__value--none" aria-hidden="true">
            {t.ils.noData}
          </span>
        )}
      </div>
      <div className="ils-summary__completeness">
        <span className="ils-summary__label" title={t.ils.completenessHint}>
          {t.ils.completeness}
        </span>
        <span className="ils-summary__meter" aria-hidden="true">
          <span className="ils-summary__meter-fill" style={{ width: `${Math.min(100, data.data_completeness * 100)}%` }} />
        </span>
        <span className="ils-summary__completeness-value">
          {completeness} · {t.ils.axesUsed(data.axes_used, axes.length)}
        </span>
        {compact ? null : <span className="ils-summary__hint">{t.ils.completenessHint}</span>}
      </div>
      {data.has_placeholders ? <p className="ils-summary__note">{t.ils.hasPlaceholders}</p> : null}
      {showDisclaimer ? <p className="ils-summary__disclaimer">{t.ils.disclaimer}</p> : null}
    </div>
  );
}
