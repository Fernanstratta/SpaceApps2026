import { lazy, Suspense, useId, useState, type ReactNode } from 'react';
import { hasKnownLimitation } from '../../data/analogCaveats';
import { getPairLabels } from '../../data/analogText';
import { type AnalogPair, type AxisSide, type Body, BODIES, isComparable, pairAxis } from '../../data/lunarAnalogs';
import { useI18n } from '../../i18n/I18nContext';
import { LESSON_VISUALS_TEXT } from '../../i18n/lessonVisuals';
import type { AxisId } from '../../types/Axis';
import type { LessonVisualKind } from '../../types';
import { getMissionSite } from '../../data/missions/roverMission';
import { timesLarger } from '../../utils/analogFormat';
import { useAnalogText } from '../analogs/useAnalogText';
import { ErrorBoundary } from '../common/ErrorBoundary';

const Terrain3D = lazy(() => import('../playground/Terrain3D'));
/** Exageración vertical de `Terrain3D` (se indica en el texto de ayuda). */
const TERRAIN_EXAGGERATION = 2;

/**
 * Figuras de las lecciones. Las que muestran datos leen los valores del
 * backend de los pares de la lección (nunca calculan similitudes); las
 * esquemáticas lo dicen en su pie. Todas tienen texto alternativo con los
 * valores principales y no dependen solo del color.
 */

/** Umbral del eje de pendiente: el backend cuenta la fracción con pendiente < 10° (`units`). */
const SAFE_SLOPE_DEG = 10;

interface VisualProps {
  pairs: readonly AnalogPair[];
}

interface SiteValue {
  pair: AnalogPair;
  body: Body;
  name: string;
  side: AxisSide;
}

/** Valores de un eje en los sitios de los pares (solo los que el backend trae). */
function useSiteValues(pairs: readonly AnalogPair[], axisId: AxisId): SiteValue[] {
  const { language } = useI18n();
  return pairs.flatMap((pair) => {
    const axis = pairAxis(pair, axisId);
    const labels = getPairLabels(pair, language);
    return BODIES.flatMap((body) => {
      const side = axis[body];
      return side ? [{ pair, body, name: labels[body].name, side }] : [];
    });
  });
}

function Figure({ title, alt, children, foot, className = '' }: { title: string; alt?: string; children: ReactNode; foot?: ReactNode; className?: string }) {
  return (
    <figure className={`lv ${className}`}>
      <figcaption className="lv__title">{title}</figcaption>
      {alt ? <p className="visually-hidden">{alt}</p> : null}
      {children}
      {foot ? <div className="lv__foot">{foot}</div> : null}
    </figure>
  );
}

function BodyDot({ body }: { body: Body }) {
  return <span className={`lv-dot lv-dot--${body}`} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Pendiente                                                           */
/* ------------------------------------------------------------------ */

function SlopeRamp() {
  const { language } = useI18n();
  const t = LESSON_VISUALS_TEXT[language].slopeRamp;
  const [deg, setDeg] = useState(5);
  const inputId = useId();
  const safe = deg < SAFE_SLOPE_DEG;
  const rad = (deg * Math.PI) / 180;
  // Rampa de 240 px que gira alrededor de su esquina izquierda.
  const x0 = 40;
  const y0 = 150;
  const len = 240;
  const x1 = x0 + len * Math.cos(rad);
  const y1 = y0 - len * Math.sin(rad);
  const mid = 0.55;
  const mx = x0 + len * mid * Math.cos(rad);
  const my = y0 - len * mid * Math.sin(rad);
  return (
    <Figure title={t.title} className="lv--ramp" foot={<p>{t.threshold(String(SAFE_SLOPE_DEG))}</p>}>
      <svg viewBox="0 0 320 170" className="lv-ramp__svg" role="img" aria-label={t.alt(String(deg), safe)}>
        <line x1="20" y1={y0} x2="300" y2={y0} className="lv-ramp__ground" />
        <polygon points={`${x0},${y0} ${x1},${y1} ${x1},${y0}`} className={`lv-ramp__wedge${safe ? ' is-safe' : ' is-risky'}`} />
        <g transform={`translate(${mx} ${my}) rotate(${-deg})`}>
          <rect x="-20" y="-30" width="40" height="22" rx="4" className="lv-ramp__lander" />
          <line x1="-16" y1="-8" x2="-24" y2="0" className="lv-ramp__leg" />
          <line x1="16" y1="-8" x2="24" y2="0" className="lv-ramp__leg" />
          <circle cx="0" cy="-19" r="5" className="lv-ramp__window" />
        </g>
        <path d={`M ${x0 + 46} ${y0} A 46 46 0 0 0 ${x0 + 46 * Math.cos(rad)} ${y0 - 46 * Math.sin(rad)}`} className="lv-ramp__arc" />
        <text x={x0 + 54} y={y0 - 6} className="lv-ramp__deg">
          {t.value(String(deg))}
        </text>
      </svg>
      <div className="lv-ramp__control">
        <label htmlFor={inputId}>{t.label}</label>
        <input id={inputId} type="range" min={0} max={30} step={1} value={deg} onChange={(event) => setDeg(Number(event.target.value))} aria-valuetext={t.value(String(deg))} />
        <output htmlFor={inputId} className="lv-ramp__value">
          {t.value(String(deg))}
        </output>
      </div>
      <p className={`lv-ramp__verdict${safe ? ' is-safe' : ' is-risky'}`} role="status">
        <span aria-hidden="true">{safe ? '✓' : '!'}</span> {safe ? t.safe : t.risky}
      </p>
    </Figure>
  );
}

function SlopeWaffle({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.slopeWaffle;
  const { percent } = useAnalogText();
  const sites = useSiteValues(pairs, 'slope');
  return (
    <Figure
      title={t.title}
      foot={
        <p>
          <span className="lv-key lv-key--flat" aria-hidden="true" /> {t.flat} · <span className="lv-key lv-key--steep" aria-hidden="true" /> {t.steep}.{' '}
          {t.cell} {v.fromBackend}
        </p>
      }
    >
      <ul className="lv-waffles">
        {sites.map(({ pair, body, name, side }) => {
          const flat = Math.round(Math.min(1, Math.max(0, side.value)) * 100);
          const share = percent(side.value);
          return (
            <li key={`${pair.id}-${body}`} className="lv-waffle">
              <svg viewBox="0 0 100 100" className="lv-waffle__grid" role="img" aria-label={t.alt(name, share)}>
                {Array.from({ length: 100 }, (_, index) => (
                  <rect
                    key={index}
                    x={(index % 10) * 10 + 0.8}
                    y={Math.floor(index / 10) * 10 + 0.8}
                    width="8.4"
                    height="8.4"
                    rx="1.4"
                    className={index < flat ? 'lv-waffle__flat' : 'lv-waffle__steep'}
                  />
                ))}
              </svg>
              <p className="lv-waffle__label">
                <BodyDot body={body} />
                {name}
              </p>
              <p className="lv-waffle__value">{t.share(share)}</p>
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Rugosidad                                                           */
/* ------------------------------------------------------------------ */

function RadarScatter({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.radar;
  const { number } = useAnalogText();
  const { locale } = useI18n();
  const sites = useSiteValues(pairs, 'roughness');
  const ruler = (body: Body, label: string) => {
    const items = sites.filter((site) => site.body === body);
    if (items.length === 0) return null;
    return (
      <div className={`lv-ruler lv-ruler--${body}`}>
        <p className="lv-ruler__label">
          <BodyDot body={body} />
          {label}
        </p>
        <div className="lv-ruler__track" aria-hidden="true">
          {items.map((site, index) => (
            <span key={site.pair.id} className="lv-ruler__mark" style={{ left: `${site.side.value * 100}%` }}>
              <span className="lv-ruler__pin">{index + 1}</span>
            </span>
          ))}
        </div>
        <p className="lv-ruler__ends" aria-hidden="true">
          <span>0 · {t.smoother}</span>
          <span>{t.rougher} · 1</span>
        </p>
        <ol className="lv-ruler__list">
          {items.map((site) => (
            <li key={site.pair.id}>
              {t.percentile(site.name, number(site.side.value, 2))}
              {site.side.raw ? <span className="lv-muted"> ({t.raw(`${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(site.side.raw.value)} ${site.side.raw.units}`)})</span> : null}
            </li>
          ))}
        </ol>
      </div>
    );
  };
  return (
    <Figure title={t.title} foot={<p>{v.fromBackend}</p>}>
      <div className="lv-radar">
        {(['smooth', 'rough'] as const).map((kind) => (
          <div key={kind} className="lv-radar__panel">
            <svg viewBox="0 0 200 130" role="img" aria-label={t.alt}>
              <rect x="82" y="6" width="36" height="16" rx="3" className="lv-radar__sat" />
              <line x1="70" y1="14" x2="82" y2="14" className="lv-radar__panel-line" />
              <line x1="118" y1="14" x2="130" y2="14" className="lv-radar__panel-line" />
              <line x1="100" y1="22" x2="70" y2="100" className="lv-radar__beam" />
              {kind === 'smooth' ? (
                <>
                  <rect x="10" y="100" width="180" height="26" className="lv-radar__ground" />
                  <line x1="70" y1="100" x2="40" y2="22" className="lv-radar__echo lv-radar__echo--away" />
                </>
              ) : (
                <>
                  <path d="M10 126 V108 L22 98 L30 106 L42 94 L54 104 L64 96 L76 103 L88 92 L100 104 L114 95 L126 106 L140 97 L152 104 L166 95 L178 103 L190 99 V126 Z" className="lv-radar__ground" />
                  <line x1="70" y1="100" x2="98" y2="26" className="lv-radar__echo" />
                  <line x1="70" y1="100" x2="30" y2="60" className="lv-radar__echo lv-radar__echo--faint" />
                  <line x1="70" y1="100" x2="130" y2="66" className="lv-radar__echo lv-radar__echo--faint" />
                </>
              )}
            </svg>
            <p className="lv-radar__name">{kind === 'smooth' ? t.smooth : t.rough}</p>
            <p className="lv-muted">{kind === 'smooth' ? t.smoothText : t.roughText}</p>
          </div>
        ))}
      </div>
      {sites.length > 0 ? (
        <div className="lv-rulers">
          <p className="lv-subtitle">{t.rulersTitle}</p>
          {ruler('earth', t.earthRuler)}
          {ruler('moon', t.moonRuler)}
        </div>
      ) : null}
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Mineralogía                                                         */
/* ------------------------------------------------------------------ */

function FelsicMafic({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.felsicMafic;
  const { number } = useAnalogText();
  const sites = useSiteValues(pairs, 'mineralogy');
  const alt = t.alt(sites.map((site) => t.item(site.name, number(site.side.value, 2))).join('; '));
  return (
    <Figure title={t.title} alt={alt} foot={<p>{v.fromBackend}</p>}>
      <div className="lv-fm">
        <div className="lv-fm__ends" aria-hidden="true">
          <span>
            <strong>{t.felsic}</strong> (0) · {t.felsicRocks}
          </span>
          <span>
            <strong>{t.mafic}</strong> (1) · {t.maficRocks}
          </span>
        </div>
        <div className="lv-fm__bar" aria-hidden="true">
          {sites.map((site, index) => (
            <span
              key={`${site.pair.id}-${site.body}`}
              className={`lv-fm__mark lv-fm__mark--${site.body}`}
              style={{ left: `${Math.min(1, Math.max(0, site.side.value)) * 100}%` }}
            >
              <span className="lv-fm__pin">{index + 1}</span>
            </span>
          ))}
        </div>
        <ol className="lv-fm__list">
          {sites.map((site) => (
            <li key={`${site.pair.id}-${site.body}`}>
              <BodyDot body={site.body} />
              {t.item(site.name, number(site.side.value, 2))}
              {hasKnownLimitation(site.pair, 'mineralogy') ? <span className="lv-flag"> ⚠ {t.caveat}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Albedo                                                              */
/* ------------------------------------------------------------------ */

function AlbedoSwatches({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.albedo;
  const { number, percent } = useAnalogText();
  const sites = useSiteValues(pairs, 'albedo');
  return (
    <Figure title={t.title} foot={<p>{t.scale}. {t.tone} {v.fromBackend}</p>}>
      <ul className="lv-swatches">
        {sites.map((site) => {
          // Tono aproximado: reflectancia lineal a gris sRGB.
          const gray = Math.round(255 * Math.pow(Math.min(1, Math.max(0, site.side.value)), 1 / 2.2));
          return (
            <li key={`${site.pair.id}-${site.body}`} className="lv-swatch">
              <span className="lv-swatch__chip" style={{ background: `rgb(${gray} ${gray} ${gray})` }} role="img" aria-label={t.alt(site.name, number(site.side.value, 3))} />
              <span className="lv-swatch__name">
                <BodyDot body={site.body} />
                {site.name}
              </span>
              <span className="lv-swatch__value">
                {number(site.side.value, 3)} · {t.reflects(percent(site.side.value))}
              </span>
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Amplitud térmica                                                    */
/* ------------------------------------------------------------------ */

function ThermalBars({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.thermal;
  const { value, number } = useAnalogText();
  const [log, setLog] = useState(false);
  const groupId = useId();
  const sites = useSiteValues(pairs, 'thermal');
  const max = Math.max(...sites.map((site) => site.side.value), 1) * 1.05;
  const width = (x: number) => (log ? (Math.log10(Math.max(x, 10)) - 1) / (Math.log10(1000) - 1) : x / max) * 100;
  const alt = t.alt(sites.map((site) => t.item(site.name, value('thermal', site.side))).join('; '));
  return (
    <Figure title={t.title} alt={alt} foot={<p>{log ? t.logHint : t.linearHint} {v.fromBackend}</p>}>
      <div className="lv-toggle" role="group" aria-labelledby={groupId}>
        <span id={groupId} className="visually-hidden">
          {t.scaleLabel}
        </span>
        <button type="button" aria-pressed={!log} onClick={() => setLog(false)}>
          {t.linear}
        </button>
        <button type="button" aria-pressed={log} onClick={() => setLog(true)}>
          {t.log}
        </button>
      </div>
      {pairs.map((pair) => {
        const axis = pairAxis(pair, 'thermal');
        const rows = sites.filter((site) => site.pair.id === pair.id);
        const times = axis.earth && axis.moon ? timesLarger(axis.earth.value, axis.moon.value) : null;
        return (
          <div key={pair.id} className="lv-bars" aria-hidden="true">
            {rows.map((site) => (
              <div key={site.body} className="lv-bars__row">
                <span className="lv-bars__name">
                  <BodyDot body={site.body} />
                  {site.name}
                </span>
                <span className="lv-bars__track">
                  <span className={`lv-bars__fill lv-bars__fill--${site.body}`} style={{ width: `${width(site.side.value)}%` }} />
                </span>
                <span className="lv-bars__value">{value('thermal', site.side)}</span>
              </div>
            ))}
            {times !== null ? <p className="lv-bars__times">{t.times(number(times, 0))}</p> : null}
          </div>
        );
      })}
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Aridez                                                              */
/* ------------------------------------------------------------------ */

function NdviBands({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.ndvi;
  const { number } = useAnalogText();
  const sites = useSiteValues(pairs, 'aridity').filter((site) => site.body === 'earth');
  const pos = (x: number) => ((x + 1) / 2) * 100;
  const alt = t.alt([...sites.map((site) => t.item(site.name, number(site.side.value, 2))), t.moon].join('; '));
  const bands = [
    { from: -1, to: 0, label: t.water, className: 'water' },
    { from: 0, to: 0.2, label: t.bare, className: 'bare' },
    { from: 0.2, to: 0.5, label: t.shrub, className: 'shrub' },
    { from: 0.5, to: 1, label: t.forest, className: 'forest' },
  ];
  return (
    <Figure title={t.title} alt={alt} foot={<p>{t.moon}. {v.fromBackend}</p>}>
      <div className="lv-ndvi" aria-hidden="true">
        <div className="lv-ndvi__bands">
          {bands.map((band) => (
            <span key={band.className} className={`lv-ndvi__band lv-ndvi__band--${band.className}`} style={{ left: `${pos(band.from)}%`, width: `${pos(band.to) - pos(band.from)}%` }}>
              {band.label}
            </span>
          ))}
          <span className="lv-ndvi__moon" style={{ left: `${pos(0)}%` }}>
            <BodyDot body="moon" />
          </span>
          {sites.map((site, index) => (
            <span key={site.pair.id} className="lv-ndvi__mark" style={{ left: `${pos(site.side.value)}%` }}>
              <span className="lv-ruler__pin">{index + 1}</span>
            </span>
          ))}
        </div>
        <p className="lv-ruler__ends">
          <span>−1</span>
          <span>0</span>
          <span>1</span>
        </p>
      </div>
      <ol className="lv-fm__list">
        {sites.map((site) => (
          <li key={site.pair.id}>
            <BodyDot body="earth" />
            {t.item(site.name, number(site.side.value, 3))}
          </li>
        ))}
      </ol>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Hielo                                                               */
/* ------------------------------------------------------------------ */

function IceSection({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.ice;
  const { value } = useAnalogText();
  const sites = useSiteValues(pairs, 'ice');
  return (
    <Figure title={t.title} foot={<p>{v.illustrative}</p>}>
      <svg viewBox="0 0 520 215" className="lv-ice" role="img" aria-label={t.alt}>
        {/* Desierto terrestre: clase 0 */}
        <rect x="10" y="130" width="120" height="70" className="lv-ice__desert" />
        <text x="70" y="120" className="lv-ice__label" textAnchor="middle">
          {t.desert}
        </text>
        <text x="70" y="172" className="lv-ice__class" textAnchor="middle">
          0
        </text>
        {/* Cráter polar: roca, interior en sombra y hielo */}
        <path d="M150 130 L215 70 L255 100 Q340 200 425 100 L465 70 L510 130 V205 H150 Z" className="lv-ice__rock" />
        <path d="M255 100 Q340 200 425 100 Z" className="lv-ice__shadow" />
        <ellipse cx="340" cy="151" rx="40" ry="6" className="lv-ice__stable" />
        {/* Hielo bajo la superficie del borde (no en la superficie) */}
        <ellipse cx="215" cy="91" rx="13" ry="4.5" className="lv-ice__sub" />
        <ellipse cx="465" cy="91" rx="13" ry="4.5" className="lv-ice__sub" />
        <line x1="215" y1="97" x2="215" y2="186" className="lv-ice__leader" />
        <text x="215" y="199" className="lv-ice__label lv-ice__label--dark" textAnchor="middle">
          {t.subsurface}
        </text>
        {/* Sol rasante desde un lado */}
        <line x1="80" y1="60" x2="200" y2="67" className="lv-ice__sun" />
        <text x="12" y="64" className="lv-ice__label">
          {t.sun}
        </text>
        <text x="215" y="42" className="lv-ice__label" textAnchor="middle">
          {t.rim}
        </text>
        <text x="215" y="60" className="lv-ice__class lv-ice__class--fg" textAnchor="middle">
          1
        </text>
        <text x="340" y="90" className="lv-ice__label" textAnchor="middle">
          {t.shadow}
        </text>
        <text x="340" y="132" className="lv-ice__class lv-ice__class--light" textAnchor="middle">
          3
        </text>
      </svg>
      <ul className="lv-ice__legend">
        {t.classes.map((label, index) => (
          <li key={label} className={`lv-ice__key lv-ice__key--${index}`}>
            {label}
          </li>
        ))}
      </ul>
      {sites.length > 0 ? (
        <ul className="lv-fm__list">
          {sites.map((site) => (
            <li key={`${site.pair.id}-${site.body}`}>
              <BodyDot body={site.body} />
              {t.valueOf(site.name, value('ice', site.side))}
              {site.pair.id === 'cucapa_shackleton' && site.body === 'moon' ? <span className="lv-muted"> — {t.notSurface}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Polvo                                                               */
/* ------------------------------------------------------------------ */

function GrainSizes({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.grains;
  const { number, percent } = useAnalogText();
  const sites = useSiteValues(pairs, 'dust');
  // Escala logarítmica de 0.1 µm a 10 mm.
  const pos = (um: number) => ((Math.log10(um) + 1) / 6) * 100;
  const bands = [
    { from: 0.1, to: 2, label: t.clay, className: 'clay' },
    { from: 2, to: 63, label: t.silt, className: 'silt' },
    { from: 63, to: 2000, label: t.sand, className: 'sand' },
    { from: 2000, to: 10000, label: t.gravel, className: 'gravel' },
  ];
  const alt = t.alt(sites.map((site) => t.item(site.name, percent(site.side.value))).join('; '));
  return (
    <Figure title={t.title} alt={alt} foot={<p>{v.fromBackend}</p>}>
      <div className="lv-grains" aria-hidden="true">
        <div className="lv-ndvi__bands">
          {bands.map((band) => (
            <span key={band.className} className={`lv-ndvi__band lv-grains__band--${band.className}`} style={{ left: `${pos(band.from)}%`, width: `${pos(band.to) - pos(band.from)}%` }}>
              {band.label}
            </span>
          ))}
          <span className="lv-grains__limit" style={{ left: `${pos(63)}%` }} />
          <span className="lv-grains__hair" style={{ left: `${pos(70)}%` }} />
        </div>
        <p className="lv-ruler__ends">
          <span>0.1 µm</span>
          <span>63 µm</span>
          <span>10 mm</span>
        </p>
        <p className="lv-muted">
          {t.limit} · {t.hair}
        </p>
      </div>
      <p className="lv-subtitle">{t.fineShare}</p>
      <div className="lv-bars">
        {sites.map((site) => (
          <div key={`${site.pair.id}-${site.body}`} className="lv-bars__row">
            <span className="lv-bars__name">
              <BodyDot body={site.body} />
              {site.name}
            </span>
            <span className="lv-bars__track" aria-hidden="true">
              <span className={`lv-bars__fill lv-bars__fill--${site.body}`} style={{ width: `${Math.min(1, site.side.value) * 100}%` }} />
            </span>
            <span className="lv-bars__value">
              {number(site.side.value, 3)} ({percent(site.side.value)})
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Cráteres                                                            */
/* ------------------------------------------------------------------ */

function profilePath(ratio: number, hill: boolean): string {
  // Ancho fijo de 200; la profundidad o altura es ratio · 200 (proporción real).
  const w = 200;
  const h = ratio * w;
  const base = 70;
  if (hill) return `M 0 ${base} C ${w * 0.25} ${base} ${w * 0.3} ${base - h} ${w * 0.5} ${base - h} C ${w * 0.7} ${base - h} ${w * 0.75} ${base} ${w} ${base}`;
  const rim = 6;
  return `M 0 ${base} L ${w * 0.08} ${base - rim} Q ${w * 0.5} ${base - rim + 2 * (h + rim)} ${w * 0.92} ${base - rim} L ${w} ${base}`;
}

function CraterProfile({ pairs }: VisualProps) {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const t = v.crater;
  const { number } = useAnalogText();
  const sites = useSiteValues(pairs, 'craters');
  const missing = pairs.filter((pair) => !isComparable(pairAxis(pair, 'craters')));
  const alt = t.alt(sites.map((site) => t.item(site.name, number(site.side.value, 3))).join('; '));
  return (
    <Figure title={t.title} alt={alt} foot={<p>{t.note} {v.fromBackend}</p>}>
      <ul className="lv-profiles">
        {sites.map((site) => {
          const hill = Boolean(site.side.method?.includes('h/D'));
          const facts = site.body === 'earth' ? site.pair.data.earth_site.facts : site.pair.data.moon_site.facts;
          const depth = facts.depth_m;
          const diameter = facts.diameter_m;
          return (
            <li key={`${site.pair.id}-${site.body}`} className="lv-profile">
              <svg viewBox="-4 -10 208 150" role="img" aria-label={t.item(site.name, number(site.side.value, 3))}>
                <path d={`${profilePath(site.side.value, hill)} L 200 140 L 0 140 Z`} className={`lv-profile__fill lv-profile__fill--${site.body}`} />
                <path d={profilePath(site.side.value, hill)} className="lv-profile__line" />
              </svg>
              <p className="lv-waffle__label">
                <BodyDot body={site.body} />
                {site.name}
              </p>
              <p className="lv-waffle__value">{t.ratio(hill ? 'h/D' : 'd/D', number(site.side.value, 3))}</p>
              {depth !== undefined && diameter !== undefined ? (
                <p className="lv-muted">
                  {t.realSize}: {t.meters(number(depth, 0), number(diameter, 0))}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {missing.length > 0 ? (
        <p className="lv-muted">
          {missing.map((pair) => getPairLabels(pair, language).short).join(' · ')}: {v.noComparable}
        </p>
      ) : null}
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Relieve 3D                                                          */
/* ------------------------------------------------------------------ */

function TerrainVisual() {
  const { language } = useI18n();
  const v = LESSON_VISUALS_TEXT[language];
  const { t, number } = useAnalogText();
  const { grid } = getMissionSite('el-elegante');
  const widthKm = number(((grid.size - 1) * grid.step) / 1000, 1);
  return (
    <Figure title={v.terrain.title} foot={<p>{v.terrain.only}</p>}>
      <div className="lv-terrain">
        <ErrorBoundary fallbackMessage={t.model3d.error}>
          <Suspense fallback={<p className="pg-state">{t.mapLoading}</p>}>
            <Terrain3D
              siteId="el-elegante"
              label={t.model3d.label('El Elegante')}
              hint={t.model3d.hint(widthKm, String(TERRAIN_EXAGGERATION))}
              rotateLeftLabel={t.model3d.rotateLeft}
              rotateRightLabel={t.model3d.rotateRight}
              errorText={t.model3d.error}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Figure>
  );
}

/** Figura contextual de un bloque de lección. */
export function LessonVisual({ kind, pairs }: { kind: LessonVisualKind; pairs: readonly AnalogPair[] }) {
  switch (kind) {
    case 'slope-ramp':
      return <SlopeRamp />;
    case 'slope-waffle':
      return <SlopeWaffle pairs={pairs} />;
    case 'radar-scatter':
      return <RadarScatter pairs={pairs} />;
    case 'felsic-mafic':
      return <FelsicMafic pairs={pairs} />;
    case 'albedo-swatches':
      return <AlbedoSwatches pairs={pairs} />;
    case 'thermal-bars':
      return <ThermalBars pairs={pairs} />;
    case 'ndvi-bands':
      return <NdviBands pairs={pairs} />;
    case 'ice-section':
      return <IceSection pairs={pairs} />;
    case 'grain-sizes':
      return <GrainSizes pairs={pairs} />;
    case 'crater-profile':
      return <CraterProfile pairs={pairs} />;
    case 'terrain-3d':
      return <TerrainVisual />;
  }
}
