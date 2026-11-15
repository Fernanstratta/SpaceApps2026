import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import {
  clampToField,
  evaluateRoute,
  FIELD,
  KEY_STEP,
  MIN_STEP,
  pointAt,
  routeFromStrokes,
  START,
  truncateRoute,
  type Point,
  type RunResult,
} from '../../data/missions/lunitaMission';
import { useLunitaMissionText } from '../../i18n/missions';
import { FieldArt, LUNITA_COLORS, LunitaAvatar, LunitaShape } from './LunitaArt';

type Mode = 'draw' | 'points';

interface Run {
  route: Point[];
  result: Exclude<RunResult, { kind: 'empty' }>;
  /** Distancia recorrida en la animación. */
  at: number;
  moving: boolean;
}

/** Velocidad de Lunita (unidades del campo por segundo). */
const SPEED = 130;
const SPEED_REDUCED = 1200;

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * Campo de rocas para dibujar el camino de Lunita (pasos 3 y 4).
 *  - A mano alzada con dedo o mouse (cada trazo se deshace de una vez).
 *  - Marcando puntos consecutivos con toques.
 *  - Con teclado: flechas mueven una mira y Enter marca un punto.
 * «Mover a Lunita» la anima sobre el trazo. Si toca una roca se detiene ahí,
 * muestra una pista y se puede corregir sin rehacer el rompecabezas.
 */
export function PathCanvas({
  strokes,
  onStrokesChange,
  onRun,
  onArrived,
}: {
  strokes: Point[][];
  onStrokesChange: (strokes: Point[][]) => void;
  onRun: () => void;
  onArrived: () => void;
}) {
  const text = useLunitaMissionText();
  const t3 = text.step3;
  const t4 = text.step4;
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<Mode>('draw');
  const [live, setLive] = useState<Point[] | null>(null);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [emptyWarning, setEmptyWarning] = useState(false);
  const onArrivedRef = useRef(onArrived);
  useEffect(() => {
    onArrivedRef.current = onArrived;
  }, [onArrived]);

  const route = useMemo(() => routeFromStrokes(live ? [...strokes, live] : strokes), [strokes, live]);
  const pointCount = route.length - 1;

  // Animación: avanza `at` hasta la distancia del resultado.
  const moving = run?.moving ?? false;
  useEffect(() => {
    if (!moving) return;
    const speed = reducedMotion() ? SPEED_REDUCED : SPEED;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let finished = false;
      setRun((current) => {
        if (!current || !current.moving) return current;
        const at = Math.min(current.result.distance, current.at + speed * dt);
        finished = at >= current.result.distance;
        return { ...current, at, moving: !finished };
      });
      if (!finished) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  // Al llegar, se avisa una sola vez por recorrido.
  const arrivedNow = run !== null && !run.moving && run.result.kind === 'arrived';
  useEffect(() => {
    if (arrivedNow) onArrivedRef.current();
  }, [arrivedNow]);

  const changeStrokes = (next: Point[][]) => {
    setRun(null);
    setEmptyWarning(false);
    onStrokesChange(next);
  };

  const toField = (event: { clientX: number; clientY: number }): Point => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return START;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return clampToField({ x: p.x, y: p.y });
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (moving || event.button !== 0) return;
    event.preventDefault();
    const p = toField(event);
    setCursor(null);
    if (mode === 'points') {
      changeStrokes([...strokes, [p]]);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    setRun(null);
    setLive([p]);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!live) return;
    const p = toField(event);
    const last = live[live.length - 1]!;
    if (Math.hypot(p.x - last.x, p.y - last.y) >= MIN_STEP) setLive([...live, p]);
  };

  const finishStroke = () => {
    if (!live) return;
    const stroke = live;
    setLive(null);
    changeStrokes([...strokes, stroke]);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (moving) return;
    const step = event.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    const from = cursor ?? route[route.length - 1] ?? START;
    const moves: Record<string, Point> = {
      ArrowUp: { x: from.x, y: from.y - step },
      ArrowDown: { x: from.x, y: from.y + step },
      ArrowLeft: { x: from.x - step, y: from.y },
      ArrowRight: { x: from.x + step, y: from.y },
    };
    const next = moves[event.key];
    if (next) {
      event.preventDefault();
      setCursor(clampToField(next));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      changeStrokes([...strokes, [clampToField(from)]]);
      setCursor(clampToField(from));
    }
  };

  const startRun = () => {
    const result = evaluateRoute(route);
    if (result.kind === 'empty') {
      setEmptyWarning(true);
      return;
    }
    setEmptyWarning(false);
    onRun();
    setRun({ route, result, at: 0, moving: true });
  };

  /** Recorta la ruta donde se detuvo Lunita, conservando los trazos anteriores. */
  const continueFromStop = () => {
    if (!run) return;
    const kept = truncateRoute(run.route, run.at).slice(1);
    const next: Point[][] = [];
    let used = 0;
    for (const stroke of strokes) {
      if (used >= kept.length) break;
      const take = Math.min(stroke.length, kept.length - used);
      next.push(kept.slice(used, used + take));
      used += take;
    }
    if (used < kept.length) next.push(kept.slice(used));
    changeStrokes(next);
  };

  const rover = run ? pointAt(run.route, run.at) : { ...START, angle: 0 };
  const deg = (rover.angle * 180) / Math.PI;
  const facingLeft = Math.cos(rover.angle) < -0.2;
  const roverTransform = facingLeft
    ? `translate(${rover.x} ${rover.y}) rotate(${deg - 180}) scale(-1 1)`
    : `translate(${rover.x} ${rover.y}) rotate(${deg})`;
  const blockedRock = run && !run.moving && run.result.kind === 'blocked' ? run.result.rockIndex : null;
  const routePath = route.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  const done = run && !run.moving ? run.result.kind : null;

  let status: string;
  if (moving) status = t4.moving;
  else if (done === 'blocked') status = t4.hint;
  else if (done === 'short') status = t4.short;
  else if (done === 'arrived') status = t4.arrived;
  else if (emptyWarning) status = t3.empty;
  else status = t3.points(pointCount);

  return (
    <div className="lunita-canvas">
      <div className="lunita-modes" role="group" aria-label={t3.modeLabel}>
        <button type="button" className="lunita-chip" aria-pressed={mode === 'draw'} onClick={() => setMode('draw')}>
          <span aria-hidden="true">✏️</span> {t3.modeDraw}
        </button>
        <button type="button" className="lunita-chip" aria-pressed={mode === 'points'} onClick={() => setMode('points')}>
          <span aria-hidden="true">📍</span> {t3.modePoints}
        </button>
      </div>

      <div className="lunita-canvas__frame">
        <svg
          ref={svgRef}
          className={`lunita-field lunita-field--${mode}`}
          viewBox={`0 0 ${FIELD.width} ${FIELD.height}`}
          role="application"
          aria-label={t3.canvasLabel}
          aria-describedby="lunita-canvas-keys"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onKeyDown={onKeyDown}
          onFocus={() => setCursor((c) => c ?? route[route.length - 1] ?? START)}
          onBlur={() => setCursor(null)}
        >
          <FieldArt goalLabel={t3.goal} blockedRock={blockedRock} />
          {/* Camino dibujado: sombra, trazo amarillo y puntos */}
          <path d={routePath} fill="none" stroke={LUNITA_COLORS.night} strokeOpacity={0.25} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          <path className="lunita-field__route" d={routePath} fill="none" stroke={LUNITA_COLORS.yellow} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          {strokes.map((stroke, i) =>
            stroke.length === 1 ? (
              <circle key={i} cx={stroke[0]!.x} cy={stroke[0]!.y} r={4.5} fill={LUNITA_COLORS.teal} stroke={LUNITA_COLORS.night} strokeWidth={1.5} />
            ) : null,
          )}
          {cursor ? (
            <g className="lunita-field__cursor" transform={`translate(${cursor.x} ${cursor.y})`}>
              <circle r={9} fill="none" stroke={LUNITA_COLORS.night} strokeWidth={2} />
              <path d="M-14 0 H-5 M5 0 H14 M0 -14 V-5 M0 5 V14" stroke={LUNITA_COLORS.night} strokeWidth={2} />
            </g>
          ) : null}
          <g transform={roverTransform}>
            <LunitaShape mood={blockedRock !== null ? 'surprised' : 'happy'} />
          </g>
          {blockedRock !== null ? (
            <g transform={`translate(${rover.x} ${rover.y - 40})`} className="lunita-field__bubble">
              <circle r={11} fill="#e5484d" stroke="#ffffff" strokeWidth={2} />
              <text y={5} textAnchor="middle" fill="#ffffff" fontWeight={800} fontSize={15}>
                !
              </text>
            </g>
          ) : null}
        </svg>
        <span className="lunita-tag lunita-tag--corner">{text.meta.illustrative}</span>
      </div>
      <p id="lunita-canvas-keys" className="lunita-hint">
        {mode === 'points' ? t3.pointsHint : t3.keyboardHint}
      </p>

      <div className={`lunita-says lunita-says--${done ?? 'idle'}`} role="status" aria-live="polite">
        <LunitaAvatar size={48} mood={done === 'blocked' ? 'surprised' : 'happy'} />
        <div>
          <p className="lunita-says__text">{status}</p>
        </div>
      </div>

      <div className="lunita-tools">
        <button
          type="button"
          className="lunita-button lunita-button--tool"
          disabled={moving || strokes.length === 0}
          onClick={() => changeStrokes(strokes.slice(0, -1))}
        >
          <span aria-hidden="true">↶</span> {t3.undo}
        </button>
        <button
          type="button"
          className="lunita-button lunita-button--tool"
          disabled={moving || strokes.length === 0}
          onClick={() => changeStrokes([])}
        >
          <span aria-hidden="true">🧽</span> {t3.clear}
        </button>
        {done === 'blocked' ? (
          <button type="button" className="lunita-button lunita-button--teal" onClick={continueFromStop}>
            <span aria-hidden="true">✂️</span> {t4.fixHere}
          </button>
        ) : null}
        <button type="button" className="lunita-button lunita-button--go" disabled={moving} onClick={startRun}>
          <span aria-hidden="true">🚀</span> {done ? t4.again : t3.move}
        </button>
      </div>
    </div>
  );
}
