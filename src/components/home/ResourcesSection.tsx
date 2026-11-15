import { SECTION_IDS } from '../../router/routes';
import { ResourceCategorySection } from '../resources/ResourceCategorySection';
import { useMessages, useData } from '../../i18n/I18nContext';

/** "Recursos" section of Inicio (formerly its own page). */
export function ResourcesSection() {
  const { RESOURCE_TEXT } = useMessages();
  const { getResourcesByCategory, resourceCategories } = useData();
  return (
    <section id={SECTION_IDS.resources} className="home-band home-band--resources" aria-labelledby="recursos-titulo">
      <div className="container">
        <h2 id="recursos-titulo" className="band-title" data-section-heading>
          {RESOURCE_TEXT.title}
        </h2>
        <p className="band-lead">{RESOURCE_TEXT.intro}</p>
        <nav className="chip-nav" aria-label={RESOURCE_TEXT.categoriesNav}>
          <ul>
            {resourceCategories.map((category) => (
              <li key={category.id}>
                <a href={`#${category.id}`} className="chip">
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {resourceCategories.map((category) => (
          <ResourceCategorySection
            key={category.id}
            category={category}
            resources={getResourcesByCategory(category.id)}
          />
        ))}
      </div>
    </section>
  );
}
