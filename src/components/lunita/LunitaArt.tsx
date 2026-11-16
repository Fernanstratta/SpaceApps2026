import { useId } from 'react';
import { FIELD, GOAL, GOAL_RADIUS, MAP_SIZE, PIECE_WIDTH, ROCKS, START, type MapPieceId, MAP_PIECES } from '../../data/missions/lunitaMission';

/**
 * Ilustraciones de la misión 4Kids. Todas son dibujos (no datos reales) y
 * usan la paleta de la misión: caminos amarillos y turquesa sobre Terranauta.
 */

export const LUNITA_COLORS = {
  yellow: '#ffc83d',
  teal: '#17b3a3',
  night: '#1c2b4f',
  white: '#ffffff',
} as const;

/**
 * Lunita, centrada en (0,0) y mirando a la derecha (unos 40 × 36).
 * `mood` cambia la cara: contenta o sorprendida (al toparse con una roca).
 */
export function LunitaShape({ mood = 'happy' }: { mood?: 'happy' | 'surprised' }) {
  const { yellow, teal, night, white } = LUNITA_COLORS;
  return (
    <g className="lunita-shape">
      {/* Panel solar */}
      <rect x={-15} y={-13} width={19} height={6} rx={2} fill={teal} stroke={night} strokeWidth={1.6} />
      {/* Cuerpo */}
      <rect x={-17} y={-7} width={34} height={15} rx={6} fill={yellow} stroke={night} strokeWidth={2} />
      <circle cx={-8} cy={0} r={2} fill={night} opacity={0.35} />
      {/* Mástil y cabeza-cámara */}
      <line x1={9} y1={-7} x2={9} y2={-15} stroke={night} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={9} cy={-21} r={7} fill={white} stroke={night} strokeWidth={2} />
      {mood === 'happy' ? (
        <>
          <circle cx={11.5} cy={-22} r={2.1} fill={night} />
          <path d="M8 -17.8 q3 2 6 0" fill="none" stroke={night} strokeWidth={1.4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={11.5} cy={-22.5} r={2.6} fill={night} />
          <circle cx={11.8} cy={-17.6} r={1.4} fill={night} />
        </>
      )}
      <circle cx={5.4} cy={-25.5} r={1.4} fill={teal} />
      {/* Ruedas */}
      {[-11, 0, 11].map((x) => (
        <g key={x}>
          <circle cx={x} cy={10} r={5.2} fill={night} />
          <circle cx={x} cy={10} r={2} fill={teal} />
        </g>
      ))}
    </g>
  );
}

/** Lunita sola, como avatar junto a las instrucciones. */
export function LunitaAvatar({ size = 56, mood }: { size?: number; mood?: 'happy' | 'surprised' }) {
  return (
    <svg className="lunita-avatar" width={size} height={size} viewBox="-24 -34 48 50" aria-hidden="true" focusable="false">
      <LunitaShape mood={mood} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa terrestre (600 × 360), dividido en tres piezas de 200 de ancho */
/* ------------------------------------------------------------------ */

const ROAD_YELLOW = 'M-10 190 C60 150 130 215 200 185 S330 140 400 195 S520 225 610 175';
const ROAD_TEAL = 'M-10 95 C70 60 140 120 200 95 S320 55 400 85 S510 125 610 90';

/** El mapa completo. Las piezas lo muestran recortado con `viewBox`. */
export function EarthMapArt() {
  const { yellow, teal, night } = LUNITA_COLORS;
  return (
    <g>
      {/* Bosque y lago */}
      <rect x={0} y={0} width={200} height={360} fill="#8fd47e" />
      <ellipse cx={95} cy={280} rx={62} ry={38} fill="#4fb3e8" stroke="#2f86c0" strokeWidth={3} />
      <path d="M58 280 q10 -6 20 0 M100 292 q10 -6 20 0" stroke="#ffffff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {[
        [30, 40],
        [80, 30],
        [150, 45],
        [40, 140],
        [120, 140],
        [170, 240],
        [25, 230],
        [165, 320],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <rect x={-3} y={6} width={6} height={10} rx={1.5} fill="#7a4e2a" />
          <path d="M0 -16 L14 8 L-14 8 Z" fill="#2e8b4f" stroke="#1f6b3a" strokeWidth={1.5} />
        </g>
      ))}

      {/* Campo de rocas volcánicas: rocas oscuras, cráteres, sin plantas */}
      <rect x={200} y={0} width={200} height={360} fill="#d9b98a" />
      <ellipse cx={300} cy={268} rx={52} ry={30} fill="#b08f66" stroke="#7d6243" strokeWidth={4} />
      <ellipse cx={300} cy={272} rx={38} ry={18} fill="#9c7c55" />
      <ellipse cx={252} cy={40} rx={26} ry={14} fill="#b08f66" stroke="#7d6243" strokeWidth={3} />
      {[
        [228, 140, 9],
        [262, 128, 12],
        [338, 138, 10],
        [372, 240, 11],
        [226, 318, 9],
        [360, 40, 8],
        [318, 210, 7],
        [244, 225, 8],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={r} ry={(r ?? 8) * 0.8} fill="#4a4058" />
          <ellipse cx={(x ?? 0) - (r ?? 8) * 0.3} cy={(y ?? 0) - (r ?? 8) * 0.3} rx={(r ?? 8) * 0.35} ry={(r ?? 8) * 0.22} fill="#7a7090" />
        </g>
      ))}

      {/* Playa y mar */}
      <rect x={400} y={0} width={200} height={360} fill="#f6e2a8" />
      <path d="M470 0 C455 80 500 140 478 220 S500 320 488 360 L600 360 L600 0 Z" fill="#4fb3e8" />
      <path d="M520 70 q12 -8 24 0 M540 180 q12 -8 24 0 M515 290 q12 -8 24 0" stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" />
      <g transform="translate(430 290)">
        <path d="M0 0 q4 -30 -2 -48" stroke="#7a4e2a" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M-2 -48 q-20 -6 -28 6 M-2 -48 q20 -8 28 4 M-2 -48 q-6 -18 -20 -20 M-2 -48 q10 -16 22 -16" stroke="#2e8b4f" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>

      {/* Caminos que cruzan las tres piezas: ayudan a saber qué va al lado de qué */}
      <path d={ROAD_TEAL} stroke={night} strokeWidth={13} fill="none" strokeLinecap="round" opacity={0.18} />
      <path d={ROAD_TEAL} stroke={teal} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={ROAD_YELLOW} stroke={night} strokeWidth={13} fill="none" strokeLinecap="round" opacity={0.18} />
      <path d={ROAD_YELLOW} stroke={yellow} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={ROAD_YELLOW} stroke="#ffffff" strokeWidth={2} fill="none" strokeDasharray="8 10" />
    </g>
  );
}

/** Una pieza del mapa (un tercio). */
export function MapPieceArt({ piece, className }: { piece: MapPieceId; className?: string }) {
  const index = MAP_PIECES.indexOf(piece);
  return (
    <svg
      className={className}
      viewBox={`${index * PIECE_WIDTH} 0 ${PIECE_WIDTH} ${MAP_SIZE.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <EarthMapArt />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Terreno lunar (paso 1)                                              */
/* ------------------------------------------------------------------ */

const MOON_ROCKS = [
  { x: 150, y: 168, r: 13 },
  { x: 215, y: 150, r: 11 },
  { x: 265, y: 182, r: 12 },
];

export function MoonScene({ title, rocksLabel, craterLabel }: { title: string; rocksLabel: string; craterLabel: string }) {
  const { yellow, teal, night } = LUNITA_COLORS;
  const id = useId();
  return (
    <svg className="lunita-scene" viewBox="0 0 400 240" role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>{title}</title>
      <rect width={400} height={240} fill="#0d1530" />
      {[
        [30, 20],
        [90, 45],
        [160, 15],
        [230, 35],
        [300, 18],
        [360, 50],
        [380, 12],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill="#ffffff" opacity={0.85} />
      ))}
      {/* La Tierra a lo lejos */}
      <circle cx={340} cy={38} r={18} fill="#3b7ddd" />
      <path d="M326 30 q8 -6 14 2 q6 8 14 2 M330 46 q8 4 16 -2" stroke="#49a978" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* Suelo lunar */}
      <path d="M0 95 C80 80 160 100 240 88 S360 80 400 92 L400 240 L0 240 Z" fill="#b9bfcc" />
      <ellipse cx={80} cy={210} rx={34} ry={10} fill="#9ea5b5" />
      <ellipse cx={190} cy={110} rx={22} ry={6} fill="#9ea5b5" />
      {/* Cráter de destino */}
      <ellipse cx={335} cy={170} rx={48} ry={20} fill="#8d94a6" stroke="#737a8c" strokeWidth={4} />
      <ellipse cx={335} cy={174} rx={34} ry={11} fill="#7a8194" />
      <text x={335} y={210} textAnchor="middle" className="lunita-scene__label">
        {craterLabel}
      </text>
      {/* Camino punteado de Lunita al cráter */}
      <path d="M58 170 C110 130 180 200 240 160 S300 150 300 165" stroke={yellow} strokeWidth={5} fill="none" strokeDasharray="2 10" strokeLinecap="round" />
      {/* Rocas que debe rodear (marcadas en turquesa) */}
      {MOON_ROCKS.map((rock) => (
        <g key={rock.x}>
          <circle className="lunita-scene__ring" cx={rock.x} cy={rock.y} r={rock.r + 9} fill="none" stroke={teal} strokeWidth={3} strokeDasharray="5 4" />
          <ellipse cx={rock.x} cy={rock.y} rx={rock.r} ry={rock.r * 0.8} fill="#5c6274" />
          <ellipse cx={rock.x - rock.r * 0.3} cy={rock.y - rock.r * 0.3} rx={rock.r * 0.35} ry={rock.r * 0.22} fill="#8a90a2" />
        </g>
      ))}
      <text x={215} y={222} textAnchor="middle" className="lunita-scene__label lunita-scene__label--teal">
        {rocksLabel}
      </text>
      <g transform="translate(46 168)">
        <LunitaShape />
      </g>
      <rect x={0} y={0} width={400} height={240} fill="none" stroke={night} strokeWidth={0} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Campo de práctica en la Tierra (pasos 3 y 4)                         */
/* ------------------------------------------------------------------ */

/** Fondo del campo de rocas: arena, suelo plano, cráter y la meta. Las rocas son las de `ROCKS`. */
export function FieldArt({ goalLabel, blockedRock }: { goalLabel: string; blockedRock: number | null }) {
  const { teal, night } = LUNITA_COLORS;
  return (
    <g>
      <rect width={FIELD.width} height={FIELD.height} fill="#d9b98a" />
      {/* Arena */}
      <path d="M0 0 H150 C120 30 70 40 0 34 Z" fill="#ecd3a3" />
      <path d="M260 260 C280 230 340 228 400 236 V260 Z" fill="#ecd3a3" />
      {/* Suelo plano (donde empieza Lunita) */}
      <ellipse cx={START.x} cy={START.y} rx={34} ry={22} fill="#e6c999" />
      {/* Cráter de práctica junto a la meta */}
      <ellipse cx={372} cy={205} rx={30} ry={16} fill="#b08f66" stroke="#7d6243" strokeWidth={3} />
      <ellipse cx={372} cy={208} rx={20} ry={8} fill="#9c7c55" />
      {/* Meta */}
      <circle cx={GOAL.x} cy={GOAL.y} r={GOAL_RADIUS} fill={teal} fillOpacity={0.18} stroke={teal} strokeWidth={2.5} strokeDasharray="6 5" />
      <line x1={GOAL.x} y1={GOAL.y + 10} x2={GOAL.x} y2={GOAL.y - 20} stroke={night} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M${GOAL.x} ${GOAL.y - 20} l18 6 l-18 6 Z`} fill={teal} stroke={night} strokeWidth={1.5} />
      <text x={GOAL.x} y={GOAL.y + GOAL_RADIUS + 13} textAnchor="middle" className="lunita-field__label">
        {goalLabel}
      </text>
      {/* Rocas */}
      {ROCKS.map((rock, index) => (
        <g key={`${rock.x}-${rock.y}`} className={index === blockedRock ? 'lunita-field__rock is-blocked' : 'lunita-field__rock'}>
          {index === blockedRock ? (
            <circle className="lunita-field__alert" cx={rock.x} cy={rock.y} r={rock.r + 8} fill="none" stroke="#e5484d" strokeWidth={3} />
          ) : null}
          <ellipse cx={rock.x} cy={rock.y + rock.r * 0.15} rx={rock.r} ry={rock.r * 0.85} fill="#4a4058" />
          <ellipse cx={rock.x - rock.r * 0.3} cy={rock.y - rock.r * 0.25} rx={rock.r * 0.38} ry={rock.r * 0.24} fill="#7a7090" />
        </g>
      ))}
    </g>
  );
}
