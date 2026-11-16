import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { getPairLabels } from '../../data/analogText';
import { type AxisId, type Body, getLunarAnalogCatalog, type PairId, pairAxis } from '../../data/lunarAnalogs';
import type { MissionSiteId } from '../../data/missions/roverMission';
import { getMissionSite } from '../../data/missions/roverMission';
import { PLAYGROUND_AREAS, playgroundLink, readPlaygroundTarget } from '../../data/playground';
import { useI18n } from '../../i18n/I18nContext';
import {
  clampSimilarity,
  filterAreas,
  hasActiveFilters,
  NO_FILTERS,
  type PlaygroundFilters,
  SIMILARITY_MAX,
  SIMILARITY_MIN,
  SIMILARITY_STEP,
} from '../../utils/playgroundFilters';
import { AxisCard } from '../analogs/AxisCard';
import { IlsSummary } from '../analogs/IlsSummary';
import { SimilarityBars } from '../analogs/SimilarityBars';
import { useAnalogText } from '../analogs/useAnalogText';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { InfoTip } from '../common/InfoTip';
import { PhotoCarousel } from './PhotoCarousel';
import { AnalogyPanel, AxisExplorer, LimitationsPanel, MethodPanel, PanelHeading, SourcesPanel } from './PlaygroundPanels';
import { SitePanel } from './SitePanel';

const PlaygroundMap = lazy(() => import('./PlaygroundMap'));
const Terrain3D = lazy(() => import('./Terrain3D'));

/** Exageración vertical de `Terrain3D` (se indica en el texto de ayuda). */
const TERRAIN_EXAGGERATION = 2;

/**
 * Relieves del proyecto que coinciden con un sitio del catálogo. Solo El
 * Elegante tiene hoy un modelo de elevación (`rover-terrain.generated.json`);
 * los demás sitios se muestran con fotos.
 */
const TERRAIN_BY_SITE: Partial<Record<string, MissionSiteId>> = { el_elegante: 'el-elegante' };

type ViewMode = Body | '3d';

/**
 * Terranauta Playground: el entorno de exploración de los cinco pares del ILS.
 * Todo valor, similitud e ILS viene del backend (`data/lunarAnalogs.ts`);
 * aquí solo se elige qué mostrar. Para cada par responde: qué se mide, cuánto
 * vale en la Tierra y en la Luna, qué tan parecidos son, qué tan confiable es
 * el dato, por qué se comparan y dónde se rompe la analogía.
 *
 * El par y el eje elegidos se guardan en el `#` de la URL, así que las
 * lecciones del Portal pueden enlazar a una comparación concreta.
 */
export function PlaygroundSection() {
  const { language } = useI18n();
  const { t, number, locale } = useAnalogText();
  const catalog = getLunarAnalogCatalog();
  const total = PLAYGROUND_AREAS.length;

  const [filters, setFilters] = useState<PlaygroundFilters>(NO_FILTERS);
  const [activeId, setActiveId] = useState<PairId>(PLAYGROUND_AREAS[0]!.id);
  const [axisId, setAxisId] = useState<AxisId>('slope');
  const [mode, setMode] = useState<ViewMode>('earth');
  const [overview, setOverview] = useState(0);
  const similarityId = useId();
  const pickerLabelId = useId();

  // Par y eje del enlace (`#par=…&eje=…`), al abrir la página y si cambia el `#`.
  useEffect(() => {
    const apply = () => {
      const target = readPlaygroundTarget(window.location.hash);
      if (target.pair) setActiveId(target.pair);
      if (target.axis) setAxisId(target.axis);
      if (target.pair || target.axis) window.scrollTo(0, 0);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  // La URL refleja la selección (sin añadir entradas al historial).
  useEffect(() => {
    const hash = playgroundLink({ pair: activeId, axis: axisId }).split('#')[1] ?? '';
    if (window.location.hash.slice(1) !== hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${hash}`);
  }, [activeId, axisId]);

  const visible = useMemo(() => filterAreas(PLAYGROUND_AREAS, filters), [filters]);
  const area = visible.find((item) => item.id === activeId) ?? visible[0] ?? null;
  const filtered = hasActiveFilters(filters);

  const select = useCallback((id: PairId) => {
    setActiveId(id);
    setMode('earth');
  }, []);

  const selectAxis = useCallback((id: string) => {
    const axis = id as AxisId;
    setAxisId(axis);
    document.getElementById(`eje-${axis}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const markerLabels = visible.map((item) => t.marker(item.number, getPairLabels(item.pair, language).earth.name));

  const filterBar = (
    <section className="pg-filters" aria-label={t.filters.panelLabel}>
      <div className="pg-filters__head">
        <p className="pg-filters__count" aria-live="polite">
          {t.filters.comparisons(visible.length, total)}
        </p>
        <button type="button" className="pg-map__all pg-filters__clear" onClick={() => setFilters(NO_FILTERS)} disabled={!filtered}>
          {t.filters.clear}
        </button>
      </div>
      <div className="pg-slider pg-similarity">
        <div className="pg-slider__head">
          <span className="pg-slider__label">
            <label htmlFor={similarityId}>{t.filters.similarity}</label>
            <InfoTip label={t.ils.tooltipLabel} text={t.ils.tooltip} />
          </span>
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
          onChange={(event) => setFilters({ minSimilarity: clampSimilarity(Number(event.target.value)) })}
          aria-valuetext={t.filters.similarityValueText(filters.minSimilarity)}
          style={{ '--pg-progress': `${filters.minSimilarity}%` } as CSSProperties}
        />
        <div className="pg-slider__scale" aria-hidden="true">
          {t.filters.similarityScale.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <p className="pg-filters__note">{t.ils.notRanking}</p>
      </div>
    </section>
  );

  if (!area) {
    return (
      <section className="playground" aria-labelledby="playground-title">
        <div className="container">
          <div className="pg-console">
            <Head title={t.title} lead={t.lead} scope={t.scope} />
            {filterBar}
            <div className="pg-empty" role="status">
              <p className="pg-empty__title">{t.filters.noMatches}</p>
              <p>{t.filters.noMatchesHint}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pair = area.pair;
  const labels = getPairLabels(pair, language);
  const terrainSite = TERRAIN_BY_SITE[pair.data.earth_site.site_id] ?? null;
  const view: ViewMode = mode === '3d' && !terrainSite ? 'earth' : mode;
  const photoTexts = t.pairs[pair.id].photos;
  const terrainWidthKm = terrainSite ? number(((getMissionSite(terrainSite).grid.size - 1) * getMissionSite(terrainSite).grid.step) / 1000, 1) : '';

  return (
    <section className="playground" aria-labelledby="playground-title">
      <div className="container">
        <div className="pg-console">
          <Head title={t.title} lead={t.lead} scope={t.scope} />
          {filterBar}

          {/* Los cinco pares, con su ILS: también es el selector */}
          <div className="pg-pairs">
            <p id={pickerLabelId} className="pg-slider__label">
              {t.areaPicker}
            </p>
            <ul className="pg-pairs__list" aria-labelledby={pickerLabelId}>
              {visible.map((item) => {
                const itemLabels = getPairLabels(item.pair, language);
                return (
                  <li key={item.id}>
                    <button type="button" className="pg-pair" aria-pressed={item.id === area.id} onClick={() => select(item.id)}>
                      <span className="pg-pair__number" aria-hidden="true">
                        {item.number}
                      </span>
                      <span className="pg-pair__type">{t.analogyTypes[item.analogyType]}</span>
                      <span className="pg-pair__name">{itemLabels.short}</span>
                      <IlsSummary pair={item.pair} compact showDisclaimer={false} showInfo={false} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="pg-picker__hint">{t.areaPickerHint}</p>
          </div>

          <div className="pg-console__grid">
            {/* Mapa de los sitios terrestres con su área de análisis */}
            <div className="pg-map" role="region" aria-label={t.mapLabel}>
              <ErrorBoundary fallbackMessage={t.mapError}>
                <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
                  <PlaygroundMap areas={visible} activeId={area.id} onSelect={select} markerLabels={markerLabels} overview={overview} />
                </Suspense>
              </ErrorBoundary>
              <div className="pg-map__bar">
                <p className="pg-map__hint">{t.mapHint}</p>
                <button type="button" className="pg-map__all" onClick={() => setOverview((n) => n + 1)}>
                  {t.showAll}
                </button>
              </div>
            </div>

            {/* Visor: Tierra, Luna y relieve 3D */}
            <div className="pg-panel">
              <div className="pg-area" aria-live="polite">
                <p className={`pg-area__badge pg-area__badge--${area.analogOf}`}>{t.analogyTypes[area.analogyType]}</p>
                <h2 className="pg-area__title">{labels.title}</h2>
                <p className="pg-area__place">{t.counter(area.number, total)}</p>
              </div>
              <div className="pg-viewer">
                <div className="pg-tabs" role="group" aria-label={t.viewer}>
                  <button type="button" className="pg-tab" aria-pressed={view === 'earth'} onClick={() => setMode('earth')}>
                    {t.earthTab}
                  </button>
                  <button type="button" className="pg-tab" aria-pressed={view === 'moon'} onClick={() => setMode('moon')}>
                    {t.moonTab}
                  </button>
                  {terrainSite ? (
                    <button type="button" className="pg-tab" aria-pressed={view === '3d'} onClick={() => setMode('3d')}>
                      {t.view3dTab}
                    </button>
                  ) : null}
                </div>
                {view === '3d' && terrainSite ? (
                  <ErrorBoundary fallbackMessage={t.model3d.error}>
                    <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
                      <Terrain3D
                        key={terrainSite}
                        siteId={terrainSite}
                        label={t.model3d.label(labels.earth.name)}
                        hint={t.model3d.hint(terrainWidthKm, String(TERRAIN_EXAGGERATION))}
                        rotateLeftLabel={t.model3d.rotateLeft}
                        rotateRightLabel={t.model3d.rotateRight}
                        errorText={t.model3d.error}
                      />
                    </Suspense>
                  </ErrorBoundary>
                ) : (
                  <PhotoCarousel
                    key={`${area.id}-${view}`}
                    photos={pair.photos[view === 'moon' ? 'moon' : 'earth']}
                    texts={photoTexts[view === 'moon' ? 'moon' : 'earth']}
                    labels={{
                      prev: t.prevPhoto,
                      next: t.nextPhoto,
                      counter: t.photoCounter,
                      error: t.photoError,
                      empty: t.noPhotos,
                      region: `${view === 'moon' ? t.moonTab : t.earthTab}: ${labels[view === 'moon' ? 'moon' : 'earth'].name}`,
                    }}
                  />
                )}
                {!terrainSite ? <p className="pg-viewer__note">{t.model3d.missing}</p> : null}
              </div>
              <IlsSummary pair={pair} />
            </div>
          </div>
        </div>

        {/* Los dos sitios */}
        <section className="pg-section" aria-labelledby="pg-sitios">
          <PanelHeading id="pg-sitios" title={t.sections.sites} />
          <div className="pg-sites">
            <SitePanel pair={pair} body="earth" />
            <SitePanel pair={pair} body="moon" />
          </div>
        </section>

        {/* Las nueve similitudes y la analogía */}
        <section className="pg-section" aria-labelledby="pg-comparacion">
          <PanelHeading id="pg-comparacion" title={t.sections.comparison} lead={t.ils.disclaimer} />
          <div className="pg-compare">
            <SimilarityBars pair={pair} onSelectAxis={selectAxis} />
            <AnalogyPanel pair={pair} />
          </div>
        </section>

        {/* Eje por eje */}
        <section className="pg-section" aria-labelledby="pg-tabla">
          <PanelHeading id="pg-tabla" title={t.sections.table} lead={t.table.caption} />
          <div className="pg-cards">
            {pair.data.axes.map((axis) => (
              <AxisCard key={axis.key} id={`eje-${axis.key}`} pair={pair} axis={pairAxis(pair, axis.key)} detail="full" heading="axis" />
            ))}
          </div>
        </section>

        {/* Un eje en los cinco pares */}
        <section className="pg-section" aria-labelledby="pg-explorar">
          <PanelHeading id="pg-explorar" title={t.sections.explorer} lead={t.filters.axesHint} />
          <AxisExplorer axisId={axisId} onAxisChange={setAxisId} activePair={pair} />
        </section>

        <section className="pg-section" aria-labelledby="pg-metodo">
          <PanelHeading id="pg-metodo" title={t.sections.method} />
          <MethodPanel />
        </section>

        <section className="pg-section" aria-labelledby="pg-limitaciones">
          <PanelHeading id="pg-limitaciones" title={t.sections.limitations} />
          <LimitationsPanel />
        </section>

        <section className="pg-section" aria-labelledby="pg-fuentes">
          <PanelHeading id="pg-fuentes" title={t.sections.sources} />
          <SourcesPanel pair={pair} />
          <p className="pg-generated">{t.ils.generated(new Date(catalog.generatedAt).toLocaleDateString(locale, { dateStyle: 'long' }), catalog.schemaVersion)}</p>
        </section>
      </div>
    </section>
  );
}

function Head({ title, lead, scope }: { title: string; lead: string; scope: string }) {
  return (
    <header className="pg-console__head">
      <h1 id="playground-title" className="pg-console__title">
        {title}
      </h1>
      <p className="pg-console__lead">{lead}</p>
      <p className="pg-console__scope">{scope}</p>
    </header>
  );
}
