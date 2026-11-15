import type { Messages } from '../../i18n/messages/es';
import { ROUTES, SECTION_IDS, type SectionId } from '../../router/routes';

/** Clave del texto en `NAV_LABELS` (se traduce al pintar). */
export type NavLabelKey = keyof Messages['NAV_LABELS'];

/**
 * Navigation entries. `section` items scroll within Inicio;
 * `route` items navigate to another page. `cta` marks the primary action.
 */
export type NavItem =
  | { kind: 'section'; sectionId: SectionId; label: NavLabelKey }
  | { kind: 'route'; to: string; label: NavLabelKey; cta?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { kind: 'section', sectionId: SECTION_IDS.home, label: 'home' },
  { kind: 'section', sectionId: SECTION_IDS.about, label: 'about' },
  { kind: 'section', sectionId: SECTION_IDS.resources, label: 'resources' },
  { kind: 'route', to: ROUTES.portal, label: 'portal', cta: true },
];

export const SECTION_NAV_IDS = NAV_ITEMS.flatMap((item) => (item.kind === 'section' ? [item.sectionId] : []));

export function navItemKey(item: NavItem): string {
  return item.kind === 'section' ? `section:${item.sectionId}` : `route:${item.to}`;
}
