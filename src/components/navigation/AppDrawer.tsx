import { useEffect, useRef, type ReactNode } from 'react';
import { useMessages } from '../../i18n/I18nContext';
import { Link, NavLink } from '../../router/Link';
import { ROUTES, SECTION_IDS } from '../../router/routes';
import {
  BookIcon,
  ChartIcon,
  CloseIcon,
  CompassIcon,
  GlobeIcon,
  HelpIcon,
  HomeIcon,
  InfoIcon,
  StarIcon,
  UserIcon,
} from '../common/Icons';
import { BrandMark } from '../layout/BrandMark';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SectionLink } from './SectionLink';
import { ThemeSwitch } from './ThemeControls';

interface AppDrawerProps {
  open: boolean;
  /** Cierre "explícito" (Escape, fondo, botón X): devuelve el foco al botón ☰. */
  onClose: () => void;
  /** Cierre tras elegir un enlace: el destino gestiona el foco. */
  onNavigate: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Menú lateral (☰): cuenta, navegación, espacio personal, preferencias y soporte. */
export function AppDrawer({ open, onClose, onNavigate }: AppDrawerProps) {
  const { UI, NAV_LABELS, DRAWER } = useMessages();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    // Evita que la página de fondo se desplace mientras el menú está abierto.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      // Mantiene el foco del teclado dentro del panel.
      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return (
    <div className={`drawer${open ? ' is-open' : ''}`} inert={!open}>
      <div className="drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        id="app-drawer"
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer__head">
          <span className="drawer__brand">
            <BrandMark />
            <span id="drawer-title">{UI.siteName}</span>
          </span>
          <button type="button" className="icon-button" onClick={onClose} aria-label={UI.closeMenu}>
            <CloseIcon />
          </button>
        </div>

        <div className="drawer__body">
          <section className="drawer-account" aria-label={DRAWER.accountLabel}>
            <div className="drawer-account__info">
              <span className="drawer-account__avatar">
                <UserIcon />
              </span>
              <div>
                <p className="drawer-account__name">{DRAWER.guest}</p>
                <p className="drawer-account__hint">{DRAWER.guestHint}</p>
              </div>
            </div>
            <div className="drawer-account__actions">
              <Link to={ROUTES.login} className="button button--primary button--small" onClick={onNavigate}>
                {DRAWER.signIn}
              </Link>
              <Link to={ROUTES.register} className="button button--ghost button--small" onClick={onNavigate}>
                {DRAWER.signUp}
              </Link>
            </div>
          </section>

          <DrawerGroup id="nav" title={DRAWER.navigation}>
            <li>
              <SectionLink sectionId={SECTION_IDS.home} className="drawer-item" onClick={onNavigate}>
                <HomeIcon />
                {NAV_LABELS.home}
              </SectionLink>
            </li>
            <li>
              <SectionLink sectionId={SECTION_IDS.about} className="drawer-item" onClick={onNavigate}>
                <InfoIcon />
                {NAV_LABELS.about}
              </SectionLink>
            </li>
            <li>
              <SectionLink sectionId={SECTION_IDS.resources} className="drawer-item" onClick={onNavigate}>
                <BookIcon />
                {NAV_LABELS.resources}
              </SectionLink>
            </li>
            <li>
              <NavLink to={ROUTES.portal} className="drawer-item" onClick={onNavigate}>
                <CompassIcon />
                {NAV_LABELS.portal}
              </NavLink>
            </li>
          </DrawerGroup>

          <DrawerGroup id="space" title={DRAWER.mySpace}>
            <SoonItem icon={<ChartIcon />} label={DRAWER.progress} badge={DRAWER.soon} />
            <SoonItem icon={<StarIcon />} label={DRAWER.favorites} badge={DRAWER.soon} />
          </DrawerGroup>

          <section className="drawer-group" aria-labelledby="drawer-prefs">
            <h2 id="drawer-prefs" className="drawer-group__title">
              {DRAWER.preferences}
            </h2>
            <p className="drawer-setting__label">{DRAWER.theme}</p>
            <ThemeSwitch />
            <div className="drawer-setting">
              <span className="drawer-setting__name">
                <GlobeIcon />
                {DRAWER.language}
              </span>
              <LanguageSwitcher />
            </div>
          </section>

          <DrawerGroup id="support" title={DRAWER.support}>
            <SoonItem icon={<HelpIcon />} label={DRAWER.helpCenter} badge={DRAWER.soon} />
          </DrawerGroup>
        </div>

        <p className="drawer__foot">© 2026 {UI.siteName} · {UI.tagline}</p>
      </div>
    </div>
  );
}

function DrawerGroup({ id: groupId, title, children }: { id: string; title: string; children: ReactNode }) {
  const id = `drawer-group-${groupId}`;
  return (
    <section className="drawer-group" aria-labelledby={id}>
      <h2 id={id} className="drawer-group__title">
        {title}
      </h2>
      <ul className="drawer-group__list">{children}</ul>
    </section>
  );
}

/** Opción todavía no disponible: visible para mostrar lo que viene, pero no navegable. */
function SoonItem({ icon, label, badge }: { icon: ReactNode; label: string; badge: string }) {
  return (
    <li>
      <span className="drawer-item drawer-item--soon" aria-disabled="true">
        {icon}
        {label}
        <span className="drawer-item__badge">{badge}</span>
      </span>
    </li>
  );
}
