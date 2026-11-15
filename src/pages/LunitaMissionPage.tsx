import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { LunitaAvatar, MoonScene } from '../components/lunita/LunitaArt';
import { MapPuzzle } from '../components/lunita/MapPuzzle';
import { PathCanvas } from '../components/lunita/PathCanvas';
import { HELPFUL_PARTS, MAP_PIECES, MOON_LIKE_PIECE, REASONS, type HelpfulPartId, type Point } from '../data/missions/lunitaMission';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { LUNITA_STEPS, useLunitaProgress, type LunitaStep } from '../hooks/useLunitaProgress';
import { useMessages } from '../i18n/I18nContext';
import { useLunitaMissionText } from '../i18n/missions';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

const STEP_ICONS = ['🔭', '🧩', '✏️', '🚀', '💬'];
const REASON_ICONS: Record<(typeof REASONS)[number], string> = { rocks: '🪨', craters: '🕳️', noPlants: '🚫🌱', dry: '☀️' };
const PART_ICONS: Record<HelpfulPartId, string> = { rocks: '🪨', crater: '🕳️', flat: '➖', sand: '🏜️' };

/** Lunita habla: avatar + una instrucción breve. */
function LunitaSays({ children, big = false }: { children: ReactNode; big?: boolean }) {
  return (
    <div className={big ? 'lunita-says lunita-says--big' : 'lunita-says'}>
      <LunitaAvatar size={big ? 72 : 52} />
      <p className="lunita-says__text">{children}</p>
    </div>
  );
}

/**
 * Misión 4Kids «Lunita necesita un camino» (6–12 años), en cinco pantallas:
 *  1. Mira el terreno lunar. 2. Arma el mapa terrestre. 3. Dibuja el camino.
 *  4. Prueba y corrige. 5. Cuéntanos.
 * Botones grandes, iconos con etiqueta y una instrucción por pantalla.
 * El avance (incluida la ruta) se guarda en el navegador.
 */
export function LunitaMissionPage() {
  const text = useLunitaMissionText();
  const { NAV_LABELS } = useMessages();
  useDocumentTitle(text.meta.pageTitle);
  const { progress, update, reset } = useLunitaProgress();
  const { step } = progress;
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Al cambiar de pantalla, el foco va al título (teclado y lectores de pantalla).
  // En el paso 4 no: el foco se queda en «Mover a Lunita» mientras se prueba.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (step !== 4) headingRef.current?.focus();
  }, [step, progress.done]);

  const goTo = (next: LunitaStep) => {
    setErrors([]);
    update({ step: next });
    if (next !== 4) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onStrokesChange = useCallback((strokes: Point[][]) => update({ strokes }), [update]);
  const onRun = useCallback(() => update({ step: 4 }), [update]);
  const onArrived = useCallback(() => update({ arrived: true }), [update]);

  const t1 = text.step1;
  const t2 = text.step2;
  const t3 = text.step3;
  const t4 = text.step4;
  const t5 = text.step5;
  const titles = [t1.title, t2.title, t3.title, t4.title, t5.title];

  const puzzleDone = progress.placed.length === MAP_PIECES.length;
  const regionOk = progress.region === MOON_LIKE_PIECE;

  const nextFromMap = () => {
    const found: string[] = [];
    if (!regionOk) found.push(t2.needRegion);
    if (progress.reasons.length === 0) found.push(t2.needReason);
    setErrors(found);
    if (found.length === 0) goTo(3);
  };

  const finish = () => {
    const found: string[] = [];
    if (!progress.helped) found.push(t5.needHelped);
    if (!progress.age) found.push(t5.needAge);
    const said = progress.because.trim().length >= 3 || (progress.age === 'younger' && progress.oral);
    if (progress.age && !said) found.push(t5.needBecause);
    setErrors(found);
    if (found.length === 0) update({ done: true });
  };

  const restart = () => {
    reset();
    setErrors([]);
    setConfirmReset(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="lunita">
      <header className="lunita__head">
        <div className="container">
          <Link to={ROUTES.portal} className="mission__back">
            ← {NAV_LABELS.portal}
          </Link>
          <p className="lunita-feature__badges">
            <span className="lunita-badge">{text.meta.badge}</span>
            <span className="lunita-ages">{text.meta.ages}</span>
          </p>
          <h1 className="lunita__title">{text.meta.title}</h1>
        </div>
      </header>

      <div className="container lunita__body">
        <ol className="lunita-steps" aria-label={text.steps.label}>
          {LUNITA_STEPS.map((n, i) => (
            <li
              key={n}
              className={n === step && !progress.done ? 'is-current' : n < step || progress.done ? 'is-done' : ''}
              aria-current={n === step && !progress.done ? 'step' : undefined}
            >
              <span className="lunita-steps__icon" aria-hidden="true">
                {n < step || progress.done ? '✓' : STEP_ICONS[i]}
              </span>
              <span className="lunita-steps__label">{text.steps.labels[i]}</span>
            </li>
          ))}
        </ol>

        <section className="lunita-stage" aria-labelledby="lunita-stage-title">
          <p className="lunita-stage__count">{text.steps.current(step, LUNITA_STEPS.length)}</p>
          <h2 id="lunita-stage-title" className="lunita-stage__title" ref={headingRef} tabIndex={-1}>
            {progress.done ? t5.doneTitle : titles[step - 1]}
          </h2>

          {/* 1. Mira el terreno lunar */}
          {step === 1 ? (
            <>
              <LunitaSays big>{t1.challenge}</LunitaSays>
              <figure className="lunita-figure">
                <MoonScene title={t1.sceneAlt} rocksLabel={t1.rocksLabel} craterLabel={t1.craterLabel} />
                <figcaption>
                  <span className="lunita-tag">{text.meta.illustrative}</span> {t1.instruction}
                </figcaption>
              </figure>
              <div className="lunita-nav">
                <button type="button" className="lunita-button lunita-button--go lunita-button--wide" onClick={() => goTo(2)}>
                  <span aria-hidden="true">🌍</span> {t1.start}
                </button>
              </div>
            </>
          ) : null}

          {/* 2. Arma el mapa terrestre y señala la parte parecida a la Luna */}
          {step === 2 ? (
            <>
              <LunitaSays>{puzzleDone ? t2.pick : t2.instruction}</LunitaSays>
              <div className="lunita-map-frame">
                <MapPuzzle
                  placed={progress.placed}
                  onPlace={(piece) => update((p) => ({ placed: p.placed.includes(piece) ? p.placed : [...p.placed, piece] }))}
                  region={progress.region}
                  onPickRegion={(region) => update({ region })}
                />
                <span className="lunita-tag lunita-tag--corner">{text.meta.illustrative}</span>
              </div>
              {puzzleDone && progress.region ? (
                <p className={regionOk ? 'lunita-feedback is-yes' : 'lunita-feedback'} role="status">
                  {t2.regionFeedback[progress.region]}
                </p>
              ) : null}
              {puzzleDone && regionOk ? (
                <fieldset className="lunita-choices">
                  <legend>{t2.why}</legend>
                  {REASONS.map((reason) => {
                    const on = progress.reasons.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        className="lunita-chip lunita-chip--big"
                        aria-pressed={on}
                        onClick={() =>
                          update((p) => ({
                            reasons: on ? p.reasons.filter((r) => r !== reason) : [...p.reasons, reason],
                          }))
                        }
                      >
                        <span aria-hidden="true">{REASON_ICONS[reason]}</span> {t2.reasons[reason]}
                      </button>
                    );
                  })}
                </fieldset>
              ) : null}
            </>
          ) : null}

          {/* 3 y 4. Dibuja el camino; prueba y corrige (mismo lienzo: no se pierde la ruta) */}
          {step === 3 || step === 4 ? (
            <>
              <LunitaSays>{step === 3 ? t3.instruction : t4.fixHint}</LunitaSays>
              <PathCanvas strokes={progress.strokes} onStrokesChange={onStrokesChange} onRun={onRun} onArrived={onArrived} />
            </>
          ) : null}

          {/* 5. Cuéntanos */}
          {step === 5 && !progress.done ? (
            <div className="lunita-tell">
              <fieldset className="lunita-choices">
                <legend>{t5.helped}</legend>
                {HELPFUL_PARTS.map((part) => (
                  <button
                    key={part}
                    type="button"
                    className="lunita-chip lunita-chip--big"
                    aria-pressed={progress.helped === part}
                    onClick={() => update({ helped: part })}
                  >
                    <span aria-hidden="true">{PART_ICONS[part]}</span> {t5.parts[part]}
                  </button>
                ))}
              </fieldset>

              <fieldset className="lunita-choices">
                <legend>{t5.age}</legend>
                <button type="button" className="lunita-chip lunita-chip--big" aria-pressed={progress.age === 'younger'} onClick={() => update({ age: 'younger' })}>
                  <span aria-hidden="true">🧒</span> {t5.younger}
                </button>
                <button type="button" className="lunita-chip lunita-chip--big" aria-pressed={progress.age === 'older'} onClick={() => update({ age: 'older' })}>
                  <span aria-hidden="true">🧑‍🚀</span> {t5.older}
                </button>
              </fieldset>

              {progress.age ? (
                <div className="lunita-field-group">
                  <label htmlFor="lunita-because" className="lunita-sentence">
                    {t5.because}
                  </label>
                  <textarea
                    id="lunita-because"
                    rows={3}
                    value={progress.because}
                    placeholder={t5.becausePlaceholder}
                    onChange={(event) => update({ because: event.target.value })}
                  />
                  {progress.age === 'younger' ? (
                    <>
                      <button
                        type="button"
                        className="lunita-chip lunita-chip--big"
                        aria-pressed={progress.oral}
                        onClick={() => update((p) => ({ oral: !p.oral }))}
                      >
                        <span aria-hidden="true">🗣️</span> {t5.oral}
                      </button>
                      <p className="lunita-hint">{t5.oralHint}</p>
                    </>
                  ) : (
                    <div className="lunita-challenge">
                      <p className="lunita-challenge__title">
                        <span aria-hidden="true">⛰️</span> {t5.challengeTitle}
                      </p>
                      <label htmlFor="lunita-challenge">{t5.challenge}</label>
                      <textarea
                        id="lunita-challenge"
                        rows={2}
                        value={progress.challenge}
                        placeholder={t5.challengePlaceholder}
                        onChange={(event) => update({ challenge: event.target.value })}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Final */}
          {step === 5 && progress.done ? (
            <div className="lunita-done">
              <div className="lunita-done__hero">
                <LunitaAvatar size={96} />
                <p>{t5.doneText}</p>
              </div>
              <dl className="lunita-done__summary">
                <div>
                  <dt>{t5.summaryPlace}</dt>
                  <dd>{t2.pieces[MOON_LIKE_PIECE]}</dd>
                </div>
                <div>
                  <dt>{t5.summaryHelped}</dt>
                  <dd>{progress.helped ? t5.parts[progress.helped] : '—'}</dd>
                </div>
                <div>
                  <dt>{t5.summaryBecause}</dt>
                  <dd>{progress.because.trim() || (progress.oral ? t5.summaryOral : '—')}</dd>
                </div>
                {progress.age === 'older' && progress.challenge.trim() ? (
                  <div>
                    <dt>{t5.summaryChallenge}</dt>
                    <dd>{progress.challenge.trim()}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="lunita-nav">
                <button type="button" className="lunita-button lunita-button--go" onClick={restart}>
                  <span aria-hidden="true">🔁</span> {t5.playAgain}
                </button>
                <Link to={ROUTES.portal} className="lunita-button lunita-button--tool">
                  <span aria-hidden="true">🏠</span> {t5.backToPortal}
                </Link>
              </div>
              <p className="lunita-hint">
                <Link to={ROUTES.missionStart}>{t5.nextMission} →</Link>
              </p>
            </div>
          ) : null}

          {errors.length > 0 ? (
            <ul className="lunita-errors" role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          {/* Navegación entre pantallas */}
          {step > 1 && !progress.done ? (
            <div className="lunita-nav">
              <button type="button" className="lunita-button lunita-button--tool" onClick={() => goTo((step === 4 ? 2 : step - 1) as LunitaStep)}>
                <span aria-hidden="true">←</span> {text.nav.back}
              </button>
              {step === 2 && puzzleDone ? (
                <button type="button" className="lunita-button lunita-button--go" onClick={nextFromMap}>
                  {text.nav.next} <span aria-hidden="true">→</span>
                </button>
              ) : null}
              {(step === 3 || step === 4) && progress.arrived ? (
                <button type="button" className="lunita-button lunita-button--go" onClick={() => goTo(5)}>
                  {text.nav.next} <span aria-hidden="true">→</span>
                </button>
              ) : null}
              {step === 5 ? (
                <button type="button" className="lunita-button lunita-button--go" onClick={finish}>
                  <span aria-hidden="true">🏁</span> {t5.finish}
                </button>
              ) : null}
            </div>
          ) : null}
        </section>

        <p className="lunita-note">
          <span className="lunita-tag">{text.meta.illustrative}</span> {text.meta.illustrativeNote}
        </p>

        <div className="lunita-restart">
          {confirmReset ? (
            <div role="alertdialog" aria-labelledby="lunita-restart-q" className="lunita-restart__confirm">
              <p id="lunita-restart-q">{text.nav.restartConfirm}</p>
              <button type="button" className="lunita-button lunita-button--danger" onClick={restart}>
                {text.nav.restartYes}
              </button>
              <button type="button" className="lunita-button lunita-button--tool" onClick={() => setConfirmReset(false)}>
                {text.nav.restartNo}
              </button>
            </div>
          ) : (
            <button type="button" className="link-button" onClick={() => setConfirmReset(true)}>
              {text.nav.restart}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
