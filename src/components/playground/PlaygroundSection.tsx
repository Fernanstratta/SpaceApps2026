import { lazy, Suspense, useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { AXIS_IDS, type AxisId, type PairId } from '../../data/lunarAnalogs';
import { PLAYGROUND_AREAS } from '../../data/playground';
import { useI18n } from '../../i18n/I18nContext';
import { PLAYGROUND_TEXT } from '../../i18n/playground';
import {
  clampSimilarity,
  filterAreas,
  hasActiveFilters,
  hasSimilarityData,
  NO_FILTERS,
  type PlaygroundFilters,
  SIMILARITY_MAX,
  SIMILARITY_MIN,
  SIMILARITY_STEP,
  toggleAxis,
} from '../../utils/playgroundFilters';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { PhotoCarousel } from './PhotoCarousel';

// Leaflet y three se cargan aparte: no retrasan el resto de Inicio.
const PlaygroundMap = lazy(() => import('./PlaygroundMap'));
const Terrain3D = lazy(() => import('./Terrain3D'));

type ViewMode = 'photos' | '3d';

/**
 * Starman Playground: consola de exploración de análogos terrestres de la
 * Luna. Arriba, los filtros opcionales (ejes comparativos y similitud
 * mínima); abajo, el mapa y el panel del área activa. El área se elige
 * haciendo clic en su número (en el panel o en el mapa).
 *  - Escritorio: mapa a la izquierda, panel a la derecha.
 *  - Móvil: filtros, mapa y, debajo, el panel.
 */
export function PlaygroundSection() {
  const { language } = useI18n();
  const t = PLAYGROUND_TEXT[language];
  const [activeId, setActiveId] = useState<PairId>(PLAYGROUND_AREAS[0]!.id);
  const [filters, setFilters] = useState<PlaygroundFilters>(NO_FILTERS);
  const [mode, setMode] = useState<ViewMode>('photos');
  const [overview, setOverview] = useState(0);
  const similarityId = useId();
  const similarityNoteId = useId();
  const axesHintId = useId();
  const pickerLabelId = useId();

  const total = PLAYGROUND_AREAS.length;
  const visible = useMemo(() => filterAreas(PLAYGROUND_AREAS, filters), [filters]);
  // Si el filtro oculta el área activa, se muestra la primera visible.
  const area = visible.find((a) => a.id === activeId) ?? visible[0] ?? null;
  // …y esa pasa a ser la selección, para que al quitar el filtro no salte a otra.
  useEffect(() => {
    if (area && area.id !== activeId) setActiveId(area.id);
  }, [area, activeId]);
  const similarityReady = hasSimilarityData(PLAYGROUND_AREAS);
  const filtered = hasActiveFilters(filters);

  const markerLabels = useMemo(() => visible.map((a) => t.marker(a.number, t.pairs[a.id].earth.name)), [t, visible]);

  const toggle = (axis: AxisId) => setFilters((f) => ({ ...f, axes: toggleAxis(f.axes, axis, AXIS_IDS) }));
  const clearAxes = () => setFilters((f) => ({ ...f, axes: [] }));
  const clearAll = () => setFilters(NO_FILTERS);
  const setSimilarity = (value: number) => setFilters((f) => ({ ...f, minSimilarity: clampSimilarity(value) }));

  const filterBar = (
    <section className="pg-filters" aria-label={t.filters.panelLabel}>
      <div className="pg-filters__head">
        <p className="pg-filters__count" aria-live="polite">
          {t.filters.comparisons(visible.length, total)}
        </p>
        <button type="button" className="pg-map__all pg-filters__clear" onClick={clearAll} disabled={!filtered}>
          {t.filters.clear}
        </button>
      </div>

      <fieldset className="pg-axes" aria-describedby={axesHintId}>
        <legend className="pg-slider__label">{t.filters.axesLegend}</legend>
        <p id={axesHintId} className="pg-filters__hint">
          {t.filters.axesHint}
        </p>
        <ul className="pg-chips">
          <li>
            <button type="button" className="pg-chip pg-chip--all" aria-pressed={filters.axes.length === 0} onClick={clearAxes}>
              {t.filters.allAxes}
            </button>
          </li>
          {AXIS_IDS.map((axis, index) => (
            <li key={axis}>
              <button type="button" className="pg-chip" aria-pressed={filters.axes.includes(axis)} onClick={() => toggle(axis)}>
                <span className="pg-chip__number" aria-hidden="true">
                  {index + 1}
                </span>
                {t.axes[axis].name}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="pg-slider pg-similarity">
        <div className="pg-slider__head">
          <label htmlFor={similarityId} className="pg-slider__label">
            {t.filters.similarity}
          </label>
          <output htmlFor={similarityId} className="pg-slider__counter">
            {t.filters.similarityValue(filters.minSimilarity)}
          </output>
        </div>
        <input
          id={similarityId}
          type="range"
          className="pg-slider__input"
          min={SIMILARITY_MIN}
          max={SIMILARITY_MAX}
          step={SIMILARITY_STEP}
          value={filters.minSimilarity}
          onChange={(event) => setSimilarity(Number(event.target.value))}
          aria-valuetext={t.filters.similarityValueText(filters.minSimilarity)}
          aria-describedby={similarityReady ? undefined : similarityNoteId}
          style={{ '--pg-progress': `${filters.minSimilarity}%` } as CSSProperties}
        />
        <ol className="pg-slider__ticks" aria-hidden="true">
          {t.filters.similarityScale.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ol>
        {similarityReady ? null : (
          <p id={similarityNoteId} className="pg-filters__note">
            {t.filters.similarityPending}
          </p>
        )}
      </div>
    </section>
  );

  if (!area) {
    return (
      <section className="playground" aria-labelledby="playground-title">
        <div className="container">
          <div className="pg-console">
            <Head title={t.title} lead={t.lead} />
            {filterBar}
            <div className="pg-empty" role="status">
              <p className="pg-empty__title">{t.filters.noMatches}</p>
              <p>{t.filters.noMatchesHint}</p>
              <button type="button" className="pg-map__all" onClick={clearAll}>
                {t.filters.clear}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pair = t.pairs[area.id];
  const text = pair.earth;
  const has3d = area.terrainSiteId !== null;
  const view: ViewMode = has3d ? mode : 'photos';

  return (
    <section className="playground" aria-labelledby="playground-title">
      <div className="container">
        <div className="pg-console">
          <Head title={t.title} lead={t.lead} />
          {filterBar}

          <div className="pg-console__grid">
            {/* Columna izquierda: mapa interactivo (solo las áreas visibles) */}
            <div className="pg-map" role="region" aria-label={t.mapLabel}>
              <ErrorBoundary fallbackMessage={t.mapError}>
                <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
                  <PlaygroundMap
                    areas={visible}
                    activeId={area.id}
                    onSelect={setActiveId}
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

              {/* 2. Selector de área: un número por área visible */}
              <div className="pg-picker">
                <div className="pg-slider__head">
                  <span id={pickerLabelId} className="pg-slider__label">
                    {t.areaPicker}
                  </span>
                  <span className="pg-slider__counter" aria-hidden="true">
                    {t.counter(area.number, total)}
                  </span>
                </div>
                <ul className="pg-picker__list" role="group" aria-labelledby={pickerLabelId}>
                  {visible.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        className="pg-picker__number"
                        aria-pressed={a.id === area.id}
                        aria-label={t.marker(a.number, t.pairs[a.id].earth.name)}
                        title={t.pairs[a.id].earth.name}
                        onClick={() => setActiveId(a.id)}
                      >
                        {a.number}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="pg-picker__hint">{t.areaPickerHint}</p>
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
                <li>
                  <span className="pg-bullets__label">{t.areaAxes}</span>
                  <ul className="pg-axis-tags">
                    {area.axes.map((axis) => (
                      <li key={axis} className={filters.axes.includes(axis) ? 'is-selected' : undefined}>
                        {t.axes[axis].name}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Head({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="pg-console__head">
      <h1 id="playground-title" className="pg-console__title">
        {title}
      </h1>
      <p className="pg-console__lead">{lead}</p>
    </header>
  );
}
