import { useCallback, useEffect, useState } from 'react';
import {
  clampToField,
  HELPFUL_PARTS,
  MAP_PIECES,
  REASONS,
  type HelpfulPartId,
  type MapPieceId,
  type Point,
  type ReasonId,
} from '../data/missions/lunitaMission';

/**
 * Avance en «Lunita necesita un camino». Vive en `localStorage` (sin cuentas
 * ni servidor): si se recarga la página, el juego sigue donde iba, incluida
 * la ruta dibujada.
 */

export const LUNITA_STEPS = [1, 2, 3, 4, 5] as const;
export type LunitaStep = (typeof LUNITA_STEPS)[number];
export type AgeGroup = 'younger' | 'older';

export interface LunitaProgress {
  step: LunitaStep;
  /** Piezas ya colocadas en su lugar. */
  placed: MapPieceId[];
  /** Parte del mapa que señalaron como parecida a la Luna. */
  region: MapPieceId | null;
  reasons: ReasonId[];
  /** Trazos de la ruta; «Deshacer» quita el último. */
  strokes: Point[][];
  /** Lunita ya llegó a la meta al menos una vez. */
  arrived: boolean;
  age: AgeGroup | null;
  helped: HelpfulPartId | null;
  because: string;
  /** Los más pequeños pueden explicarlo en voz alta. */
  oral: boolean;
  challenge: string;
  done: boolean;
}

export const EMPTY_LUNITA: LunitaProgress = {
  step: 1,
  placed: [],
  region: null,
  reasons: [],
  strokes: [],
  arrived: false,
  age: null,
  helped: null,
  because: '',
  oral: false,
  challenge: '',
  done: false,
};

const STORAGE_KEY = 'terranauta-mission-lunita-v1';
const MAX_POINTS = 2000;

const oneOf = <T extends string>(list: readonly T[], value: unknown): T | null =>
  typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T) : null;

const uniqueOf = <T extends string>(list: readonly T[], value: unknown): T[] =>
  Array.isArray(value) ? [...new Set(value.map((v) => oneOf(list, v)).filter((v): v is T => v !== null))] : [];

const text = (value: unknown, max = 500) => (typeof value === 'string' ? value.slice(0, max) : '');

function sanitizeStrokes(value: unknown): Point[][] {
  if (!Array.isArray(value)) return [];
  let count = 0;
  const out: Point[][] = [];
  for (const stroke of value) {
    if (!Array.isArray(stroke)) continue;
    const points = stroke
      .filter((p): p is Point => !!p && Number.isFinite(p.x) && Number.isFinite(p.y))
      .map((p) => clampToField(p));
    count += points.length;
    if (points.length > 0 && count <= MAX_POINTS) out.push(points);
  }
  return out;
}

/** Acepta cualquier cosa (datos viejos o corruptos) y devuelve un avance válido. */
export function sanitizeLunita(raw: unknown): LunitaProgress {
  if (!raw || typeof raw !== 'object') return EMPTY_LUNITA;
  const r = raw as Record<string, unknown>;
  const step = (LUNITA_STEPS as readonly unknown[]).includes(r.step) ? (r.step as LunitaStep) : 1;
  const placed = uniqueOf(MAP_PIECES, r.placed);
  const strokes = sanitizeStrokes(r.strokes);
  const arrived = r.arrived === true;
  // No se puede estar más adelante de lo que se completó.
  const maxStep: LunitaStep = placed.length < MAP_PIECES.length ? 2 : arrived ? 5 : 4;
  return {
    step: Math.min(step, step === 1 ? 1 : maxStep) as LunitaStep,
    placed,
    region: oneOf(MAP_PIECES, r.region),
    reasons: uniqueOf(REASONS, r.reasons),
    strokes,
    arrived,
    age: oneOf(['younger', 'older'] as const, r.age),
    helped: oneOf(HELPFUL_PARTS, r.helped),
    because: text(r.because),
    oral: r.oral === true,
    challenge: text(r.challenge),
    done: r.done === true,
  };
}

function read(): LunitaProgress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeLunita(JSON.parse(stored)) : EMPTY_LUNITA;
  } catch {
    return EMPTY_LUNITA;
  }
}

export function useLunitaProgress() {
  const [progress, setProgress] = useState<LunitaProgress>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Sin almacenamiento: el juego dura mientras la página esté abierta.
    }
  }, [progress]);

  const update = useCallback((patch: Partial<LunitaProgress> | ((p: LunitaProgress) => Partial<LunitaProgress>)) => {
    setProgress((current) => ({ ...current, ...(typeof patch === 'function' ? patch(current) : patch) }));
  }, []);

  const reset = useCallback(() => setProgress(EMPTY_LUNITA), []);

  return { progress, update, reset };
}
