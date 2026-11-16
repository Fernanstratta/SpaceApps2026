import { getSiteLabels } from '../../data/analogText';
import { type AnalogPair, type Body, getSite } from '../../data/lunarAnalogs';
import { formatKm, formatLatLon } from '../../utils/analogFormat';
import { useAnalogText } from '../analogs/useAnalogText';
import { ExternalLink } from '../common/ExternalLink';

/**
 * Esquema de la cara visible de la Luna con la posición de un sitio
 * (proyección ortográfica centrada en 0°, 0°; norte arriba).
 */
export function MoonLocator({ lat, lon, name }: { lat: number; lon: number; name: string }) {
  const { t } = useAnalogText();
  const r = 56;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  const visible = Math.cos(phi) * Math.cos(lambda) >= 0;
  const x = 64 + r * Math.cos(phi) * Math.sin(lambda);
  const y = 64 - r * Math.sin(phi);
  const pole = Math.abs(lat) > 80;
  return (
    <figure className="moon-locator">
      <svg viewBox="0 0 128 128" role="img" aria-label={t.site.locatorAlt(name)}>
        <circle cx="64" cy="64" r={r} className="moon-locator__disc" />
        <ellipse cx="48" cy="46" rx="16" ry="11" className="moon-locator__mare" />
        <ellipse cx="76" cy="40" rx="11" ry="9" className="moon-locator__mare" />
        <ellipse cx="82" cy="62" rx="12" ry="9" className="moon-locator__mare" />
        <ellipse cx="34" cy="64" rx="14" ry="18" className="moon-locator__mare" />
        <line x1="64" y1="8" x2="64" y2="120" className="moon-locator__grid" />
        <line x1="8" y1="64" x2="120" y2="64" className="moon-locator__grid" />
        {visible ? (
          <>
            <circle cx={x} cy={y} r="7" className="moon-locator__halo" />
            <circle cx={x} cy={y} r="3.4" className="moon-locator__point" />
          </>
        ) : null}
      </svg>
      <figcaption>
        <strong>{t.site.locatorTitle}</strong> {pole ? t.site.locatorPole : visible ? t.site.locatorNear : t.site.locatorFar}
      </figcaption>
    </figure>
  );
}

/** Ficha de un sitio: tipo, región, coordenadas, área de análisis y datos del sitio. */
export function SitePanel({ pair, body }: { pair: AnalogPair; body: Body }) {
  const { t, language, locale, number } = useAnalogText();
  const site = getSite(pair, body);
  const labels = getSiteLabels(pair, body, language);
  const facts = Object.entries(site.facts);
  const formatFact = (key: string, value: number) => {
    if (key.endsWith('_m')) return t.site.meters(number(value, 0));
    if (key === 'age_ka') return t.site.thousandYears(number(value, 0));
    if (key.endsWith('_lat') || key.endsWith('_lon')) return t.site.degrees(number(value, 4));
    return number(value, 3);
  };
  return (
    <article className={`site-panel site-panel--${body}`}>
      <p className="site-panel__body">
        <span className={`ax-card__dot ax-card__dot--${body}`} aria-hidden="true" />
        {body === 'earth' ? t.site.earth : t.site.moon}
      </p>
      <h3 className="site-panel__name">{labels.name}</h3>
      <dl className="site-panel__fields">
        <div>
          <dt>{t.site.type}</dt>
          <dd>{labels.type}</dd>
        </div>
        <div>
          <dt>{t.site.region}</dt>
          <dd>{labels.region}</dd>
        </div>
        <div>
          <dt>{t.site.coords}</dt>
          <dd>
            {formatLatLon(site.lat, site.lon, locale, t.site.dir)}{' '}
            <span className="an-badge an-badge--reference">{t.site.coordStatus[site.coordinate_status]}</span>
            {site.coordinate_source_url ? (
              <>
                {' '}
                <ExternalLink href={site.coordinate_source_url}>{t.site.coordSource}</ExternalLink>
              </>
            ) : null}
          </dd>
        </div>
        {'coordinate_method' in site && typeof site.coordinate_method === 'string' ? (
          <div>
            <dt>{t.site.coordMethod}</dt>
            <dd lang={language === 'es' ? undefined : 'es'}>{site.coordinate_method}</dd>
          </div>
        ) : null}
        <div>
          <dt>{t.site.area}</dt>
          <dd>
            {t.site.areaCircle(formatKm(site.aoi.radius_m, locale))}. {labels.aoiNote}
          </dd>
        </div>
        {facts.length > 0 ? (
          <div>
            <dt>{t.site.facts}</dt>
            <dd>
              <ul className="site-panel__facts">
                {facts.map(([key, value]) => (
                  <li key={key}>
                    {t.site.factLabels[key] ?? key}: {formatFact(key, value)}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
      {body === 'moon' ? <MoonLocator lat={site.lat} lon={site.lon} name={labels.name} /> : null}
    </article>
  );
}
