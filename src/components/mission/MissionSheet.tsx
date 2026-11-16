import { isSimulated, type SourceId } from '../../data/missions/roverMission';
import { revisedSite, type MissionProgress } from '../../hooks/useMissionProgress';
import { useI18n } from '../../i18n/I18nContext';
import { useRoverMissionText } from '../../i18n/missions';
import { BrandMark } from '../layout/BrandMark';
import { FindingSummary } from './FindingSummary';
import { SourceList } from './SourceLink';

/**
 * Ficha imprimible en dos versiones:
 *  - `review`: la propuesta con un espacio en blanco para que otro equipo
 *    escriba una objeción (se intercambia impresa o en PDF).
 *  - `final`: elección inicial, hallazgo principal, objeción recibida y
 *    decisión revisada. No califica el sitio elegido.
 */
export function MissionSheet({ progress, variant }: { progress: MissionProgress; variant: 'review' | 'final' }) {
  const { locale } = useI18n();
  const text = useRoverMissionText();
  const s = text.sheet;
  const empty = '—';
  const main = progress.findings.find((f) => f.id === progress.mainFindingId);
  const support = progress.findings.find((f) => f.id === progress.decisionFindingId);
  const siteName = (id: keyof typeof text.sites | null) => (id ? `${text.sites[id].name} — ${text.sites[id].place}` : empty);

  const sources = [
    ...(main?.sourceIds ?? []),
    ...(variant === 'final' ? (support?.sourceIds ?? []) : []),
    'sldem2015',
    'alsj-north-ray',
    'sp4214-lrv',
  ] as SourceId[];
  const uniqueSources = sources.filter((id, i) => sources.indexOf(id) === i);
  const decision = progress.decision;
  const finalSite = revisedSite(progress);

  return (
    <article className={`mission-sheet mission-sheet--${variant}`} aria-labelledby={`mission-sheet-title-${variant}`}>
      <header className="mission-sheet__head">
        <BrandMark size={34} />
        <div>
          <p className="mission-sheet__eyebrow">Terranauta · {text.meta.code}</p>
          <h2 id={`mission-sheet-title-${variant}`}>{variant === 'review' ? s.reviewHeading : s.finalHeading}</h2>
          <p className="mission-sheet__mission">{text.meta.title}</p>
        </div>
      </header>

      <dl className="mission-sheet__meta">
        <div>
          <dt>{s.team}</dt>
          <dd>{progress.team.trim() || s.noTeam}</dd>
        </div>
        <div>
          <dt>{s.date}</dt>
          <dd>{new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date())}</dd>
        </div>
      </dl>

      <dl className="mission-sheet__fields">
        <div>
          <dt>{s.maneuver}</dt>
          <dd>{text.challenge.maneuver}</dd>
        </div>
        <div>
          <dt>{s.initialChoice}</dt>
          <dd>{siteName(progress.provisionalSite)}</dd>
        </div>
        <div>
          <dt>{s.proposal}</dt>
          <dd className="mission-sheet__strong">{siteName(progress.proposedSite)}</dd>
        </div>
        {variant === 'review' ? (
          <div className="mission-sheet__wide">
            <dt>{s.hypothesis}</dt>
            <dd>{progress.hypothesis.trim() || empty}</dd>
          </div>
        ) : null}
        <div className="mission-sheet__evidence">
          <dt>{s.mainFinding}</dt>
          <dd>{main ? <FindingSummary finding={main} /> : empty}</dd>
        </div>
        <div className="mission-sheet__wide">
          <dt>{s.explanation}</dt>
          <dd>{progress.explanation.trim() || empty}</dd>
        </div>
        {variant === 'review' ? (
          <>
            <div>
              <dt>{s.limitation}</dt>
              <dd>{progress.limitation.trim() || empty}</dd>
            </div>
            <div>
              <dt>{s.nextData}</dt>
              <dd>{progress.nextData.trim() || empty}</dd>
            </div>
          </>
        ) : null}
      </dl>

      {variant === 'review' ? (
        <section className="mission-sheet__review-box" aria-label={s.reviewBox}>
          <h3>{s.reviewBox}</h3>
          <p className="mission-sheet__line-label">{s.reviewerTeam}: ________________________________</p>
          <p>{s.objectionPrompt}</p>
          <p className="mission-sheet__example">{s.objectionExample}</p>
          <div className="mission-sheet__lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>
      ) : (
        <>
          <section className="mission-sheet__objection">
            <h3>{s.objection}</h3>
            <p>
              {progress.objection.trim() ? `«${progress.objection.trim()}»` : empty}
              {progress.reviewerTeam.trim() ? <span className="mission-sheet__reviewer"> — {progress.reviewerTeam.trim()}</span> : null}
            </p>
          </section>
          <section className="mission-sheet__choice">
            <h3>{s.revisedDecision}</h3>
            <p className="mission-sheet__site">
              {decision === 'change'
                ? text.step4.decisions.change(finalSite ? text.sites[finalSite].name : empty)
                : decision
                  ? text.step4.decisions[decision]
                  : empty}
            </p>
            <p className="mission-sheet__change">{decision === 'more-evidence' ? s.pending : siteName(finalSite)}</p>
          </section>
          <dl className="mission-sheet__fields">
            <div className="mission-sheet__wide">
              <dt>{decision ? s.decisionReason[decision] : s.decisionReason.keep}</dt>
              <dd>{progress.decisionReason.trim() || empty}</dd>
            </div>
            {support ? (
              <div className="mission-sheet__evidence">
                <dt>{s.supportingFinding}</dt>
                <dd>
                  <FindingSummary finding={support} />
                </dd>
              </div>
            ) : null}
            <div>
              <dt>{s.limitation}</dt>
              <dd>{progress.limitation.trim() || empty}</dd>
            </div>
            <div>
              <dt>{s.nextData}</dt>
              <dd>{progress.nextData.trim() || empty}</dd>
            </div>
          </dl>
          <p className="mission-sheet__neutral">{s.neutral}</p>
          <p className="mission-sheet__closing">{s.closing}</p>
          <div className="mission-sheet__lines" aria-hidden="true">
            <span />
            <span />
          </div>
        </>
      )}

      <footer className="mission-sheet__sources">
        <h3>{s.sources}</h3>
        {isSimulated(uniqueSources) ? <p className="simulated-tag">{text.viewer.simulated}</p> : null}
        <SourceList ids={uniqueSources} />
      </footer>
    </article>
  );
}
