import { useId } from 'react';
import { getPairLabels } from '../../data/analogText';
import {
  ABSENCE_WEIGHT,
  type AnalogPair,
  AXIS_DEFINITION_LIST,
  AXIS_IDS,
  type AxisId,
  axesBySimilarity,
  axisAcrossPairs,
  BODIES,
  getPair,
  pairAxis,
} from '../../data/lunarAnalogs';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import { formatAxisValue } from '../../utils/analogFormat';
import { CaveatList } from '../analogs/AxisCard';
import { AxisScale } from '../analogs/AxisScale';
import { ConfidenceBadge, StatusBadge } from '../analogs/badges';
import { useAnalogText } from '../analogs/useAnalogText';
import { ExternalLink } from '../common/ExternalLink';

/** Encabezado de una sección del Playground. */
export function PanelHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  return (
    <header className="pg-section__head">
      <h2 id={id} className="pg-section__title">
        {title}
      </h2>
      {lead ? <p className="pg-section__lead">{lead}</p> : null}
    </header>
  );
}

/** «En qué se parecen», «Pregunta para clase» y «Dónde se rompe la analogía». */
export function AnalogyPanel({ pair }: { pair: AnalogPair }) {
  const { t, language, similarity } = useAnalogText();
  const labels = getPairLabels(pair, language);
  const least = axesBySimilarity(pair).slice(-3).reverse();
  return (
    <div className="pg-analogy">
      <article className="pg-analogy__card pg-analogy__card--match">
        <h3>{t.sections.match}</h3>
        <p>{labels.match}</p>
      </article>
      <article className="pg-analogy__card pg-analogy__card--hook">
        <h3>{t.sections.hook}</h3>
        <p>{labels.hook}</p>
      </article>
      <article className="pg-analogy__card pg-analogy__card--breaks">
        <h3>{t.sections.breaks}</h3>
        <ul>
          {labels.breaks.map((item) => (
            <li key={item.key}>
              <strong>{item.label}.</strong> {item.text}
            </li>
          ))}
        </ul>
        <h4>{t.sections.lowAxes}</h4>
        <ul className="pg-analogy__low">
          {least.map((axis) => (
            <li key={axis.key}>
              {t.axes[axis.key].name}: <strong>{similarity(axis)}</strong>
              {axis.key === 'thermal' ? <span className="lv-muted"> — {t.caveats.items.thermalReal.title}</span> : null}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

/** Un eje en los cinco pares, con su escala, cómo leerlo y sus advertencias en el par activo. */
export function AxisExplorer({
  axisId,
  onAxisChange,
  activePair,
}: {
  axisId: AxisId;
  onAxisChange: (axis: AxisId) => void;
  activePair: AnalogPair;
}) {
  const { t } = useAnalogText();
  const groupId = useId();
  const axisText = t.axes[axisId];
  const rows = axisAcrossPairs(axisId);
  return (
    <div className="pg-explorer">
      <div className="pg-explorer__chips" role="radiogroup" aria-labelledby={groupId}>
        <span id={groupId} className="visually-hidden">
          {t.filters.axesLegend}
        </span>
        {AXIS_IDS.map((id, index) => (
          <button key={id} type="button" role="radio" aria-checked={id === axisId} className="pg-chip" onClick={() => onAxisChange(id)}>
            <span aria-hidden="true">{index + 1}</span> {t.axes[id].name}
          </button>
        ))}
      </div>
      <div className="pg-explorer__grid">
        <div>
          <p className="pg-explorer__question">{axisText.question}</p>
          <AxisScale axisId={axisId} rows={rows} activePairId={activePair.id} />
        </div>
        <div className="pg-explorer__notes">
          <h3>{t.table.measures}</h3>
          <p>{axisText.measures}</p>
          <h3>{t.table.why}</h3>
          <p>{axisText.why}</p>
          <h3>{t.table.howToRead}</h3>
          <p>{axisText.notes}</p>
          <CaveatList pair={activePair} axisId={axisId} />
          <Link className="pg-explorer__learn" to={ROUTES.topic(axisId)}>
            {t.table.learnMore} →
          </Link>
        </div>
      </div>
    </div>
  );
}

/** «Cómo se calcula el ILS»: fórmulas, los nueve ejes y las leyendas de estado, confianza y normalización. */
export function MethodPanel() {
  const { t, locale, labels, number, score } = useAnalogText();
  const example = pairAxis(getPair('elegante_linne'), 'craters');
  const nominal = AXIS_DEFINITION_LIST.reduce((sum, axis) => sum + axis.weight, 0);
  const iceNominal = AXIS_DEFINITION_LIST.find((axis) => axis.key === 'ice')?.weight ?? 0;
  const reduced = ABSENCE_WEIGHT !== null ? nominal - iceNominal + ABSENCE_WEIGHT : null;
  return (
    <div className="pg-method">
      <p>{t.method.intro}</p>
      <div className="pg-method__formulas">
        <div className="pg-method__formula">
          <h3>{t.method.linearTitle}</h3>
          <p className="pg-formula">{t.method.linearFormula}</p>
        </div>
        <div className="pg-method__formula">
          <h3>{t.method.logTitle}</h3>
          <p className="pg-formula">{t.method.logFormula}</p>
        </div>
        <div className="pg-method__formula">
          <h3>{t.method.totalTitle}</h3>
          <p className="pg-formula">{t.method.totalFormula}</p>
        </div>
      </div>
      <p>{t.method.tolerance}</p>
      {example.earth && example.moon && example.similarity !== null ? (
        <p>
          {t.method.example({
            R: number(example.tolerance_R, 2),
            earth: formatAxisValue('craters', example.earth.value, locale, labels),
            moon: formatAxisValue('craters', example.moon.value, locale, labels),
            similarity: score(example.similarity),
          })}
        </p>
      ) : null}
      <p>{t.method.total(number(nominal, 2), reduced !== null ? number(reduced, 2) : null)}</p>
      <p>{t.method.completeness}</p>
      <p>{t.method.absence(ABSENCE_WEIGHT !== null ? number(ABSENCE_WEIGHT, 2) : null)}</p>
      <p>
        <strong>{t.method.missing}</strong>
      </p>

      <div className="table-scroll">
        <table className="pg-table">
          <caption>{t.method.axesCaption}</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t.table.axis}</th>
              <th scope="col">{t.method.mode}</th>
              <th scope="col">{t.method.toleranceShort}</th>
              <th scope="col">{t.table.weight}</th>
              <th scope="col">{t.table.confidence}</th>
            </tr>
          </thead>
          <tbody>
            {AXIS_DEFINITION_LIST.map((axis) => (
              <tr key={axis.key}>
                <td>{axis.id}</td>
                <th scope="row">
                  {t.axes[axis.key].name}
                  <span className="pg-table__units">{t.axes[axis.key].units}</span>
                </th>
                <td>{t.modes[axis.mode]}</td>
                <td>{number(axis.tolerance_R, 2)}</td>
                <td>{number(axis.weight, 2)}</td>
                <td>
                  <ConfidenceBadge level={axis.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pg-method__legends">
        <div>
          <h3>{t.method.statusTitle}</h3>
          <ul className="pg-legend">
            {(Object.keys(t.statuses) as (keyof typeof t.statuses)[]).map((status) => (
              <li key={status}>
                <StatusBadge status={status} /> {t.statuses[status].meaning}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t.method.confidenceTitle}</h3>
          <ul className="pg-legend">
            {(Object.keys(t.confidence) as (keyof typeof t.confidence)[]).map((level) => (
              <li key={level}>
                <ConfidenceBadge level={level} long /> {t.confidence[level]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t.method.normalizationTitle}</h3>
          <ul className="pg-legend">
            {(Object.keys(t.normalizations) as (keyof typeof t.normalizations)[]).map((key) => (
              <li key={key}>
                <strong>{t.normalizations[key].label}.</strong> {t.normalizations[key].meaning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Advertencias generales de los datos. */
export function LimitationsPanel() {
  const { t } = useAnalogText();
  return (
    <div className="pg-limits">
      <p>{t.limitations.intro}</p>
      <ul className="pg-limits__list">
        {t.limitations.items.map((item) => (
          <li key={item.label}>
            <strong>{item.label}</strong> {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fuentes del par activo (las que declara el backend en cada valor) y créditos generales. */
export function SourcesPanel({ pair }: { pair: AnalogPair }) {
  const { t, language } = useAnalogText();
  const sources = new Map<string, { url?: string; axes: Set<string> }>();
  for (const axis of pair.data.axes) {
    for (const body of BODIES) {
      const side = axis[body];
      if (!side) continue;
      const entry = sources.get(side.source) ?? { url: side.source_url, axes: new Set<string>() };
      entry.axes.add(t.axes[axis.key].name);
      if (!entry.url && side.source_url) entry.url = side.source_url;
      sources.set(side.source, entry);
    }
  }
  return (
    <div className="pg-sources">
      <p>{t.sources.intro}</p>
      <ul className="pg-sources__list">
        {[...sources.entries()].map(([source, entry]) => (
          <li key={source}>
            <span lang={language === 'es' ? undefined : 'es'}>{source}</span>
            {entry.url ? (
              <>
                {' '}
                <ExternalLink href={entry.url}>{t.table.openSource}</ExternalLink>
              </>
            ) : null}
            <span className="pg-sources__axes">{t.sources.usedIn([...entry.axes].join(', '))}</span>
          </li>
        ))}
      </ul>
      <h3>{t.sources.credits}</h3>
      <p>{t.sources.creditsList}</p>
      <h3>{t.sources.literature}</h3>
      <p>{t.sources.literatureList}</p>
    </div>
  );
}

