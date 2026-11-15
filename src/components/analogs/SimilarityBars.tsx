import type { CSSProperties } from 'react';
import { hasKnownLimitation } from '../../data/analogCaveats';
import { getPairLabels } from '../../data/analogText';
import { type AnalogPair, axesBySimilarity, isComparable } from '../../data/lunarAnalogs';
import { ConfidenceBadge, LimitationBadge } from './badges';
import { useAnalogText } from './useAnalogText';

/** Grosor de la barra según el peso del eje (0.5 → 8 px … 1.5 → 20 px). */
function barHeight(weight: number): number {
  return Math.round(Math.min(24, Math.max(6, 2 + weight * 12)));
}

/** Cuántos ejes se nombran como «lo más parecido» y «lo menos parecido». */
const HIGHLIGHTS = 2;

/**
 * Las nueve similitudes de un par (0–100), tal como las envía el backend.
 *  - Longitud de la barra: similitud. Grosor: peso del eje. Letra: confianza.
 *  - Un eje sin dato comparable es un hueco rayado con su etiqueta, nunca una barra en 0.
 *  - «Similitud por ausencia» se dibuja con trama: 100 que solo dice «los dos son secos».
 * Cada valor va escrito al final de su barra, así que no depende del color.
 */
export function SimilarityBars({ pair, onSelectAxis }: { pair: AnalogPair; onSelectAxis?: (axisId: string) => void }) {
  const { t, language, similarity, weight } = useAnalogText();
  const labels = getPairLabels(pair, language);
  const ranked = axesBySimilarity(pair);
  const most = ranked.slice(0, HIGHLIGHTS);
  const least = ranked.slice(-HIGHLIGHTS).reverse();
  const list = (axes: typeof ranked) => axes.map((axis) => `${t.axes[axis.key].name.toLocaleLowerCase(language)} (${similarity(axis)})`).join(', ');

  return (
    <figure className="sim-bars">
      <figcaption className="sim-bars__title">{t.chart.title}</figcaption>
      <ol className="sim-bars__rows" aria-label={`${t.chart.title}: ${labels.title}`}>
        {pair.data.axes.map((axis) => {
          const comparable = isComparable(axis);
          const byAbsence = axis.flag === 'similitud_por_ausencia';
          const name = t.axes[axis.key].name;
          const row = (
            <>
              <span className="sim-bars__name">
                <span className="sim-bars__number" aria-hidden="true">
                  {axis.id}
                </span>
                <span>{name}</span>
                <ConfidenceBadge level={axis.confidence} />
                {hasKnownLimitation(pair, axis.key) ? <LimitationBadge compact /> : null}
              </span>
              <span className="sim-bars__track" aria-hidden="true">
                {comparable ? (
                  <span
                    className={`sim-bars__fill${byAbsence ? ' sim-bars__fill--absence' : ''}`}
                    style={{ width: `${axis.similarity}%`, height: `${barHeight(axis.weight)}px` } as CSSProperties}
                  />
                ) : (
                  <span className="sim-bars__gap" />
                )}
              </span>
              <span className="sim-bars__value">
                {comparable ? similarity(axis) : t.chart.noData}
                {byAbsence ? <span className="sim-bars__tag"> {t.chart.byAbsence}</span> : null}
                <span className="sim-bars__weight">{t.chart.weight(weight(axis.weight))}</span>
              </span>
            </>
          );
          return (
            <li key={axis.key} className={`sim-bars__row${comparable ? '' : ' is-missing'}`}>
              {onSelectAxis ? (
                <button type="button" className="sim-bars__button" onClick={() => onSelectAxis(axis.key)}>
                  {row}
                </button>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ol>
      <p className="sim-bars__legend">
        {t.chart.weightLegend} {t.chart.confidenceLegend}
      </p>
      {ranked.length > 0 ? (
        <dl className="sim-bars__summary">
          <div>
            <dt>{t.chart.mostAlike}</dt>
            <dd>{list(most)}</dd>
          </div>
          <div>
            <dt>{t.chart.leastAlike}</dt>
            <dd>{list(least)}</dd>
          </div>
        </dl>
      ) : null}
    </figure>
  );
}
