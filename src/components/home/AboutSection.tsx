import { ABOUT_CONTENT } from '../../content/about';
import { SECTION_IDS } from '../../router/routes';

/** "Sobre Nosotros" section of Inicio (formerly its own page). */
export function AboutSection() {
  return (
    <section id={SECTION_IDS.about} className="home-band home-band--about" aria-labelledby="sobre-nosotros-titulo">
      <div className="container">
        <h2 id="sobre-nosotros-titulo" className="band-title" data-section-heading>
          {ABOUT_CONTENT.title}
        </h2>
        <p className="band-lead">{ABOUT_CONTENT.lead}</p>
        <div className="about-grid">
          {ABOUT_CONTENT.sections.map((section) => (
            <article key={section.id} id={section.id} className="about-card" aria-labelledby={`${section.id}-titulo`}>
              <h3 id={`${section.id}-titulo`}>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
