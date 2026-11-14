import { useEffect, useRef, useState } from 'react';
import { UI } from '../../content/strings';
import { useActiveSection } from '../../hooks/useActiveSection';
import { NavLink } from '../../router/Link';
import { useRouter } from '../../router/Router';
import { ROUTES, SECTION_IDS } from '../../router/routes';
import { BrandMark } from '../layout/BrandMark';
import { NAV_ITEMS, navItemKey, SECTION_NAV_IDS } from './navItems';
import { SectionLink } from './SectionLink';

/**
 * Site header with a collapsible menu on small screens.
 * Inicio / Sobre Nosotros / Recursos scroll within the home page;
 * Portal Educativo navigates to the portal and is styled as the primary CTA.
 * No hover-dependent behavior.
 */
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { path } = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection(SECTION_NAV_IDS, path === ROUTES.home);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // Close with Escape and return focus to the toggle.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Section links don't change the route, so they close the menu themselves.
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <SectionLink sectionId={SECTION_IDS.home} className="brand" onClick={closeMenu}>
          <BrandMark />
          <span className="brand__name">{UI.siteName}</span>
        </SectionLink>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="main-nav"
          aria-label={isOpen ? UI.closeMenu : UI.openMenu}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav-toggle__bar" aria-hidden="true" />
          <span className="nav-toggle__bar" aria-hidden="true" />
          <span className="nav-toggle__bar" aria-hidden="true" />
        </button>

        <nav
          id="main-nav"
          className={`main-nav${isOpen ? ' is-open' : ''}`}
          aria-label={UI.mainNavLabel}
        >
          <ul className="main-nav__list">
            {NAV_ITEMS.map((item) => (
              <li
                key={navItemKey(item)}
                className={item.kind === 'route' && item.cta ? 'main-nav__item--cta' : undefined}
              >
                {item.kind === 'section' ? (
                  <SectionLink
                    sectionId={item.sectionId}
                    className={`main-nav__link${activeSection === item.sectionId ? ' is-active' : ''}`}
                    aria-current={activeSection === item.sectionId ? 'location' : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </SectionLink>
                ) : (
                  <NavLink
                    to={item.to}
                    className={`main-nav__link${item.cta ? ' main-nav__link--cta' : ''}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
