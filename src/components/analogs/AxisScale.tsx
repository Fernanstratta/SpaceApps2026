import type { CSSProperties } from 'react';
import { getPairLabels } from '../../data/analogText';
import { type AxisAcrossPairs, getAxisDefinition, isComparable } from '../../data/lunarAnalogs';
import type { AxisId } from '../../types/Axis';
import { timesLarger } from '../../utils/analogFormat';
import { useAnalogText } from './useAnalogText';

/**
 * Escala natural de cada eje para dibujarlo (no afecta a ningún cálculo).
 * Si algún valor del backend se sale del dominio, el dominio crece para
 * incluirlo: una marca nunca se recorta ni se mueve.
 */
interface ScaleDomain {
  min: number;
  max: number;
  ticks: number[];
  log?: boolean;
}

const DOMAINS: Record<AxisId, ScaleDomain> = {
  slope: { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1] },
  roughness: { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1] },
  mineralogy: { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1] },
  albedo: { min: 0, max: 0.5, ticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5] },
  thermal: { min: 10, max: 1000, ticks: [10, 100, 1000], log: true },
  aridity: { min: 0, max: 0.4, ticks: [0, 0.1, 0.2, 0.3, 0.4] },
  ice: { min: 0, max: 3, ticks: [0, 1, 2, 3] },
  dust: { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1] },
  craters: { min: 0, max: 0.3, ticks: [0, 0.1, 0.2, 0.3] },
};

function fitDomain(axisId: AxisId, values: number[]): ScaleDomain {
  const base = DOMAINS[axisId];
  const max = Math.max(base.max, ...values);
  const min = Math.min(base.min, ...values.filter((value) => !base.log || value > 0));
  if (max === base.max && min === base.min) return base;
  return { ...base, min, max, ticks: [...new Set([min, ...base.ticks.filter((tick) => tick > min && tick < max), max])] };
}

function position(domain: ScaleDomain, value: number): number {
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  if (domain.log) {
    const safe = Math.max(value, domain.min);
    return clamp(((Math.log10(safe) - Math.log10(domain.min)) / (Math.log10(domain.max) - Math.log10(domain.min))) * 100);
  }
  return clamp(((value - domain.min) / (domain.max - domain.min)) * 100);
}

interface AxisScaleProps {
  axisId: AxisId;
  rows: AxisAcrossPairs[];
  /** Muestra la similitud de cada par junto a su fila. */
  showSimilarity?: boolean;
  /** Dibuja la regla de la tolerancia R bajo la escala. */
  showTolerance?: boolean;
  /** Par resaltado (el seleccionado en el Playground). */
  activePairId?: string;
  /** Título visible; por omisión, «Valores de «eje» en la Tierra y en la Luna». */
  title?: string;
}

/**
 * Un eje en su escala natural: cada par es una fila con dos marcas (Tierra,
 * círculo; Luna, rombo) unidas por una línea. Cuanto más corta la línea, más
 * se parecen los dos sitios en ese eje. Los valores van escritos junto a cada
 * fila, así que la figura se lee sin depender del color.
 * Un eje sin dato comparable se dibuja como un hueco rayado, nunca como 0.
 */
export function AxisScale({ axisId, rows, showSimilarity = true, showTolerance = true, activePairId, title }: AxisScaleProps) {
  const { t, language, value, similarity, number } = useAnalogText();
  const axisText = t.axes[axisId];
  const definition = getAxisDefinition(axisId);
  const values = rows.flatMap(({ axis }) => (isComparable(axis) ? [axis.earth.value, axis.moon.value] : []));
  const domain = fitDomain(axisId, values);
  const isLog = Boolean(domain.log);

  // Regla de la tolerancia: en lineal, un tramo de longitud R; en logarítmica, un factor R.
  const rulerEnd = isLog ? position(domain, domain.min * definition.tolerance_R) : position(domain, domain.min + definition.tolerance_R);
  const toleranceLabel = isLog ? t.chart.toleranceLog(number(definition.tolerance_R, 2)) : t.chart.tolerance(number(definition.tolerance_R, 2));

  return (
    <figure className={`ax-scale${isLog ? ' ax-scale--log' : ''}`}>
      <figcaption className="ax-scale__title">{title ?? t.chart.scaleTitle(axisText.name)}</figcaption>
      <p className="ax-scale__legend" aria-hidden="true">
        <span className="ax-scale__key">
          <span className="ax-scale__mark ax-scale__mark--earth ax-scale__mark--key" />
          {t.chart.earthMarker}
        </span>
        <span className="ax-scale__key">
          <span className="ax-scale__mark ax-scale__mark--moon ax-scale__mark--key" />
          {t.chart.moonMarker}
        </span>
        <span className="ax-scale__units">{axisText.units}</span>
      </p>

      <ol className="ax-scale__rows">
        {rows.map(({ pair, axis }) => {
          const labels = getPairLabels(pair, language);
          const comparable = isComparable(axis);
          const earthX = comparable ? position(domain, axis.earth.value) : 0;
          const moonX = comparable ? position(domain, axis.moon.value) : 0;
          const times = comparable && axisId === 'thermal' ? timesLarger(axis.earth.value, axis.moon.value) : null;
          return (
            <li key={pair.id} className={`ax-scale__row${pair.id === activePairId ? ' is-active' : ''}${comparable ? '' : ' is-missing'}`}>
              <span className="ax-scale__name">{labels.short}</span>
              <span className="visually-hidden">
                {comparable
                  ? t.chart.scaleItem(labels.short, value(axisId, axis.earth), value(axisId, axis.moon), similarity(axis))
                  : t.chart.scaleItemMissing(labels.short)}
              </span>
              <div className="ax-scale__track" aria-hidden="true">
                {domain.ticks.map((tick) => (
                  <span key={tick} className="ax-scale__grid" style={{ left: `${position(domain, tick)}%` }} />
                ))}
                {comparable ? (
                  <>
                    <span
                      className="ax-scale__link"
                      style={{ left: `${Math.min(earthX, moonX)}%`, width: `${Math.abs(moonX - earthX)}%` } as CSSProperties}
                    />
                    <span
                      className="ax-scale__mark ax-scale__mark--earth"
                      style={{ left: `${earthX}%` }}
                      title={`${labels.earth.name}: ${value(axisId, axis.earth)}`}
                    />
                    <span
                      className="ax-scale__mark ax-scale__mark--moon"
                      style={{ left: `${moonX}%` }}
                      title={`${labels.moon.name}: ${value(axisId, axis.moon)}`}
                    />
                  </>
                ) : (
                  <span className="ax-scale__gap">{t.chart.noData}</span>
                )}
              </div>
              <span className="ax-scale__values" aria-hidden="true">
                {comparable ? (
                  <>
                    <span className="ax-scale__value">
                      <span className="ax-scale__mark ax-scale__mark--earth ax-scale__mark--key" />
                      {value(axisId, axis.earth)}
                    </span>
                    <span className="ax-scale__value">
                      <span className="ax-scale__mark ax-scale__mark--moon ax-scale__mark--key" />
                      {value(axisId, axis.moon)}
                    </span>
                    {showSimilarity ? (
                      <span className="ax-scale__similarity">
                        S {similarity(axis)}
                        {axis.flag === 'similitud_por_ausencia' ? ` · ${t.chart.byAbsence}` : ''}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="ax-scale__similarity">{t.chart.noData}</span>
                )}
              </span>
              {times !== null ? <span className="ax-scale__note">{t.chart.timesMore(number(times, 0))}</span> : null}
            </li>
          );
        })}
      </ol>

      <div className="ax-scale__axis" aria-hidden="true">
        <span className="ax-scale__name" />
        <div className="ax-scale__ticks">
          {domain.ticks.map((tick) => (
            <span key={tick} className="ax-scale__tick" style={{ left: `${position(domain, tick)}%` }}>
              {number(tick, 2)}
            </span>
          ))}
          {showTolerance ? (
            <span className="ax-scale__ruler" style={{ width: `${rulerEnd}%` }}>
              <span className="ax-scale__ruler-label">R</span>
            </span>
          ) : null}
        </div>
        <span className="ax-scale__values" />
      </div>
      <p className="ax-scale__ends">
        <span>← {axisText.scale.low}</span>
        <span>{axisText.scale.high} →</span>
      </p>
      {isLog ? <p className="ax-scale__foot">{t.chart.logScale}</p> : null}
      {showTolerance ? <p className="ax-scale__foot">{toleranceLabel}</p> : null}
    </figure>
  );
}
