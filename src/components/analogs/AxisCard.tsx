import { caveatsFor, formatRaw, resolveCaveat } from '../../data/analogCaveats';
import { getPairLabels, getSourcePlan } from '../../data/analogText';
import { type AnalogAxis, type AnalogPair, type AxisSide, type Body, BODIES, isComparable } from '../../data/lunarAnalogs';
import type { AxisId } from '../../types/Axis';
import { ExternalLink } from '../common/ExternalLink';
import { ConfidenceBadge, LimitationBadge, StatusBadge } from './badges';
import { useAnalogText } from './useAnalogText';

/**
 * Cuánto se muestra de un eje, según el público:
 *  - `simple`: valores, estado y similitud (primaria).
 *  - `guided`: además, peso, confianza y las advertencias de lectura (secundaria).
 *  - `full`: además, valor crudo, fuente, método y enlace de cada lado (preparatoria y Playground).
 */
export type AxisCardDetail = 'simple' | 'guided' | 'full';

/** Advertencias de un eje de un par, con los valores del backend ya insertados. */
export function CaveatList({ pair, axisId }: { pair: AnalogPair; axisId: AxisId }) {
  const { t, locale, labels } = useAnalogText();
  const caveats = caveatsFor(pair, axisId);
  if (caveats.length === 0) return null;
  return (
    <ul className="an-caveats">
      {caveats.map((caveat) => {
        const text = resolveCaveat(caveat, t.caveats.items[caveat.id], pair, locale, labels);
        return (
          <li key={caveat.id} className={`an-caveat an-caveat--${caveat.kind}`}>
            <span className="an-caveat__kind">{caveat.kind === 'limitation' ? t.caveats.limitation : t.caveats.note}</span>
            <strong className="an-caveat__title">{text.title}</strong>
            <span className="an-caveat__text">{text.body}</span>
          </li>
        );
      })}
    </ul>
  );
}

function SideValue({ axis, body, pair, detail }: { axis: AnalogAxis; body: Body; pair: AnalogPair; detail: AxisCardDetail }) {
  const { t, language, locale, value } = useAnalogText();
  const side: AxisSide | null = axis[body];
  const siteName = getPairLabels(pair, language)[body].name;
  const raw = formatRaw(side, locale);
  return (
    <div className={`ax-card__side ax-card__side--${body}`}>
      <p className="ax-card__side-label">
        <span className={`ax-card__dot ax-card__dot--${body}`} aria-hidden="true" />
        {body === 'earth' ? t.table.earth : t.table.moon}
        <span className="ax-card__site"> · {siteName}</span>
      </p>
      {side ? (
        <>
          <p className="ax-card__value">{value(axis.key, side)}</p>
          <StatusBadge status={side.status} />
          {detail !== 'simple' && raw ? (
            <p className="ax-card__raw">
              {t.table.raw}: {raw}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="ax-card__value ax-card__value--none">{t.table.noValue}</p>
          {detail === 'full' ? (
            <p className="ax-card__raw">
              {t.table.plannedSource}: {getSourcePlan(axis.key, body, axis.source_plan[body], language)}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

function SideDetails({ axis, body }: { axis: AnalogAxis; body: Body }) {
  const { t, language, number } = useAnalogText();
  const side: AxisSide | null = axis[body];
  if (!side) return null;
  // Fuente y método llegan en español del backend: se marca su idioma para lectores de pantalla.
  const backendLang = language === 'es' ? undefined : 'es';
  const normalization = side.normalization;
  const population = typeof normalization?.population === 'string' ? normalization.population : null;
  const anchors = side.calibration ?? (typeof normalization?.felsic === 'number' && typeof normalization.mafic === 'number'
    ? { felsic: normalization.felsic, mafic: normalization.mafic }
    : null);
  return (
    <div className="ax-card__detail">
      <h5 className="ax-card__detail-title">{body === 'earth' ? t.table.earth : t.table.moon}</h5>
      <dl className="ax-card__fields">
        <div>
          <dt>{t.table.source}</dt>
          <dd lang={backendLang}>
            {side.source}
            {side.source_url ? (
              <>
                {' '}
                <ExternalLink href={side.source_url}>{t.table.openSource}</ExternalLink>
              </>
            ) : null}
          </dd>
        </div>
        {side.method ? (
          <div>
            <dt>{t.table.method}</dt>
            <dd lang={backendLang}>{side.method}</dd>
          </div>
        ) : null}
        {side.observed_at ? (
          <div>
            <dt>{t.table.observed}</dt>
            <dd>{side.observed_at}</dd>
          </div>
        ) : null}
        {side.resolution_m !== undefined ? (
          <div>
            <dt>{t.table.resolution}</dt>
            <dd>{t.table.resolutionValue(number(side.resolution_m, 0))}</dd>
          </div>
        ) : null}
        {normalization ? (
          <div>
            <dt>{t.table.normalization}</dt>
            <dd>
              {t.normalizations[normalization.method].label}
              {population ? ` · ${t.table.population}: ${population}` : ''}
              {anchors ? ` · ${t.table.anchors(number(anchors.felsic, 4), number(anchors.mafic, 4))}` : ''}
              {normalization.source ? ` · ${normalization.source}` : ''}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

interface AxisCardProps {
  pair: AnalogPair;
  axis: AnalogAxis;
  detail: AxisCardDetail;
  /** Encabezado: el nombre del eje (ficha de un par) o el del par (un eje en varios pares). */
  heading: 'axis' | 'pair';
  headingLevel?: 3 | 4;
  id?: string;
}

/**
 * Ficha de un eje en un par: valor de cada lado con su estado, similitud,
 * peso y confianza, advertencias de lectura y, al desplegar, fuente y método.
 * Responde a las preguntas: ¿qué se mide?, ¿cuánto vale en la Tierra y en la
 * Luna?, ¿qué tan parecidos son? y ¿qué tan confiable es el dato?
 */
export function AxisCard({ pair, axis, detail, heading, headingLevel = 3, id }: AxisCardProps) {
  const { t, language, similarity, weight } = useAnalogText();
  const labels = getPairLabels(pair, language);
  const axisText = t.axes[axis.key];
  const comparable = isComparable(axis);
  const byAbsence = axis.flag === 'similitud_por_ausencia';
  const limited = caveatsFor(pair, axis.key).some((caveat) => caveat.kind === 'limitation');
  const Heading = `h${headingLevel}` as 'h3' | 'h4';
  const cratersKind = axis.key === 'craters' ? t.pairs[pair.id].cratersKind : null;

  return (
    <article id={id} className={`ax-card${comparable ? '' : ' is-missing'}`}>
      <header className="ax-card__head">
        <Heading className="ax-card__title">
          {heading === 'axis' ? (
            <>
              <span className="ax-card__number" aria-hidden="true">
                {axis.id}
              </span>
              {axisText.name}
            </>
          ) : (
            labels.title
          )}
        </Heading>
        <p className="ax-card__meta">
          {heading === 'axis' ? <span className="ax-card__units">{cratersKind ?? axisText.units}</span> : null}
          {heading === 'pair' && cratersKind ? <span className="ax-card__units">{cratersKind}</span> : null}
          {detail !== 'simple' ? <ConfidenceBadge level={axis.confidence} long /> : null}
          {detail !== 'simple' && limited ? <LimitationBadge /> : null}
        </p>
      </header>

      {heading === 'axis' && detail === 'full' ? <p className="ax-card__question">{axisText.measures}</p> : null}

      <div className="ax-card__body">
        {BODIES.map((body) => (
          <SideValue key={body} axis={axis} body={body} pair={pair} detail={detail} />
        ))}
        <div className={`ax-card__similarity${comparable ? '' : ' ax-card__similarity--none'}`}>
          <p className="ax-card__side-label">{t.table.similarity}</p>
          <p className="ax-card__value">{similarity(axis)}</p>
          {comparable ? (
            <meter className="ax-card__meter" min={0} max={100} value={axis.similarity} aria-hidden="true" />
          ) : (
            <p className="ax-card__raw">{t.chart.noDataLong}</p>
          )}
          {byAbsence ? <span className="an-badge an-badge--absence">{t.absenceFlag.label}</span> : null}
          {detail !== 'simple' && comparable ? (
            <p className="ax-card__raw">
              {t.table.weight}: {weight(axis.weight)}
            </p>
          ) : null}
        </div>
      </div>

      {detail === 'simple' ? null : <CaveatList pair={pair} axisId={axis.key} />}

      {detail === 'full' && (axis.earth || axis.moon) ? (
        <details className="ax-card__details">
          <summary>{t.table.details}</summary>
          {language !== 'es' && t.backend ? <p className="ax-card__untranslated">{t.backend.untranslatedNote}</p> : null}
          <div className="ax-card__detail-grid">
            {BODIES.map((body) => (
              <SideDetails key={body} axis={axis} body={body} />
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}
