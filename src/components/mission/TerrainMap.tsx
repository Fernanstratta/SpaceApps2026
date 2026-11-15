import { useEffect, useRef } from 'react';
import type { MissionSite } from '../../data/missions/roverMission';
import { slopeClass, type TransectDirection } from '../../utils/terrain';
import { getSiteTerrain, SLOPE_COLORS } from './missionTerrain';

interface TerrainMapProps {
  site: MissionSite;
  showSlope: boolean;
  showTransect: boolean;
  direction: TransectDirection;
  cursorIndex: number;
  /** Descripción accesible del mapa. */
  label: string;
  northLabel: string;
  scaleLabel: string;
  rimIndices: { start: number; end: number };
}

/** Lado del canvas en píxeles (la malla de 41 puntos se amplía con suavizado). */
const CANVAS_PX = 410;

/**
 * Mapa de relieve calculado del DEM (no es una foto): relieve sombreado con
 * tono arena (Tierra) o gris (Luna) y, si se activa, la capa de pendiente.
 * Encima, en SVG, el tramo del rover, el cursor, el norte y la escala.
 */
export function TerrainMap({
  site,
  showSlope,
  showTransect,
  direction,
  cursorIndex,
  label,
  northLabel,
  scaleLabel,
  rimIndices,
}: TerrainMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { size, step } = site.grid;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const { shade, slopes } = getSiteTerrain(site.id);

    const small = document.createElement('canvas');
    small.width = size;
    small.height = size;
    const smallContext = small.getContext('2d');
    if (!smallContext) return;
    const image = smallContext.createImageData(size, size);
    const tint = site.body === 'earth' ? [218, 190, 150] : [200, 200, 205];

    for (let i = 0; i < size * size; i += 1) {
      const light = 0.25 + 0.75 * (shade[i] ?? 0);
      let r = (tint[0] ?? 0) * light;
      let g = (tint[1] ?? 0) * light;
      let b = (tint[2] ?? 0) * light;
      if (showSlope) {
        const [sr, sg, sb] = SLOPE_COLORS[slopeClass(slopes[i] ?? 0)];
        const alpha = 0.62;
        r = r * (1 - alpha) + sr * alpha;
        g = g * (1 - alpha) + sg * alpha;
        b = b * (1 - alpha) + sb * alpha;
      }
      image.data.set([r, g, b, 255], i * 4);
    }
    smallContext.putImageData(image, 0, 0);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(small, 0, 0, CANVAS_PX, CANVAS_PX);
  }, [site, size, showSlope]);

  // Coordenadas del SVG = coordenadas de la malla (centro del punto i en i + 0,5).
  const middle = (size - 1) / 2 + 0.5;
  const along = cursorIndex + 0.5;
  const cursor = direction === 'west-east' ? { x: along, y: middle } : { x: middle, y: along };
  const line =
    direction === 'west-east'
      ? { x1: 0.5, y1: middle, x2: size - 0.5, y2: middle }
      : { x1: middle, y1: 0.5, x2: middle, y2: size - 0.5 };
  const rimPoint = (index: number) =>
    direction === 'west-east' ? { x: index + 0.5, y: middle } : { x: middle, y: index + 0.5 };
  const kmInCells = 1000 / step;

  return (
    <div className="terrain-map">
      <canvas ref={canvasRef} width={CANVAS_PX} height={CANVAS_PX} className="terrain-map__canvas" role="img" aria-label={label} />
      <svg className="terrain-map__overlay" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {showTransect ? (
          <>
            <line {...line} className="terrain-map__transect" />
            {[rimIndices.start, rimIndices.end].map((index) => (
              <circle key={index} r={0.55} cx={rimPoint(index).x} cy={rimPoint(index).y} className="terrain-map__rim" />
            ))}
            <circle cx={cursor.x} cy={cursor.y} r={0.95} className="terrain-map__cursor" />
            <text x={line.x1 + 0.6} y={line.y1 + (direction === 'west-east' ? -1 : 2.2)} className="terrain-map__end">
              A
            </text>
            <text
              x={line.x2 - (direction === 'west-east' ? 1.8 : -0.6)}
              y={line.y2 + (direction === 'west-east' ? -1 : -0.6)}
              className="terrain-map__end"
            >
              B
            </text>
          </>
        ) : null}
        <g className="terrain-map__north" transform={`translate(${size - 3} 3.2)`}>
          <path d="M0 -2.2 L1.1 1 L0 0.4 L-1.1 1 Z" />
          <text y={3} textAnchor="middle">
            {northLabel}
          </text>
        </g>
        <g className="terrain-map__scale" transform={`translate(1.5 ${size - 1.8})`}>
          <rect width={kmInCells} height={0.55} />
          <text x={kmInCells / 2} y={-0.8} textAnchor="middle">
            {scaleLabel}
          </text>
        </g>
      </svg>
    </div>
  );
}
