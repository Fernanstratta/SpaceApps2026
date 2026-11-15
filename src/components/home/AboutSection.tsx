import { Link } from '../../router/Link';
import { ROUTES, SECTION_IDS } from '../../router/routes';
import { useMessages } from '../../i18n/I18nContext';

/** Estilos de la sección, incluidos aquí para no depender de un archivo .css aparte. */
const ABOUT_STYLES = `
/*
 * Paleta "espacio": continúa el negro del hero y toma un color de cada cuerpo
 * del planeta giratorio (azul Tierra, plata Luna, óxido Marte), más el dorado
 * del botón principal.
 */
:root {
  --space-bg: #05070d; /* negro espacial, casi igual al hero */
  --space-bg-raised: #0d1220; /* fondo de tarjetas */
  --space-border: rgba(255, 255, 255, 0.09);
  --space-text: #eef1f7; /* texto principal */
  --space-text-muted: #a7b0c4; /* texto secundario, plata Luna */
  --space-gold: #f2b33d; /* acento y botón principal */
  --space-gold-ink: #1b1403; /* texto sobre dorado */
  --space-earth: #4f9cf9; /* azul Tierra */
  --space-mars: #e2714a; /* óxido Marte */
  --space-moon: #c9ced8; /* plata Luna */
}

.about {
  position: relative;
  padding: 96px 0;
  color: var(--space-text);
  /* Negro arriba para unirse al hero, con un resplandor azul muy tenue */
  background:
    radial-gradient(60% 50% at 85% 0%, rgba(79, 156, 249, 0.1), transparent 70%),
    linear-gradient(180deg, #000 0%, var(--space-bg) 30%);
}

.about__eyebrow {
  margin: 0 0 12px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--space-gold);
}

.about__title {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}

.about__lead {
  margin: 0 0 48px;
  max-width: 60ch;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--space-text-muted);
}

.about__subtitle {
  margin: 64px 0 20px;
  font-size: 1.5rem;
}

.about__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* Tarjeta base */
.about-card {
  --card-accent: var(--space-moon);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  background: var(--space-bg-raised);
  border: 1px solid var(--space-border);
  border-radius: 16px;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.about-card:hover {
  border-color: color-mix(in srgb, var(--card-accent) 55%, transparent);
  transform: translateY(-2px);
}

.about-card--earth {
  --card-accent: var(--space-earth);
}

.about-card--mars {
  --card-accent: var(--space-mars);
}

.about-card--gold {
  --card-accent: var(--space-gold);
}

/* "Planeta" pequeño que identifica cada tarjeta por su color */
.about-card__planet {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 30%,
    color-mix(in srgb, var(--card-accent) 70%, #fff),
    var(--card-accent) 45%,
    color-mix(in srgb, var(--card-accent) 35%, #000) 100%
  );
  box-shadow: 0 0 24px color-mix(in srgb, var(--card-accent) 35%, transparent);
}

.about-card__title {
  margin: 4px 0 0;
  font-size: 1.25rem;
  line-height: 1.3;
}

.about-card__audience {
  color: var(--card-accent);
}

.about-card__text {
  margin: 0;
  line-height: 1.65;
  color: var(--space-text-muted);
}

/* Botón principal: el mismo dorado del hero */
.about__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding: 14px 28px;
  border-radius: 999px;
  background: var(--space-gold);
  color: var(--space-gold-ink);
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.about__cta:hover {
  background: #ffc75a;
  transform: translateY(-1px);
}

.about__cta:focus-visible {
  outline: 3px solid var(--space-earth);
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .about {
    padding: 64px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-card,
  .about__cta {
    transition: none;
  }

  .about-card:hover,
  .about__cta:hover {
    transform: none;
  }
}
`;

/**
 * Color de cada tarjeta (los textos están en `i18n/messages`, en el mismo orden).
 */
const FEATURE_ACCENTS = ['gold', 'moon'] as const;
const VIEW_ACCENTS = ['earth', 'mars'] as const;

/** "¿Qué es Starman?": continúa el tema oscuro del hero con los colores de los planetas. */
export function AboutSection() {
  const { ABOUT } = useMessages();
  return (
    <section id={SECTION_IDS.about} className="about" aria-labelledby="about-title">
      <style>{ABOUT_STYLES}</style>
      <div className="container">
        <p className="about__eyebrow">{ABOUT.eyebrow}</p>
        <h2 id="about-title" className="about__title" data-section-heading>
          {ABOUT.title}
        </h2>
        <p className="about__lead">{ABOUT.lead}</p>

        <div className="about__grid">
          {ABOUT.features.map((feature, index) => (
            <article key={feature.title} className={`about-card about-card--${FEATURE_ACCENTS[index] ?? 'gold'}`}>
              <span className="about-card__planet" aria-hidden="true" />
              <h3 className="about-card__title">{feature.title}</h3>
              <p className="about-card__text">{feature.text}</p>
            </article>
          ))}
        </div>

        <h3 className="about__subtitle">{ABOUT.viewsTitle}</h3>
        <div className="about__grid">
          {ABOUT.views.map((view, index) => (
            <article key={view.title} className={`about-card about-card--${VIEW_ACCENTS[index] ?? 'earth'}`}>
              <span className="about-card__planet" aria-hidden="true" />
              <h4 className="about-card__title">
                {view.title} <span className="about-card__audience">· {view.audience}</span>
              </h4>
              <p className="about-card__text">{view.text}</p>
            </article>
          ))}
        </div>

        <Link to={ROUTES.portalAccess} className="about__cta">
          {ABOUT.cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}