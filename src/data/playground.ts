import { ROUTES } from '../router/routes';
import { type AxisId, isAxisId } from '../types/Axis';
import { type AnalogPair, type AnalogyType, getLunarAnalogCatalog, isPairId, type PairId, type PhotoCredit } from './lunarAnalogs';

export type PlaygroundPhoto = PhotoCredit;

/** Un área del Playground: un par del catálogo ILS, visto desde su sitio terrestre. */
export interface PlaygroundArea {
  id: PairId;
  /** Número fijo del área (1…n, orden del catálogo): se muestra en el mapa y en el selector. */
  number: number;
  analogOf: 'moon';
  analogyType: AnalogyType;
  /** ILS del par (0–100), tal como lo envía el backend. `null` si el par no tiene ejes comparables. */
  similarity: number | null;
  /** Centro del sitio terrestre (grados decimales). */
  lat: number;
  lon: number;
  zoom: number;
  /** Radio del área de análisis terrestre, en metros. */
  radiusM: number;
  /** La coordenada terrestre todavía es provisional (`coordinate_status` del backend). */
  approximate: boolean;
  pair: AnalogPair;
}

export const PLAYGROUND_AREAS: readonly PlaygroundArea[] = getLunarAnalogCatalog().pairs.map((pair) => ({
  id: pair.id,
  number: pair.number,
  analogOf: 'moon',
  analogyType: pair.analogyType,
  similarity: pair.data.ils.value,
  lat: pair.data.earth_site.lat,
  lon: pair.data.earth_site.lon,
  zoom: pair.zoom,
  radiusM: pair.data.earth_site.aoi.radius_m,
  approximate: pair.data.earth_site.coordinate_status === 'provisional',
  pair,
}));

/* ------------------------------------------------------------------ */
/* Enlaces al Playground con un par y un eje ya elegidos               */
/* ------------------------------------------------------------------ */

export interface PlaygroundTarget {
  pair: PairId | null;
  axis: AxisId | null;
}

/**
 * Ruta del Playground con un par y un eje seleccionados. Va en el `#` de la
 * URL (`/playground#par=laguna_salada_tranquillitatis&eje=slope`) para que el
 * enlace se pueda compartir sin cambiar el router.
 */
export function playgroundLink(target: Partial<PlaygroundTarget> = {}): string {
  const params = new URLSearchParams();
  if (target.pair) params.set('par', target.pair);
  if (target.axis) params.set('eje', target.axis);
  const hash = params.toString();
  return hash ? `${ROUTES.playground}#${hash}` : ROUTES.playground;
}

/** Lee el par y el eje del `#` de la URL; ignora valores desconocidos. */
export function readPlaygroundTarget(hash: string): PlaygroundTarget {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const pair = params.get('par');
  const axis = params.get('eje');
  return { pair: isPairId(pair) ? pair : null, axis: isAxisId(axis) ? axis : null };
}
