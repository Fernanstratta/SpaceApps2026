import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import type { PlaygroundArea } from '../../data/playground';
import { useMessages } from '../../i18n/I18nContext';

export interface PlaygroundMapProps {
  areas: readonly PlaygroundArea[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Nombre accesible de cada marcador («Área 1: Cráter El Elegante»). */
  markerLabels: string[];
  /** Cambia (se incrementa) cada vez que se pide ver todas las áreas. */
  overview: number;
}

/** Marcador numerado (HTML) para que se lea a cualquier zoom y tenga foco visible. */
function markerIcon(n: number, area: PlaygroundArea, active: boolean): L.DivIcon {
  return L.divIcon({
    className: `pg-marker pg-marker--${area.analogOf}${active ? ' is-active' : ''}`,
    html: `<span class="pg-marker__dot">${n}</span>`,
    iconSize: active ? [44, 44] : [34, 34],
    iconAnchor: active ? [22, 22] : [17, 17],
  });
}

/**
 * Leaflet calcula su tamaño al crearse; si la columna cambia de alto o ancho
 * (al cargar el panel o girar el móvil) hay que avisarle para que el centro
 * siga siendo el centro real.
 */
function KeepSize() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

/** Encuadra todas las áreas cuando cambia `overview` (botón «Ver todas las áreas»). */
function FitAll({ areas, overview }: { areas: readonly PlaygroundArea[]; overview: number }) {
  const map = useMap();
  useEffect(() => {
    if (overview === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    map.flyToBounds(
      areas.map((a) => [a.lat, a.lon] as [number, number]),
      { padding: [48, 48], duration: reduce ? 0 : 1.2, animate: !reduce },
    );
  }, [map, areas, overview]);
  return null;
}

/** Centra el mapa en el área activa (con animación si no se pidió menos movimiento). */
function FlyToActive({ area }: { area: PlaygroundArea }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (first.current || reduce) {
      map.setView([area.lat, area.lon], area.zoom, { animate: false });
      first.current = false;
    } else {
      map.flyTo([area.lat, area.lon], area.zoom, { duration: 1.2 });
    }
  }, [map, area]);
  return null;
}

/**
 * Mapa del Playground: Leaflet + OpenStreetMap (el mismo proveedor que el
 * mapa de ubicaciones del proyecto). Un marcador por área; al pulsarlo
 * (clic, toque o Enter con el teclado) se selecciona esa área.
 */
export default function PlaygroundMap({ areas, activeIndex, onSelect, markerLabels, overview }: PlaygroundMapProps) {
  const { LOCATION_TEXT } = useMessages();
  const active = areas[activeIndex] ?? areas[0];
  const markerRefs = useRef<(L.Marker | null)[]>([]);
  const icons = useMemo(
    () => areas.map((area, i) => markerIcon(i + 1, area, i === activeIndex)),
    [areas, activeIndex],
  );

  // Nombre accesible y estado de cada marcador (Leaflet ya los hace enfocables con role="button").
  // Se aplica al añadirse el marcador y cada vez que cambia su icono (Leaflet recrea el elemento).
  const describe = (i: number) => {
    const el = markerRefs.current[i]?.getElement();
    if (!el) return;
    el.setAttribute('aria-label', markerLabels[i] ?? '');
    el.setAttribute('aria-pressed', String(i === activeIndex));
    el.removeAttribute('title');
  };
  useEffect(() => {
    markerRefs.current.forEach((_, i) => describe(i));
  });

  if (!active) return null;

  return (
    <MapContainer
      className="pg-map__canvas"
      center={[active.lat, active.lon]}
      zoom={active.zoom}
      scrollWheelZoom={false}
      worldCopyJump
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={LOCATION_TEXT.osmAttribution}
        maxZoom={19}
      />
      <KeepSize />
      <FlyToActive area={active} />
      <FitAll areas={areas} overview={overview} />
      {areas.map((area, i) => (
        <Marker
          key={area.id}
          ref={(marker) => {
            markerRefs.current[i] = marker;
          }}
          position={[area.lat, area.lon]}
          icon={icons[i]!}
          keyboard
          zIndexOffset={i === activeIndex ? 1000 : 0}
          eventHandlers={{
            add: () => describe(i),
            click: () => onSelect(i),
            keypress: (event) => {
              const key = (event.originalEvent as KeyboardEvent).key;
              if (key === 'Enter' || key === ' ') onSelect(i);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
