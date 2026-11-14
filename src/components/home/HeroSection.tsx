import { HOME_CONTENT } from '../../content/home';
import { Link } from '../../router/Link';
import { ROUTES, SECTION_IDS } from '../../router/routes';
import { MoonImage } from './MoonImage';

/** Full-viewport black introduction: text on the left, the Moon on the right. */
export function HeroSection() {
  const { hero } = HOME_CONTENT;
  return (
    <section id={SECTION_IDS.home} className="hero" aria-labelledby="hero-title" data-scroll-top="true">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-title" className="hero__title" data-section-heading>
            {hero.title}
          </h1>
          <p className="hero__lead">{hero.lead}</p>
          <Link to={ROUTES.portal} className="button button--primary button--large">
            {hero.primaryCta}
          </Link>
        </div>
        <MoonImage />
      </div>
    </section>
  );
}
