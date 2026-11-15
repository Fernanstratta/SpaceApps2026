/**
 * Misión 4Kids «Lunita necesita un camino» (6–12 años).
 *
 * Todo lo que aparece aquí es ILUSTRATIVO: el mapa terrestre, el campo de
 * rocas y el terreno lunar son dibujos pensados para jugar, no datos reales.
 * La interfaz lo indica con la etiqueta «Mapa ilustrativo».
 *
 * La lógica (rutas, colisiones, llegada) es pura para poder verificarla sin
 * navegador: `npm run verify:lunita`.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rock extends Point {
  r: number;
}

/* ------------------------------------------------------------------ */
/* Rompecabezas: mapa terrestre en tres piezas                         */
/* ------------------------------------------------------------------ */

/** Las tres piezas del mapa, en su orden correcto (izquierda → derecha). */
export const MAP_PIECES = ['forest', 'lava', 'coast'] as const;
export type MapPieceId = (typeof MAP_PIECES)[number];

/** Orden en que aparecen las piezas sueltas (fijo, para que la demo sea repetible). */
export const TRAY_ORDER: readonly MapPieceId[] = ['coast', 'forest', 'lava'];

/** La parte del mapa que se parece al terreno lunar: rocas, cráteres, sin agua ni plantas. */
export const MOON_LIKE_PIECE: MapPieceId = 'lava';

/** Tamaño del dibujo completo del mapa; cada pieza es un tercio. */
export const MAP_SIZE = { width: 600, height: 360 } as const;
export const PIECE_WIDTH = MAP_SIZE.width / MAP_PIECES.length;

/** Razones que pueden elegir para explicar por qué ese lugar sirve. */
export const REASONS = ['rocks', 'craters', 'noPlants', 'dry'] as const;
export type ReasonId = (typeof REASONS)[number];

/** Partes del campo de práctica que pueden señalar al final. */
export const HELPFUL_PARTS = ['rocks', 'crater', 'flat', 'sand'] as const;
export type HelpfulPartId = (typeof HELPFUL_PARTS)[number];

/* ------------------------------------------------------------------ */
/* Campo de rocas: donde se dibuja el camino                           */
/* ------------------------------------------------------------------ */

export const FIELD = { width: 400, height: 260 } as const;
/** Donde empieza Lunita. */
export const START: Point = { x: 40, y: 130 };
/** La meta (bandera junto al cráter de práctica). */
export const GOAL: Point = { x: 360, y: 130 };
/** Qué tan cerca de la meta hay que llegar. */
export const GOAL_RADIUS = 24;
/**
 * Medio ancho de Lunita para chocar con una roca. Es menor que el dibujo
 * para perdonar trazos imprecisos de manos pequeñas.
 */
export const ROVER_CLEARANCE = 8;

/**
 * Rocas del campo. El grupo central bloquea la línea recta; hay al menos
 * dos pasos libres (por arriba y por abajo) y también se puede zigzaguear
 * entre algunas rocas.
 */
export const ROCKS: readonly Rock[] = [
  { x: 130, y: 130, r: 22 },
  { x: 195, y: 105, r: 20 },
  { x: 205, y: 165, r: 18 },
  { x: 270, y: 135, r: 22 },
  { x: 220, y: 15, r: 10 },
  { x: 305, y: 100, r: 12 },
  { x: 60, y: 215, r: 10 },
  { x: 250, y: 250, r: 10 },
];

/** Dos rutas de ejemplo que funcionan (se usan en la verificación y en la guía de la demo). */
export const SAMPLE_ROUTES: Readonly<Record<'top' | 'bottom', readonly Point[]>> = {
  top: [START, { x: 90, y: 60 }, { x: 320, y: 50 }, GOAL],
  bottom: [START, { x: 100, y: 210 }, { x: 310, y: 215 }, GOAL],
};

/* ------------------------------------------------------------------ */
/* Geometría                                                           */
/* ------------------------------------------------------------------ */

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

export function clampToField(p: Point): Point {
  return {
    x: Math.min(FIELD.width, Math.max(0, Math.round(p.x))),
    y: Math.min(FIELD.height, Math.max(0, Math.round(p.y))),
  };
}

/** Longitud total de una ruta. */
export function routeLength(route: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i += 1) total += dist(route[i - 1]!, route[i]!);
  return total;
}

/** Punto a cierta distancia del inicio de la ruta (con el ángulo del tramo, para girar a Lunita). */
export function pointAt(route: readonly Point[], distance: number): Point & { angle: number } {
  const first = route[0] ?? START;
  if (route.length < 2) return { ...first, angle: 0 };
  let left = Math.max(0, distance);
  for (let i = 1; i < route.length; i += 1) {
    const a = route[i - 1]!;
    const b = route[i]!;
    const len = dist(a, b);
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    if (left <= len || i === route.length - 1) {
      const t = len === 0 ? 0 : Math.min(1, left / len);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle };
    }
    left -= len;
  }
  return { ...first, angle: 0 };
}

/**
 * Primera distancia `t·len` (0..len) en que el segmento a→b entra en el
 * círculo (c, radius). `null` si no lo toca.
 */
function segmentEntersCircle(a: Point, b: Point, c: Point, radius: number): number | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const fx = a.x - c.x;
  const fy = a.y - c.y;
  const len = Math.hypot(dx, dy);
  if (fx * fx + fy * fy <= radius * radius) return 0;
  if (len === 0) return null;
  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - radius * radius;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return null;
  const t = (-B - Math.sqrt(disc)) / (2 * A);
  return t >= 0 && t <= 1 ? t * len : null;
}

export interface Collision {
  /** Distancia recorrida al tocar la roca. */
  distance: number;
  rockIndex: number;
}

/** Primera roca que tocaría Lunita al recorrer la ruta. */
export function firstCollision(route: readonly Point[], rocks: readonly Rock[] = ROCKS): Collision | null {
  let travelled = 0;
  for (let i = 1; i < route.length; i += 1) {
    const a = route[i - 1]!;
    const b = route[i]!;
    let best: Collision | null = null;
    rocks.forEach((rock, rockIndex) => {
      const hit = segmentEntersCircle(a, b, rock, rock.r + ROVER_CLEARANCE);
      if (hit !== null && (!best || hit < best.distance)) best = { distance: hit, rockIndex };
    });
    if (best) {
      const found: Collision = best;
      return { distance: travelled + found.distance, rockIndex: found.rockIndex };
    }
    travelled += dist(a, b);
  }
  return null;
}

/** Distancia recorrida al llegar a la meta, o `null` si la ruta nunca llega. */
export function goalDistance(route: readonly Point[]): number | null {
  let travelled = 0;
  for (let i = 1; i < route.length; i += 1) {
    const a = route[i - 1]!;
    const b = route[i]!;
    const hit = segmentEntersCircle(a, b, GOAL, GOAL_RADIUS);
    if (hit !== null) return travelled + hit;
    travelled += dist(a, b);
  }
  return null;
}

export type RunResult =
  | { kind: 'empty' }
  | { kind: 'arrived'; distance: number }
  | { kind: 'blocked'; distance: number; rockIndex: number }
  | { kind: 'short'; distance: number };

/** Lunita se detiene un poco antes de la roca, para que se vea que no la tocó. */
const STOP_MARGIN = 18;

/**
 * Qué pasa al pulsar «Mover a Lunita». Cualquier ruta que conecte el
 * inicio con la meta sin tocar rocas es válida: no hay una respuesta única.
 */
export function evaluateRoute(route: readonly Point[]): RunResult {
  if (route.length < 2 || routeLength(route) < 1) return { kind: 'empty' };
  const hit = firstCollision(route);
  const goal = goalDistance(route);
  if (goal !== null && (!hit || goal <= hit.distance)) return { kind: 'arrived', distance: goal };
  if (hit) return { kind: 'blocked', distance: Math.max(0, hit.distance - STOP_MARGIN), rockIndex: hit.rockIndex };
  return { kind: 'short', distance: routeLength(route) };
}

/**
 * Recorta la ruta en el punto donde se detuvo Lunita, para seguir dibujando
 * desde ahí sin empezar de nuevo.
 */
export function truncateRoute(route: readonly Point[], distance: number): Point[] {
  const out: Point[] = [route[0] ?? START];
  let left = distance;
  for (let i = 1; i < route.length; i += 1) {
    const a = route[i - 1]!;
    const b = route[i]!;
    const len = dist(a, b);
    if (left <= len) {
      const t = len === 0 ? 0 : left / len;
      const cut = { x: Math.round(a.x + (b.x - a.x) * t), y: Math.round(a.y + (b.y - a.y) * t) };
      if (dist(cut, out[out.length - 1]!) > 0.5) out.push(cut);
      return out;
    }
    out.push(b);
    left -= len;
  }
  return out;
}

/** Ruta completa a partir de los trazos (cada trazo se deshace de una vez). */
export function routeFromStrokes(strokes: readonly (readonly Point[])[]): Point[] {
  return [START, ...strokes.flat()];
}

/** Distancia mínima entre puntos al dibujar a mano alzada (evita miles de puntos). */
export const MIN_STEP = 6;
/** Paso del cursor con las flechas del teclado (con Mayús, el triple). */
export const KEY_STEP = 10;
