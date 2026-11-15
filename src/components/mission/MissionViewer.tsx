import { useMemo, useState } from 'react';
import {
  getMissionSite,
  MISSION_SITE_IDS,
  ROVER_FACTS,
  TERRAIN_META,
  type MissionSiteId,
} from '../../data/missions/roverMission';
import { findingSources, MIN_NOTE_LENGTH, type FindingDraft, type FindingKind } from '../../hooks/useMissionProgress';
import { useI18n } from '../../i18n/I18nContext';
import { useRoverMissionText } from '../../i18n/missions';
import { slopeClass, type SlopeClass, type TransectDirection } from '../../utils/terrain';
import { FindingSummary } from './FindingSummary';
import { DIRECTIONS, getSiteTerrain, slopeColor } from './missionTerrain';
import { ProfileChart } from './ProfileChart';
import { SourceLink } from './SourceLink';
import { TerrainMap } from './TerrainMap';

type ViewMode = 'photo' | 'relief';

/** Registro de hallazgos desde el visor (pasos 2 a 4). El borrador vive en el avance guardado. */
export interface FindingRecorder {
  draft: FindingDraft | null;
  canRecordMore: boolean;
  maxFindings: number;
  /** Abre, cambia o descarta (null) el borrador. */
  onDraftChange: (draft: FindingDraft | null) => void;
  /** Guarda el borrador en la bitácora. */
  onSave: () => void;
}

interface MissionViewerProps {
  /** Si se pasa, aparece «Registrar hallazgo». */
  recorder?: FindingRecorder;
}

const SLOPE_CLASSES: SlopeClass[] = ['gentle', 'moderate', 'steep', 'over-limit'];

/**
 * Visor Tierra–Luna: tres sitios (dos candidatos y la referencia lunar) con
 * foto real, relieve calculado del DEM, capa de pendiente, tramo del rover y
 * perfil de terreno. Todos los valores tienen unidades y fuente enlazada.
 */
export function MissionViewer({ recorder }: MissionViewerProps) {
  const { locale } = useI18n();
  const text = useRoverMissionText();
  const v = text.viewer;

  // Si al recargar había un hallazgo a medio registrar, el visor vuelve a ese sitio y lectura.
  const restored = recorder?.draft ?? null;
  const [siteId, setSiteId] = useState<MissionSiteId>(restored?.site ?? 'el-elegante');
  const [view, setView] = useState<ViewMode>(restored?.view ?? 'photo');
  const [showSlope, setShowSlope] = useState(restored?.slopeLayer ?? false);
  const [showTransect, setShowTransect] = useState(true);
  const [direction, setDirection] = useState<TransectDirection>(restored?.direction ?? 'west-east');
  const [compare, setCompare] = useState(restored?.compared ?? false);
  const [cursor, setCursor] = useState(restored?.index ?? 14);
  const [noteError, setNoteError] = useState(false);

  const site = getMissionSite(siteId);
  const terrain = getSiteTerrain(siteId);
  const { points, stats } = terrain.profiles[direction];
  const reference = siteId === 'north-ray' ? null : getSiteTerrain('north-ray').profiles[direction].points;
  const point = points[cursor] ?? points[0]!;
  const siteText = text.sites[siteId];

  const formatters = useMemo(
    () => ({
      0: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
      1: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    }),
    [locale],
  );
  const fmt = (value: number, digits: 0 | 1 = 0) => formatters[digits].format(value);
  const directionLabel = direction === 'west-east' ? v.westEast : v.northSouth;
  const pointClass = slopeClass(point.slope);
  const readout = `${v.distance}: ${fmt(point.distance)} m · ${v.height}: ${fmt(point.height)} m · ${v.slope}: ${fmt(point.slope, 1)}°`;

  /** Instantánea de lo que muestra el visor ahora, como hallazgo del tipo pedido. */
  const snapshot = (kind: FindingKind, note = ''): FindingDraft => {
    const compared = kind !== 'photo' && compare && siteId !== 'north-ray';
    return {
      site: siteId,
      kind,
      view: kind === 'photo' ? 'photo' : 'relief',
      slopeLayer: kind !== 'photo' && showSlope,
      compared,
      direction: kind === 'photo' ? null : direction,
      index: kind === 'point' ? cursor : null,
      values:
        kind === 'point'
          ? { distance: point.distance, height: point.height, slope: point.slope }
          : kind === 'transect'
            ? { depth: stats.depth, rimToRim: stats.rimToRim, maxSlope: stats.maxSlope, meanSlope: stats.meanSlope }
            : {},
      sourceIds: findingSources(siteId, kind, compared),
      note,
    };
  };
  const draft = recorder?.draft ?? null;
  const scopes: FindingKind[] = view === 'photo' ? ['photo', 'point', 'transect'] : ['point', 'transect'];

  const selectSite = (id: MissionSiteId) => {
    setSiteId(id);
    if (id === 'north-ray') setCompare(false);
  };

  return (
    <section className="mission-viewer" aria-labelledby="mission-viewer-title">
      <h2 id="mission-viewer-title" className="mission-viewer__title">
        {v.title}
      </h2>

      {/* Sitios */}
      <div className="mission-viewer__sites" role="group" aria-label={v.siteTabsLabel}>
        {MISSION_SITE_IDS.map((id) => {
          const isMoon = id === 'north-ray';
          return (
            <button
              key={id}
              type="button"
              className={`site-tab${isMoon ? ' site-tab--moon' : ''}`}
              aria-pressed={siteId === id}
              onClick={() => selectSite(id)}
            >
              <span className="site-tab__role">{isMoon ? text.roles.reference : text.roles.candidate}</span>
              <span className="site-tab__name">{text.sites[id].name}</span>
            </button>
          );
        })}
      </div>

      {/* Controles */}
      <div className="mission-viewer__controls">
        <div className="segmented" role="group" aria-label={v.viewLabel}>
          {(['photo', 'relief'] as const).map((mode) => (
            <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)}>
              {mode === 'photo' ? v.photo : v.relief}
            </button>
          ))}
        </div>
        <fieldset className="mission-viewer__layers" disabled={view === 'photo'}>
          <legend className="visually-hidden">{v.layersLabel}</legend>
          <label className="check-pill">
            <input type="checkbox" checked={showSlope} onChange={(event) => setShowSlope(event.target.checked)} />
            {v.slopeLayer}
          </label>
          <label className="check-pill">
            <input type="checkbox" checked={showTransect} onChange={(event) => setShowTransect(event.target.checked)} />
            {v.transectLayer}
          </label>
        </fieldset>
        <div className="segmented" role="group" aria-label={v.directionLabel}>
          {DIRECTIONS.map((d) => (
            <button key={d} type="button" aria-pressed={direction === d} onClick={() => setDirection(d)}>
              {d === 'west-east' ? v.westEast : v.northSouth}
            </button>
          ))}
        </div>
      </div>

      <div className="mission-viewer__stage">
        {/* Imagen: foto real o relieve del DEM */}
        <div className="mission-viewer__image">
          {view === 'photo' ? (
            <figure className="mission-photo">
              <img
                src={site.photo.src}
                width={site.photo.width}
                height={site.photo.height}
                alt={siteText.photoAlt}
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <figcaption>
                {v.photoCredit}: <SourceLink id={site.photo.sourceId} />. {v.photoNote}
              </figcaption>
            </figure>
          ) : (
            <>
              <TerrainMap
                site={site}
                showSlope={showSlope}
                showTransect={showTransect}
                direction={direction}
                cursorIndex={cursor}
                label={v.mapLabel(siteText.name)}
                northLabel={v.north}
                scaleLabel={v.scaleBar}
                rimIndices={{ start: stats.rimStart, end: stats.rimEnd }}
              />
              {showSlope ? (
                <ul className="slope-legend" aria-label={v.legendTitle}>
                  {SLOPE_CLASSES.map((cls) => (
                    <li key={cls}>
                      <span className="slope-legend__swatch" style={{ background: slopeColor(cls) }} aria-hidden="true" />
                      {v.legend[cls]}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>

        {/* Evidencia: perfil, lectura y estadísticas */}
        <div className="mission-viewer__evidence">
          <h3 className="mission-viewer__profile-title">{v.profileTitle(siteText.name)}</h3>
          {reference ? (
            <label className="check-pill check-pill--compare">
              <input type="checkbox" checked={compare} onChange={(event) => setCompare(event.target.checked)} />
              {v.compareMoon}
            </label>
          ) : null}
          <ProfileChart
            points={points}
            comparePoints={compare ? reference : null}
            compareLabel={text.sites['north-ray'].name}
            siteLabel={siteText.name}
            cursorIndex={cursor}
            onCursorChange={setCursor}
            rims={{ start: stats.rimStart, end: stats.rimEnd }}
            title={v.profileTitle(siteText.name)}
            description={v.profileDesc(siteText.name, directionLabel)}
            sliderLabel={v.cursorLabel}
            sliderValueText={readout}
            axisDistance={v.axisDistance}
            axisHeight={v.axisHeight}
            exaggerationLabel={v.exaggeration}
            formatNumber={(value, digits) => fmt(value, digits === 1 ? 1 : 0)}
          />

          <dl className="readout" aria-live="polite">
            <div>
              <dt>{v.distance}</dt>
              <dd>{fmt(point.distance)} m</dd>
            </div>
            <div>
              <dt>{v.height}</dt>
              <dd>{fmt(point.height)} m</dd>
            </div>
            <div>
              <dt>{site.body === 'moon' ? v.elevationMoon : v.elevation}</dt>
              <dd>{fmt(point.elevation)} m</dd>
            </div>
            <div>
              <dt>{v.slope}</dt>
              <dd>
                <span className="slope-badge" style={{ background: slopeColor(pointClass, 0.22), borderColor: slopeColor(pointClass) }}>
                  {fmt(point.slope, 1)}°
                </span>
                {pointClass === 'over-limit' ? <span className="readout__warning"> {v.overLimit}</span> : null}
              </dd>
            </div>
          </dl>

          {recorder && !draft ? (
            <div className="mission-viewer__save">
              <button
                type="button"
                className="button button--primary button--small"
                disabled={!recorder.canRecordMore}
                onClick={() => {
                  setNoteError(false);
                  recorder.onDraftChange(snapshot(view === 'photo' ? 'photo' : 'point'));
                }}
              >
                + {v.record}
              </button>
              {!recorder.canRecordMore ? <p className="field__hint">{v.recordLimit(recorder.maxFindings)}</p> : null}
            </div>
          ) : null}

          {recorder && draft ? (
            <form
              className="finding-form"
              aria-labelledby="finding-form-title"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.note.trim().length < MIN_NOTE_LENGTH) {
                  setNoteError(true);
                  return;
                }
                setNoteError(false);
                recorder.onSave();
              }}
            >
              <h4 id="finding-form-title" className="finding-form__title">
                {v.form.title}
              </h4>
              <fieldset className="finding-form__scope">
                <legend>{v.form.scopeLabel}</legend>
                {scopes.map((kind) => (
                  <label key={kind} className="check-pill">
                    <input
                      type="radio"
                      name="finding-scope"
                      checked={draft.kind === kind}
                      onChange={() => recorder.onDraftChange(snapshot(kind, draft.note))}
                    />
                    {v.form.scope[kind]}
                  </label>
                ))}
              </fieldset>
              <FindingSummary finding={draft} showNote={false} />
              <button
                type="button"
                className="link-button"
                onClick={() => recorder.onDraftChange(snapshot(scopes.includes(draft.kind) ? draft.kind : scopes[0]!, draft.note))}
              >
                ↻ {v.form.refresh}
              </button>
              <div className="field">
                <label htmlFor="finding-note">{v.form.noteLabel}</label>
                <p id="finding-note-hint" className="field__hint">
                  {v.form.noteHint}
                </p>
                {noteError ? (
                  <p id="finding-note-error" className="field__error">
                    {v.form.errorNote}
                  </p>
                ) : null}
                <textarea
                  id="finding-note"
                  rows={3}
                  maxLength={600}
                  value={draft.note}
                  aria-invalid={noteError ? true : undefined}
                  aria-describedby={noteError ? 'finding-note-hint finding-note-error' : 'finding-note-hint'}
                  onChange={(event) => recorder.onDraftChange({ ...draft, note: event.target.value })}
                />
              </div>
              <div className="finding-form__actions">
                <button type="submit" className="button button--primary button--small">
                  {v.form.save}
                </button>
                <button
                  type="button"
                  className="button button--ghost button--small"
                  onClick={() => {
                    setNoteError(false);
                    recorder.onDraftChange(null);
                  }}
                >
                  {v.form.cancel}
                </button>
              </div>
            </form>
          ) : null}

          <dl className="terrain-stats">
            <div>
              <dt>{v.stats.depth}</dt>
              <dd>{fmt(stats.depth)} m</dd>
            </div>
            <div>
              <dt>{v.stats.rimToRim}</dt>
              <dd>{fmt(stats.rimToRim)} m</dd>
            </div>
            <div>
              <dt>{v.stats.maxSlope}</dt>
              <dd>{fmt(stats.maxSlope, 1)}°</dd>
            </div>
            <div>
              <dt>{v.stats.meanSlope}</dt>
              <dd>{fmt(stats.meanSlope, 1)}°</dd>
            </div>
          </dl>
          <p className="rover-limit">
            {v.roverLimit(ROVER_FACTS.maxSlopeDeg)} · <SourceLink id={ROVER_FACTS.maxSlopeSource} />
          </p>
        </div>
      </div>

      {/* Ficha del sitio con fuentes */}
      <div className="site-card">
        <p className="site-card__kind">
          {siteText.kind} · {siteText.place}
        </p>
        <ul className="site-card__facts">
          {siteText.facts.map((fact) => (
            <li key={fact.text}>
              {fact.text} <SourceLink id={fact.source} />
            </li>
          ))}
        </ul>
        <p className="site-card__data">
          {v.dataFrom}: <SourceLink id={site.demSourceId} /> (
          {v.resolution(site.body === 'moon' ? TERRAIN_META.moonResolutionMeters : TERRAIN_META.earthResolutionMeters)})
          {site.body === 'earth' ? (
            <>
              {' '}
              · <SourceLink id="open-meteo" />
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
