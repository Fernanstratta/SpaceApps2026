import { useEffect, useRef, useState } from 'react';
import { DataNotes } from '../components/mission/DataNotes';
import { FindingLog } from '../components/mission/FindingLog';
import { FindingSummary, useFindingText } from '../components/mission/FindingSummary';
import { MissionSheet } from '../components/mission/MissionSheet';
import { MissionViewer } from '../components/mission/MissionViewer';
import { SourceLink } from '../components/mission/SourceLink';
import { CANDIDATE_SITE_IDS, ROVER_FACTS, STATION_11_PANORAMA, type CandidateSiteId } from '../data/missions/roverMission';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  MAX_FINDINGS,
  MISSION_STEPS,
  otherCandidate,
  REVIEW_DECISIONS,
  useMissionProgress,
  validateStep,
  type Finding,
  type MissionStep,
  type StepError,
} from '../hooks/useMissionProgress';
import { useMessages } from '../i18n/I18nContext';
import { useRoverMissionText } from '../i18n/missions';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

/**
 * «Iniciar misión», en cinco pasos:
 *  1. Reto: sitio provisional e hipótesis.
 *  2. Bitácora: hallazgos registrados desde el visor, con nota y fuente.
 *  3. Propuesta: sitio, hallazgo principal y ficha para revisión (imprimible).
 *  4. Revisión: objeción de otro equipo y decisión revisada.
 *  5. Ficha final (imprimible). La app no califica el sitio elegido.
 * El visor ocupa el espacio principal; la actividad va en el panel lateral
 * (en móvil, debajo del visor). Todo se guarda en el navegador.
 */
export function MissionStudentPage() {
  const text = useRoverMissionText();
  const { NAV_LABELS } = useMessages();
  useDocumentTitle(text.meta.studentPageTitle);
  const { progress, update, commitDraft, editFindingNote, removeFinding, reset } = useMissionProgress();
  const [errors, setErrors] = useState<StepError[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorsRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const { step } = progress;

  // Al cambiar de paso, el foco va al título del panel (teclado y lectores de pantalla).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  // El foco va al resumen de errores solo cuando aparece.
  const hasErrors = errors.length > 0;
  useEffect(() => {
    if (hasErrors) errorsRef.current?.focus();
  }, [hasErrors]);

  // Los errores ya resueltos desaparecen solos.
  useEffect(() => {
    setErrors((current) => {
      if (current.length === 0) return current;
      const stillValid = validateStep(step, progress);
      const next = current.filter((error) => stillValid.includes(error));
      return next.length === current.length ? current : next;
    });
  }, [progress, step]);

  const goTo = (next: MissionStep) => {
    setErrors([]);
    update({ step: next });
  };

  const advance = () => {
    const found = validateStep(step, progress);
    if (found.length > 0) {
      setErrors(found);
      return;
    }
    const next = (step + 1) as MissionStep;
    // Al armar la propuesta, la opción por defecto es el sitio provisional.
    if (next === 3 && !progress.proposedSite) update({ proposedSite: progress.provisionalSite });
    goTo(next);
  };

  const printSheet = (requiredStep: MissionStep) => {
    const found = validateStep(requiredStep, progress);
    setErrors(found);
    if (found.length === 0) window.print();
  };

  const stepTexts = [text.step1, text.step2, text.step3, text.step4, text.step5];
  const stepText = stepTexts[step - 1]!;
  const errorMessages: Record<StepError, string> = {
    errorSite: text.step1.errorSite,
    errorHypothesis: text.step1.errorHypothesis,
    errorFinding: text.step2.errorFinding,
    errorFindingNote: text.step2.errorFindingNote,
    errorProposal: text.step3.errorProposal,
    errorCite: text.step3.errorCite,
    errorExplanation: text.step3.errorExplanation,
    errorLimitation: text.step3.errorLimitation,
    errorNextData: text.step3.errorNextData,
    errorObjection: text.step4.errorObjection,
    errorDecision: text.step4.errorDecision,
    errorDecisionFinding: text.step4.errorDecisionFinding,
    errorDecisionReason: text.step4.errorDecisionReason,
  };
  const fieldError = (key: StepError) => (errors.includes(key) ? errorMessages[key] : null);
  const nextLabels = [text.step1.next, text.step2.next, text.step3.next, text.step4.next];
  const changeTarget = otherCandidate(progress.proposedSite);

  return (
    <div className="mission">
      <header className="mission__head print-hide">
        <div className="container">
          <Link to={ROUTES.portal} className="mission__back">
            ← {NAV_LABELS.portal}
          </Link>
          <p className="mission__eyebrow">
            {text.meta.lab} · {text.meta.code}
          </p>
          <h1 className="mission__title">{text.meta.title}</h1>
          <p className="mission__switch">
            <Link to={ROUTES.missionTeach}>{text.meta.teachCta} →</Link>
          </p>
        </div>
      </header>

      <div className="container mission__layout">
        <div className="mission__viewer print-hide">
          <MissionViewer
            recorder={
              step >= 2 && step <= 4
                ? {
                    draft: progress.findingDraft,
                    canRecordMore: progress.findings.length < MAX_FINDINGS,
                    maxFindings: MAX_FINDINGS,
                    onDraftChange: (findingDraft) => update({ findingDraft }),
                    onSave: commitDraft,
                  }
                : undefined
            }
          />
        </div>

        <aside className="mission__panel print-hide" aria-labelledby="mission-step-title">
          <nav aria-label={text.steps.navLabel}>
            <ol className="stepper">
              {MISSION_STEPS.map((n) => {
                const state = n === step ? 'current' : n < step ? 'done' : 'todo';
                const label = text.steps.labels[n - 1];
                return (
                  <li key={n} className={`stepper__item stepper__item--${state}`}>
                    {n < step ? (
                      <button type="button" className="stepper__button" onClick={() => goTo(n)}>
                        <span className="stepper__number">✓</span>
                        {label}
                      </button>
                    ) : (
                      <span className="stepper__button" aria-current={n === step ? 'step' : undefined}>
                        <span className="stepper__number">{n}</span>
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <p className="mission__progress">{text.steps.current(step, MISSION_STEPS.length)}</p>
          <h2 id="mission-step-title" ref={headingRef} tabIndex={-1} className="mission__step-title">
            {stepText.title}
          </h2>

          {errors.length > 0 ? (
            <div ref={errorsRef} tabIndex={-1} className="error-summary" role="alert">
              <p>{text.steps.errorsTitle}</p>
              <ul>
                {errors.map((key) => (
                  <li key={key}>{errorMessages[key]}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mission-step">
              <p>{text.challenge.intro}</p>
              <figure className="mission-panorama">
                <img
                  src={STATION_11_PANORAMA.src}
                  width={STATION_11_PANORAMA.width}
                  height={STATION_11_PANORAMA.height}
                  alt={text.challenge.panoramaAlt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <figcaption>
                  {text.challenge.panoramaCaption} <SourceLink id={STATION_11_PANORAMA.sourceId} />
                </figcaption>
              </figure>
              <div className="maneuver">
                <h3>{text.challenge.maneuverTitle}</h3>
                <p>{text.challenge.maneuver}</p>
                <p className="maneuver__fact">
                  {text.challenge.roverLimit(ROVER_FACTS.maxSlopeDeg)} <SourceLink id={ROVER_FACTS.maxSlopeSource} />
                </p>
              </div>
              <div className="field">
                <label htmlFor="mission-team">{text.step1.teamLabel}</label>
                <input
                  id="mission-team"
                  type="text"
                  maxLength={60}
                  value={progress.team}
                  placeholder={text.step1.teamPlaceholder}
                  onChange={(event) => update({ team: event.target.value })}
                />
              </div>
              <SiteChoice
                legend={text.step1.chooseLabel}
                hint={text.step1.chooseHint}
                name="provisional-site"
                value={progress.provisionalSite}
                onChange={(site) => update({ provisionalSite: site })}
                error={fieldError('errorSite')}
              />
              <TextArea
                id="mission-hypothesis"
                label={text.step1.hypothesisLabel}
                hint={text.step1.hypothesisHint}
                value={progress.hypothesis}
                onChange={(hypothesis) => update({ hypothesis })}
                error={fieldError('errorHypothesis')}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mission-step">
              <p>{text.step2.intro}</p>
              <h3 className="mission-step__subtitle">{text.step2.tasksLabel}</h3>
              <ol className="task-list">
                {text.step2.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ol>
              <FindingLog findings={progress.findings} max={MAX_FINDINGS} onEditNote={editFindingNote} onRemove={removeFinding} />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mission-step">
              <p>{text.step3.intro}</p>
              <p className="mission-step__note">
                {text.step3.provisional(progress.provisionalSite ? text.sites[progress.provisionalSite].name : '—')}
              </p>
              <SiteChoice
                legend={text.step3.siteLabel}
                name="proposed-site"
                value={progress.proposedSite}
                onChange={(site) => update({ proposedSite: site })}
                error={fieldError('errorProposal')}
              />
              {progress.proposedSite ? (
                <p className="mission-step__status" aria-live="polite">
                  {progress.proposedSite === progress.provisionalSite ? text.step3.kept : text.step3.changed}
                </p>
              ) : null}
              <FindingChoice
                legend={text.step3.citeLabel}
                hint={text.step3.citeHint}
                name="main-finding"
                findings={progress.findings}
                value={progress.mainFindingId}
                onChange={(mainFindingId) => update({ mainFindingId })}
                error={fieldError('errorCite')}
              />
              <TextArea
                id="mission-explanation"
                label={text.step3.explanationLabel}
                hint={text.step3.explanationHint}
                value={progress.explanation}
                onChange={(explanation) => update({ explanation })}
                error={fieldError('errorExplanation')}
              />
              <TextArea
                id="mission-limitation"
                label={text.step3.limitationLabel}
                hint={text.step3.limitationHint}
                value={progress.limitation}
                onChange={(limitation) => update({ limitation })}
                error={fieldError('errorLimitation')}
              />
              <TextArea
                id="mission-next-data"
                label={text.step3.nextDataLabel}
                hint={text.step3.nextDataHint}
                value={progress.nextData}
                onChange={(nextData) => update({ nextData })}
                error={fieldError('errorNextData')}
                rows={2}
              />
              <div className="print-callout">
                <h3 className="mission-step__subtitle">{text.step3.printTitle}</h3>
                <p className="field__hint">{text.step3.printHint}</p>
                <div className="mission-step__actions">
                  <a href="#mission-sheet" className="button button--ghost button--small">
                    {text.step3.preview} ↓
                  </a>
                  <button type="button" className="button button--primary" onClick={() => printSheet(3)}>
                    {text.step3.print}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="mission-step">
              <p>{text.step4.intro}</p>
              <div className="field">
                <label htmlFor="mission-reviewer">{text.step4.reviewerLabel}</label>
                <input
                  id="mission-reviewer"
                  type="text"
                  maxLength={60}
                  value={progress.reviewerTeam}
                  onChange={(event) => update({ reviewerTeam: event.target.value })}
                />
              </div>
              <TextArea
                id="mission-objection"
                label={text.step4.objectionLabel}
                hint={text.step4.objectionHint}
                value={progress.objection}
                onChange={(objection) => update({ objection })}
                error={fieldError('errorObjection')}
              />
              <fieldset className="field" aria-invalid={fieldError('errorDecision') ? true : undefined}>
                <legend>{text.step4.decisionLabel}</legend>
                {fieldError('errorDecision') ? <p className="field__error">{fieldError('errorDecision')}</p> : null}
                <div className="choice-list">
                  {REVIEW_DECISIONS.map((decision) => (
                    <label key={decision} className="choice-card">
                      <input
                        type="radio"
                        name="review-decision"
                        checked={progress.decision === decision}
                        onChange={() =>
                          update({ decision, decisionFindingId: decision === 'more-evidence' ? null : progress.decisionFindingId })
                        }
                      />
                      <span>
                        <strong>
                          {decision === 'change'
                            ? text.step4.decisions.change(changeTarget ? text.sites[changeTarget].name : '—')
                            : text.step4.decisions[decision]}
                        </strong>
                        <span className="choice-card__meta">{text.step4.decisionHints[decision]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {progress.decision === 'keep' || progress.decision === 'change' ? (
                <FindingChoice
                  legend={text.step4.supportLabel}
                  hint={text.step4.supportHint}
                  name="decision-finding"
                  findings={progress.findings}
                  value={progress.decisionFindingId}
                  onChange={(decisionFindingId) => update({ decisionFindingId })}
                  error={fieldError('errorDecisionFinding')}
                />
              ) : null}
              {progress.decision ? (
                <TextArea
                  id="mission-decision-reason"
                  label={text.step4.reasonLabel[progress.decision]}
                  hint={text.step4.reasonHint[progress.decision]}
                  value={progress.decisionReason}
                  onChange={(decisionReason) => update({ decisionReason })}
                  error={fieldError('errorDecisionReason')}
                />
              ) : null}
              <FindingLog findings={progress.findings} max={MAX_FINDINGS} onEditNote={editFindingNote} onRemove={removeFinding} />
            </div>
          ) : null}

          {step === 5 ? (
            <div className="mission-step">
              <p>{text.step5.intro}</p>
              <p className="neutral-note">{text.step5.neutral}</p>
              <p className="field__hint">{text.step5.ready}</p>
              <div className="mission-step__actions">
                <a href="#mission-sheet" className="button button--ghost button--small">
                  {text.step5.preview} ↓
                </a>
                <button type="button" className="button button--primary" onClick={() => printSheet(4)}>
                  {text.step5.print}
                </button>
              </div>
            </div>
          ) : null}

          <div className="mission__nav">
            {step > 1 ? (
              <button type="button" className="button button--ghost" onClick={() => goTo((step - 1) as MissionStep)}>
                ← {text.steps.back}
              </button>
            ) : (
              <span />
            )}
            {step < 5 ? (
              <button type="button" className="button button--primary" onClick={advance}>
                {nextLabels[step - 1]} →
              </button>
            ) : null}
          </div>

          <div className="mission__reset">
            <p className="field__hint">{text.steps.autosave}</p>
            {confirmReset ? (
              <div className="mission__reset-confirm" role="group" aria-label={text.steps.restartConfirm}>
                <span>{text.steps.restartConfirm}</span>
                <button
                  type="button"
                  className="button button--small button--danger"
                  onClick={() => {
                    reset();
                    setErrors([]);
                    setConfirmReset(false);
                  }}
                >
                  {text.steps.restartYes}
                </button>
                <button type="button" className="button button--small button--ghost" onClick={() => setConfirmReset(false)}>
                  {text.steps.restartNo}
                </button>
              </div>
            ) : (
              <button type="button" className="link-button" onClick={() => setConfirmReset(true)}>
                {text.steps.restart}
              </button>
            )}
          </div>
        </aside>
      </div>

      {step === 3 || step === 5 ? (
        <div className="container mission__sheet" id="mission-sheet">
          <MissionSheet progress={progress} variant={step === 3 ? 'review' : 'final'} />
        </div>
      ) : null}

      <div className="container print-hide">
        <DataNotes />
      </div>
    </div>
  );
}

function SiteChoice({
  legend,
  hint,
  name,
  value,
  onChange,
  error,
}: {
  legend: string;
  hint?: string;
  name: string;
  value: string | null;
  onChange: (site: CandidateSiteId) => void;
  error: string | null;
}) {
  const text = useRoverMissionText();
  return (
    <fieldset className="field" aria-invalid={error ? true : undefined}>
      <legend>{legend}</legend>
      {hint ? <p className="field__hint">{hint}</p> : null}
      {error ? <p className="field__error">{error}</p> : null}
      <div className="choice-list">
        {CANDIDATE_SITE_IDS.map((id) => (
          <label key={id} className="choice-card">
            <input type="radio" name={name} checked={value === id} onChange={() => onChange(id)} />
            <span>
              <strong>{text.sites[id].name}</strong>
              <span className="choice-card__meta">
                {text.sites[id].kind} · {text.sites[id].place}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Elegir un hallazgo de la bitácora (hallazgo principal o el que respalda la decisión). */
function FindingChoice({
  legend,
  hint,
  name,
  findings,
  value,
  onChange,
  error,
}: {
  legend: string;
  hint: string;
  name: string;
  findings: Finding[];
  value: string | null;
  onChange: (id: string) => void;
  error: string | null;
}) {
  const describe = useFindingText();
  return (
    <fieldset className="field" aria-invalid={error ? true : undefined}>
      <legend>{legend}</legend>
      <p className="field__hint">{hint}</p>
      {error ? <p className="field__error">{error}</p> : null}
      <div className="choice-list">
        {findings.map((finding, i) => (
          <label key={finding.id} className="choice-card choice-card--compact">
            <input
              type="radio"
              name={name}
              checked={value === finding.id}
              onChange={() => onChange(finding.id)}
              aria-label={`${i + 1}. ${describe(finding).where}`}
            />
            <span>
              <FindingSummary finding={finding} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  rows = 3,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  rows?: number;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <p id={`${id}-hint`} className="field__hint">
        {hint}
      </p>
      {error ? (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      ) : null}
      <textarea
        id={id}
        rows={rows}
        maxLength={1000}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
