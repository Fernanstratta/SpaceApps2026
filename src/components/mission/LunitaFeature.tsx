import { useLunitaMissionText } from '../../i18n/missions';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import { EarthMapArt, LunitaShape } from '../lunita/LunitaArt';

/**
 * Entrada de la misión 4Kids en el Portal Educativo, justo debajo de la
 * misión de 12–17 años: distintivo «4Kids», edades, título y «Jugar misión».
 */
export function LunitaFeature() {
  const t = useLunitaMissionText();
  return (
    <section className="lunita-feature" aria-labelledby="lunita-feature-title">
      <figure className="lunita-feature__media">
        <svg viewBox="0 0 600 360" role="img" aria-label={t.meta.artAlt}>
          <EarthMapArt />
          <g transform="translate(118 140) scale(2.2)">
            <LunitaShape />
          </g>
        </svg>
        <figcaption className="lunita-tag">{t.meta.illustrative}</figcaption>
      </figure>
      <div className="lunita-feature__body">
        <p className="lunita-feature__badges">
          <span className="lunita-badge">{t.meta.badge}</span>
          <span className="lunita-ages">{t.meta.ages}</span>
        </p>
        <h2 id="lunita-feature-title" className="lunita-feature__title">
          {t.meta.title}
        </h2>
        <p className="lunita-feature__lead">{t.meta.lead}</p>
        <Link to={ROUTES.lunita} className="button lunita-button lunita-button--play">
          <span aria-hidden="true">▶</span> {t.meta.cta}
        </Link>
      </div>
    </section>
  );
}
