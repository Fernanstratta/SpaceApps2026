import { useId, useRef, type PointerEvent } from 'react';
import { slopeClass, type ProfilePoint } from '../../utils/terrain';
import { PROFILE_Y_MAX, slopeColor } from './missionTerrain';

interface ProfileChartProps {
  points: ProfilePoint[];
  /** Perfil lunar de referencia, superpuesto con línea discontinua. */
  comparePoints?: ProfilePoint[] | null;
  compareLabel?: string;
  siteLabel: string;
  cursorIndex: number;
  onCursorChange: (index: number) => void;
  /** Índices de los bordes del cráter (se marcan en el eje). */
  rims: { start: number; end: number };
  title: string;
  description: string;
  sliderLabel: string;
  /** Texto que lee el lector de pantalla para la posición del cursor. */
  sliderValueText: string;
  axisDistance: string;
  axisHeight: string;
  exaggerationLabel: (value: string) => string;
  formatNumber: (value: number, digits?: number) => string;
}

const W = 640;
const H = 270;
const PLOT = { left: 52, right: 610, top: 18, bottom: 222 };

/**
 * Perfil de altura a lo largo del tramo. Cada segmento se colorea según su
 * pendiente; todos los sitios usan la misma escala vertical (`PROFILE_Y_MAX`).
 * El cursor se mueve con el puntero o con el control deslizante (teclado).
 */
export function ProfileChart({
  points,
  comparePoints,
  compareLabel,
  siteLabel,
  cursorIndex,
  onCursorChange,
  rims,
  title,
  description,
  sliderLabel,
  sliderValueText,
  axisDistance,
  axisHeight,
  exaggerationLabel,
  formatNumber,
}: ProfileChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const titleId = useId();
  const descId = useId();
  const sliderId = useId();

  const maxDistance = points[points.length - 1]?.distance ?? 1;
  const x = (d: number) => PLOT.left + (d / maxDistance) * (PLOT.right - PLOT.left);
  const y = (h: number) => PLOT.bottom - (h / PROFILE_Y_MAX) * (PLOT.bottom - PLOT.top);
  const exaggeration =
    (PLOT.bottom - PLOT.top) / PROFILE_Y_MAX / ((PLOT.right - PLOT.left) / maxDistance);

  const cursor = points[cursorIndex] ?? points[0];
  const yStep = PROFILE_Y_MAX > 300 ? 100 : 50;
  const yTicks = Array.from({ length: Math.floor(PROFILE_Y_MAX / yStep) + 1 }, (_, i) => i * yStep);
  const xTicks = Array.from({ length: Math.floor(maxDistance / 500) + 1 }, (_, i) => i * 500);

  const indexFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const svgX = ((event.clientX - box.left) / box.width) * W;
    const ratio = (svgX - PLOT.left) / (PLOT.right - PLOT.left);
    const index = Math.round(Math.min(1, Math.max(0, ratio)) * (points.length - 1));
    if (index !== cursorIndex) onCursorChange(index);
  };

  return (
    <figure className="profile-chart">
      <svg
        ref={svgRef}
        className="profile-chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          indexFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons > 0 || event.pointerType === 'mouse') indexFromPointer(event);
        }}
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{description}</desc>

        {/* Cuadrícula y ejes */}
        {yTicks.map((tick) => (
          <g key={`y${tick}`} className="profile-chart__grid">
            <line x1={PLOT.left} x2={PLOT.right} y1={y(tick)} y2={y(tick)} />
            <text x={PLOT.left - 8} y={y(tick) + 4} textAnchor="end">
              {formatNumber(tick)}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <text key={`x${tick}`} className="profile-chart__tick" x={x(tick)} y={PLOT.bottom + 18} textAnchor="middle">
            {formatNumber(tick)}
          </text>
        ))}
        <text className="profile-chart__axis" x={(PLOT.left + PLOT.right) / 2} y={H - 4} textAnchor="middle">
          {axisDistance}
        </text>
        <text
          className="profile-chart__axis"
          transform={`translate(13 ${(PLOT.top + PLOT.bottom) / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          {axisHeight}
        </text>

        {/* Bordes del cráter */}
        {[rims.start, rims.end].map((index) => (
          <line
            key={`rim${index}`}
            className="profile-chart__rim"
            x1={x(points[index]?.distance ?? 0)}
            x2={x(points[index]?.distance ?? 0)}
            y1={PLOT.top}
            y2={PLOT.bottom}
          />
        ))}

        {/* Perfil lunar de referencia */}
        {comparePoints ? (
          <polyline
            className="profile-chart__compare"
            points={comparePoints.map((p) => `${x(p.distance)},${y(p.height)}`).join(' ')}
          />
        ) : null}

        {/* Perfil del sitio, segmento a segmento según la pendiente */}
        {points.slice(1).map((point, i) => {
          const previous = points[i];
          if (!previous) return null;
          return (
            <line
              key={point.distance}
              x1={x(previous.distance)}
              y1={y(previous.height)}
              x2={x(point.distance)}
              y2={y(point.height)}
              stroke={slopeColor(slopeClass(point.slope))}
              className="profile-chart__segment"
            />
          );
        })}

        {/* Cursor */}
        {cursor ? (
          <g className="profile-chart__cursor">
            <line x1={x(cursor.distance)} x2={x(cursor.distance)} y1={PLOT.top} y2={PLOT.bottom} />
            <circle cx={x(cursor.distance)} cy={y(cursor.height)} r={6} />
          </g>
        ) : null}

        <text className="profile-chart__legend-text" x={PLOT.right} y={PLOT.top + 2} textAnchor="end">
          {siteLabel}
          {comparePoints && compareLabel ? ` · - - ${compareLabel}` : ''}
        </text>
      </svg>

      <label className="visually-hidden" htmlFor={sliderId}>
        {sliderLabel}
      </label>
      <input
        id={sliderId}
        type="range"
        className="profile-chart__slider"
        min={0}
        max={points.length - 1}
        step={1}
        value={cursorIndex}
        aria-valuetext={sliderValueText}
        onChange={(event) => onCursorChange(Number(event.target.value))}
      />
      <figcaption className="profile-chart__caption">{exaggerationLabel(formatNumber(exaggeration, 1))}</figcaption>
    </figure>
  );
}
