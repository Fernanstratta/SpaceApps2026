import { lazy, Suspense, useId, useMemo, useState, type CSSProperties } from 'react';
import { PLAYGROUND_AREAS } from '../../data/playground';
import { useI18n } from '../../i18n/I18nContext';
import { PLAYGROUND_TEXT } from '../../i18n/playground';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { PhotoCarousel } from './PhotoCarousel';

// Leaflet y three se cargan aparte: no retrasan el resto de Inicio.
const PlaygroundMap = lazy(() => import('./PlaygroundMap'));
const Terrain3D = lazy(() => import('./Terrain3D'));

type ViewMode = 'photos' | '3d';

/**
 * Starman Playground: consola de exploración de análogos terrestres de la
 * Luna y de Marte. Una sola área activa sincroniza el mapa, el slider, el
 * visor, el título y las viñetas.
 *  - Escritorio: mapa a la izquierda, panel a la derecha.
 *  - Móvil: primero el mapa, debajo el panel.
 */
export function PlaygroundSection() {
  const { language } = useI18n();
  const t = PLAYGROUND_TEXT[language];
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<ViewMode>('photos');
  const [overview, setOverview] = useState(0);
  const sliderId = useId();
  const total = PLAYGROUND_AREAS.length;
  const area = PLAYGROUND_AREAS[active] ?? PLAYGROUND_AREAS[0]!;
  const pair = t.pairs[area.id];
  const text = pair.earth;
  const has3d = area.terrainSiteId !== null;
  const view: ViewMode = has3d ? mode : 'photos';

  const markerLabels = useMemo(
    () => PLAYGROUND_AREAS.map((a, i) => t.marker(i + 1, t.pairs[a.id].earth.name)),
    [t],
  );


  const select = (index: number) => {
    setActive(Math.min(total - 1, Math.max(0, index)));
  };

  return (
    <section className="playground" aria-labelledby="playground-title">
      <div className="container">
        <div className="pg-console">
          <header className="pg-console__head">
            <h1 id="playground-title" className="pg-console__title">
              {t.title}
            </h1>
            <p className="pg-console__lead">{t.lead}</p>
          </header>

          <div className="pg-console__grid">
            {/* Columna izquierda: mapa interactivo */}
            <div className="pg-map" role="region" aria-label={t.mapLabel}>
              <ErrorBoundary fallbackMessage={t.mapError}>
                <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
                  <PlaygroundMap
                    areas={PLAYGROUND_AREAS}
                    activeIndex={active}
                    onSelect={select}
                    markerLabels={markerLabels}
                    overview={overview}
                  />
                </Suspense>
              </ErrorBoundary>
              <div className="pg-map__bar">
                <p className="pg-map__hint">{t.mapHint}</p>
                <button type="button" className="pg-map__all" onClick={() => setOverview((n) => n + 1)}>
                  {t.showAll}
                </button>
              </div>
            </div>

            {/* Columna derecha: exploración del área (se lee de arriba abajo) */}
            <div className="pg-panel">
              {/* 1. Visor: fotos o vista 3D */}
              <div className="pg-viewer">
                {has3d ? (
                  <div className="pg-tabs" role="group" aria-label={t.viewer}>
                    <button type="button" className="pg-tab" aria-pressed={view === 'photos'} onClick={() => setMode('photos')}>
                      {t.earthTab}
                    </button>
                    <button type="button" className="pg-tab" aria-pressed={view === '3d'} onClick={() => setMode('3d')}>
                      {t.view3dTab}
                    </button>
                  </div>
                ) : null}
                {view === '3d' && area.terrainSiteId ? (
                  <ErrorBoundary fallbackMessage={t.model3dError}>
                    <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
                      <Terrain3D
                        key={area.terrainSiteId}
                        siteId={area.terrainSiteId}
                        label={t.model3dLabel(text.name)}
                        hint={t.model3dHint}
                        rotateLeftLabel={t.rotateLeft}
                        rotateRightLabel={t.rotateRight}
                        errorText={t.model3dError}
                      />
                    </Suspense>
                  </ErrorBoundary>
                ) : (
                  <PhotoCarousel
                    key={area.id}
                    photos={area.photos}
                    texts={text.photos}
                    labels={{
                      prev: t.prevPhoto,
                      next: t.nextPhoto,
                      counter: t.photoCounter,
                      error: t.photoError,
                      empty: t.noPhotos,
                      region: `${t.earthTab}: ${text.name}`,
                    }}
                  />
                )}
              </div>

              {/* 2. Slider: una posición por área */}
              <div className="pg-slider">
                <div className="pg-slider__head">
                  <label htmlFor={sliderId} className="pg-slider__label">
                    {t.slider}
                  </label>
                  <span className="pg-slider__counter" aria-hidden="true">
                    {t.counter(active + 1, total)}
                  </span>
                </div>
                <input
                  id={sliderId}
                  type="range"
                  className="pg-slider__input"
                  min={0}
                  max={total - 1}
                  step={1}
                  value={active}
                  onChange={(event) => select(Number(event.target.value))}
                  aria-valuetext={`${t.counter(active + 1, total)}: ${text.name}`}
                  style={{ '--pg-progress': `${(active / Math.max(1, total - 1)) * 100}%` } as CSSProperties}
                />
                <ol className="pg-slider__ticks" aria-hidden="true">
                  {PLAYGROUND_AREAS.map((a, i) => (
                    <li key={a.id} className={i === active ? 'is-active' : ''}>
                      {i + 1}
                    </li>
                  ))}
                </ol>
              </div>

              {/* 3. Título del área */}
              <div className="pg-area" aria-live="polite">
                <p className={`pg-area__badge pg-area__badge--${area.analogOf}`}>{t.analogyTypes[area.analogyType]}</p>
                <h3 className="pg-area__title">{text.name}</h3>
                <p className="pg-area__place">
                  {text.region}
                  {area.approximate ? ` · ${t.sheet.provisional}` : null}
                </p>
              </div>

              {/* 4. Descripción con viñetas */}
              <ul className="pg-bullets">
                <li>
                  <span className="pg-bullets__label">{t.sheet.type}</span>
                  <span>{text.type}</span>
                </li>
                <li>
                  <span className="pg-bullets__label">{t.sheet.area}</span>
                  <span>{text.area}</span>
                </li>
                {text.keyData ? (
                  <li>
                    <span className="pg-bullets__label">{t.sheet.keyData}</span>
                    <span>{text.keyData}</span>
                  </li>
                ) : null}
                <li>
                  <span className="pg-bullets__label">{t.sections.similar}</span>
                  <span>
                    {pair.moon.name}: {pair.similar}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
