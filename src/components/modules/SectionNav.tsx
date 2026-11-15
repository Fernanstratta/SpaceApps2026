import { useMessages } from '../../i18n/I18nContext';

export interface SectionLink {
  id: string;
  label: string;
}

/** "En esta página" jump links. Wraps on small screens; no hover needed. */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const { UI } = useMessages();
  return (
    <nav className="section-nav" aria-label={UI.onThisPage}>
      <p className="section-nav__title">{UI.onThisPage}</p>
      <ul className="section-nav__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
