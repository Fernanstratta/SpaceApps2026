import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useMessages } from '../../i18n/I18nContext';
import { NavLink } from '../../router/Link';
import { useRouter } from '../../router/Router';
import { ROUTES, SECTION_IDS } from '../../router/routes';
import { MenuIcon } from '../common/Icons';
import { BrandMark } from '../layout/BrandMark';
import { AppDrawer } from './AppDrawer';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NAV_ITEMS, navItemKey, SECTION_NAV_IDS } from './navItems';
import { SectionLink } from './SectionLink';
import { ThemeToggleButton } from './ThemeControls';

/**
 * Header fijo: botón ☰ (menú lateral con cuenta, navegación y preferencias)
 * y marca a la izquierda; navegación principal, selector ES / EN y cambio de
 * tema a la derecha. En pantallas pequeñas la navegación vive solo en el menú
 * lateral, pero ES / EN y el tema siguen visibles en el header.
 */
export function SiteHeader() {
  const { UI, NAV_LABELS } = useMessages();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { path } = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection(SECTION_NAV_IDS, path === ROUTES.home);

  // Cierra el menú cuando cambia la ruta.
  useEffect(() => {
    setDrawerOpen(false);
  }, [path]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const closeAfterNavigation = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="site-header__start">
            <button
              ref={menuButtonRef}
              type="button"
              className="icon-button menu-button"
              aria-expanded={drawerOpen}
              aria-controls="app-drawer"
              aria-label={UI.openMenu}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon size={22} />
            </button>
            <SectionLink sectionId={SECTION_IDS.home} className="brand">
              <BrandMark />
              <span className="brand__name">{UI.siteName}</span>
            </SectionLink>
          </div>

          <nav className="main-nav" aria-label={UI.mainNavLabel}>
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
                    >
                      {NAV_LABELS[item.label]}
                    </SectionLink>
                  ) : (
                    <NavLink
                      to={item.to}
                      match={item.match}
                      className={`main-nav__link${item.cta ? ' main-nav__link--cta' : ''}`}
                    >
                      {NAV_LABELS[item.label]}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__end">
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </header>
      <AppDrawer open={drawerOpen} onClose={closeDrawer} onNavigate={closeAfterNavigation} />
    </>
  );
}
