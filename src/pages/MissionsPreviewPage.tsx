import { useEffect, useState, type CSSProperties } from 'react';
import { EarthMapArt, LunitaShape, MapPieceArt } from '../components/lunita/LunitaArt';
import { SourceLink } from '../components/mission/SourceLink';
import { TerrainMap } from '../components/mission/TerrainMap';
import { getSiteTerrain } from '../components/mission/missionTerrain';
import { MAP_PIECES } from '../data/missions/lunitaMission';
import { getMissionSite, MISSION_SITE_IDS, STATION_11_PANORAMA, type MissionSiteId } from '../data/missions/roverMission';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18nContext';
import { useLunitaMissionText, useRoverMissionText } from '../i18n/missions';
import { PREVIEW_TEXT, type PreviewText } from '../i18n/preview';
import { PALETTES, paletteVars, PROPOSALS, type ProposalId } from '../preview/missionPalettes';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';
import '../styles/missions-preview.css';

/**
 * Vista previa (solo en desarrollo) de tres propuestas de modo claro para la
 * sección de Misiones. Todo el diseño vive dentro de `.mp`, con variables
 * `--mp-*` propias: la página actual, sus estilos y el modo oscuro no cambian.
 * El contenido (títulos, imágenes, edades, botones y rutas) es el real.
 */

const STORAGE_KEY = 'starman-preview-missions';

function readSaved(): ProposalId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return (PROPOSALS as readonly string[]).includes(saved ?? '') ? (saved as ProposalId) : 'atlas';
  } catch {
    return 'atlas';
  }
}

export function MissionsPreviewPage() {
  const { language } = useI18n();
  const p = PREVIEW_TEXT[language];
  useDocumentTitle(p.pageTitle);
  const [proposal, setProposal] = useState<ProposalId>(readSaved);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, proposal);
    } catch {
      // Sin almacenamiento: la elección dura mientras la página esté abierta.
    }
  }, [proposal]);

  const info = p.proposals[proposal];

  return (
    <div className="mp-page">
      <header className="mp-bar">
        <div className="container">
          <p className="mp-bar__eyebrow">{p.eyebrow}</p>
          <h1 className="mp-bar__title">{p.title}</h1>
          <p className="mp-bar__intro">{p.intro}</p>
          <p className="mp-bar__note">{p.isolated}</p>

          <fieldset className="mp-picker">
            <legend className="visually-hidden">{p.choose}</legend>
            {PROPOSALS.map((id, index) => {
              const palette = PALETTES[id];
              return (
                <label key={id} className="mp-picker__option">
                  <input type="radio" name="mp-proposal" value={id} checked={proposal === id} onChange={() => setProposal(id)} />
                  <span className="mp-picker__number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="mp-picker__text">
                    <span className="mp-picker__name">{p.proposals[id].name}</span>
                    <span className="mp-picker__summary">{p.proposals[id].summary}</span>
                    <span className="mp-swatches" aria-label={p.palette}>
                      {(
                        [
                          ['bg', palette.bg],
                          ['surface', palette.surface],
                          ['action', palette.action],
                          ['accent', id === 'cuaderno' ? palette.accent : palette.kidsYellow],
                        ] as const
                      ).map(([key, color]) => (
                        <span key={key} className="mp-swatch" title={`${p.swatches[key]} ${color}`}>
                          <span className="mp-swatch__dot" style={{ background: color }} />
                          <span className="mp-swatch__label">{p.swatches[key]}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <details className="mp-changes" open>
            <summary>
              {p.changesTitle}: {info.name}
            </summary>
            <div className="mp-changes__grid">
              <div>
                <h2>{p.desktop}</h2>
                <ul>
                  {info.desktop.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>{p.mobile}</h2>
                <ul>
                  {info.mobile.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        </div>
      </header>

      {/* Aquí empieza la propuesta: todo lo de dentro usa solo las variables --mp-*. */}
      <div
        className={`mp mp--${proposal}`}
        data-proposal={proposal}
        style={paletteVars(PALETTES[proposal]) as CSSProperties}
        aria-label={info.name}
        role="region"
      >
        <div className="mp-section-head">
          <div className="container">
            <h2 className="mp-section-head__title">{p.sectionTitle}</h2>
            <p className="mp-section-head__lead">{p.sectionLead}</p>
          </div>
        </div>
        {proposal === 'atlas' ? <Atlas p={p} /> : null}
        {proposal === 'cuaderno' ? <Cuaderno /> : null}
        {proposal === 'museo' ? <Museo /> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Piezas compartidas: contenido real de las dos misiones              */
/* ------------------------------------------------------------------ */

function RoverEyebrow() {
  const t = useRoverMissionText();
  return (
    <p className="mp-eyebrow">
      {t.meta.lab} · {t.meta.code}
    </p>
  );
}

function RoverAge() {
  return <span className="mp-age">{useRoverMissionText().meta.ages}</span>;
}

function KidsAge() {
  const t = useLunitaMissionText();
  return (
    <p className="mp-kids-tag">
      <span className="mp-kids-badge">{t.meta.badge}</span>{' '}
      <span className="mp-kids-dot">·</span>{' '}
      <span className="mp-age mp-age--kids">{t.meta.ages}</span>
    </p>
  );
}

function RoverActions() {
  const t = useRoverMissionText();
  return (
    <div className="mp-actions">
      <Link to={ROUTES.missionStart} className="mp-btn mp-btn--primary">
        {t.meta.startCta}
      </Link>
      <Link to={ROUTES.missionTeach} className="mp-btn mp-btn--secondary">
        {t.meta.teachCta}
      </Link>
    </div>
  );
}

function KidsAction() {
  const t = useLunitaMissionText();
  return (
    <div className="mp-actions">
      <Link to={ROUTES.lunita} className="mp-btn mp-btn--kids">
        <span aria-hidden="true">▶</span> {t.meta.cta}
      </Link>
    </div>
  );
}

function RoverBadges() {
  const t = useRoverMissionText();
  return (
    <ul className="mp-badges">
      {t.meta.badges.map((badge) => (
        <li key={badge}>{badge}</li>
      ))}
    </ul>
  );
}

/** Mapa de Lunita (ilustrado) con Lunita sobre el camino amarillo. */
function LunitaMap({ label }: { label: string }) {
  return (
    <svg className="mp-lunita-map" viewBox="0 0 600 360" role="img" aria-label={label}>
      <EarthMapArt />
      <g transform="translate(118 140) scale(2.2)">
        <LunitaShape />
      </g>
    </svg>
  );
}

/** Los tres relieves reales de la misión (DEM), sin capas ni tramo. */
function ReliefTrio({ p }: { p: PreviewText }) {
  const t = useRoverMissionText();
  return (
    <ul className="mp-relief">
      {(MISSION_SITE_IDS as readonly MissionSiteId[]).map((id) => {
        const site = getMissionSite(id);
        const stats = getSiteTerrain(id).profiles['west-east'].stats;
        return (
          <li key={id} className="mp-relief__item">
            <TerrainMap
              site={site}
              showSlope={false}
              showTransect={false}
              direction="west-east"
              cursorIndex={0}
              label={t.viewer.mapLabel(t.sites[id].name)}
              northLabel={t.viewer.north}
              scaleLabel={t.viewer.scaleBar}
              rimIndices={{ start: stats.rimStart, end: stats.rimEnd }}
            />
            <p className="mp-relief__name">
              <span className={`mp-relief__body mp-relief__body--${site.body}`}>{site.body === 'moon' ? p.demMoon : p.demEarth}</span>{' '}
              {t.sites[id].name}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function Panorama() {
  const t = useRoverMissionText();
  return (
    <figure className="mp-panorama">
      <img
        src={STATION_11_PANORAMA.src}
        width={STATION_11_PANORAMA.width}
        height={STATION_11_PANORAMA.height}
        alt={t.challenge.panoramaAlt}
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <figcaption className="container">
        {t.challenge.panoramaCaption} <SourceLink id={STATION_11_PANORAMA.sourceId} />
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Atlas Tierra–Luna                                                */
/* ------------------------------------------------------------------ */

function Atlas({ p }: { p: PreviewText }) {
  const t = useRoverMissionText();
  const k = useLunitaMissionText();
  return (
    <>
      <section className="mp-band mp-band--1" aria-labelledby="mp-atlas-rover">
        <div className="container mp-atlas">
          <figure className="mp-atlas__map">
            <ReliefTrio p={p} />
            <figcaption>
              {p.reliefCaption} <SourceLink id="copernicus-dem" /> · <SourceLink id="sldem2015" />
            </figcaption>
          </figure>
          <div className="mp-atlas__side">
            <RoverEyebrow />
            <RoverAge />
            <h3 id="mp-atlas-rover" className="mp-title">
              {t.meta.title}
            </h3>
            <p className="mp-lead">{t.meta.lead}</p>
            <RoverBadges />
            <RoverActions />
          </div>
        </div>
      </section>
      <section className="mp-band mp-band--2" aria-labelledby="mp-atlas-kids">
        <div className="container mp-atlas mp-atlas--kids">
          <div className="mp-atlas__side mp-atlas__side--kids">
            <KidsAge />
            <h3 id="mp-atlas-kids" className="mp-title">
              {k.meta.title}
            </h3>
            <p className="mp-lead">{k.meta.lead}</p>
            <KidsAction />
          </div>
          <figure className="mp-atlas__map mp-atlas__map--kids">
            <LunitaMap label={k.meta.artAlt} />
            <figcaption>
              <span className="mp-illustrative">{k.meta.illustrative}</span> {k.meta.illustrativeNote}
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Cuaderno de campo                                                */
/* ------------------------------------------------------------------ */

function Cuaderno() {
  const t = useRoverMissionText();
  const k = useLunitaMissionText();
  const northRay = getMissionSite('north-ray');
  return (
    <section className="mp-band mp-band--1">
      <div className="container mp-notebook">
        <article className="mp-entry" aria-labelledby="mp-nb-rover">
          <figure className="mp-entry__figure">
            <img
              src={northRay.photo.src}
              width={northRay.photo.width}
              height={northRay.photo.height}
              alt={t.sites['north-ray'].photoAlt}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <figcaption>
              {t.sites['north-ray'].name} — {t.sites['north-ray'].place}. <SourceLink id={northRay.photo.sourceId} />
            </figcaption>
          </figure>
          <div className="mp-entry__body">
            <div className="mp-entry__meta">
              <RoverEyebrow />
              <RoverAge />
            </div>
            <h3 id="mp-nb-rover" className="mp-title">
              {t.meta.title}
            </h3>
            <p className="mp-lead">{t.meta.lead}</p>
            <p className="mp-inline-badges">{t.meta.badges.join(' · ')}</p>
            <RoverActions />
          </div>
        </article>

        <hr className="mp-rule" />

        <article className="mp-entry mp-entry--kids" aria-labelledby="mp-nb-kids">
          <figure className="mp-entry__figure">
            <LunitaMap label={k.meta.artAlt} />
            <figcaption>
              <span className="mp-illustrative">{k.meta.illustrative}</span> {k.meta.illustrativeNote}
            </figcaption>
          </figure>
          <div className="mp-entry__body">
            <KidsAge />
            <h3 id="mp-nb-kids" className="mp-title">
              {k.meta.title}
            </h3>
            <p className="mp-lead">{k.meta.lead}</p>
            <KidsAction />
          </div>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Museo interactivo                                                */
/* ------------------------------------------------------------------ */

function Museo() {
  const t = useRoverMissionText();
  const k = useLunitaMissionText();
  const [first, ...rest] = MAP_PIECES;
  return (
    <>
      <section className="mp-band mp-band--1 mp-room" aria-labelledby="mp-museo-rover">
        <Panorama />
        <div className="container mp-room__label">
          <div>
            <RoverEyebrow />
            <RoverAge />
            <h3 id="mp-museo-rover" className="mp-title mp-title--big">
              {t.meta.title}
            </h3>
          </div>
          <div>
            <p className="mp-lead">{t.meta.lead}</p>
            <RoverBadges />
            <RoverActions />
          </div>
        </div>
      </section>
      <section className="mp-band mp-band--2 mp-room mp-room--kids" aria-labelledby="mp-museo-kids">
        <div className="container mp-puzzle">
          {first ? <MapPieceArt piece={first} className="mp-piece mp-piece--a" /> : null}
          <div className="mp-puzzle__center">
            <KidsAge />
            <h3 id="mp-museo-kids" className="mp-title mp-title--big">
              {k.meta.title}
            </h3>
            <p className="mp-lead">{k.meta.lead}</p>
            <KidsAction />
            <p className="mp-puzzle__note">
              <span className="mp-illustrative">{k.meta.illustrative}</span>
            </p>
          </div>
          <div className="mp-puzzle__stack">
            {rest.map((piece, i) => (
              <MapPieceArt key={piece} piece={piece} className={`mp-piece mp-piece--${i === 0 ? 'b' : 'c'}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
