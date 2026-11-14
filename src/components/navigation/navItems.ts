import { NAV_LABELS } from '../../content/strings';
import { ROUTES, SECTION_IDS, type SectionId } from '../../router/routes';

/**
 * Navigation entries. `section` items scroll within Inicio;
 * `route` items navigate to another page. `cta` marks the primary action.
 */
export type NavItem =
  | { kind: 'section'; sectionId: SectionId; label: string }
  | { kind: 'route'; to: string; label: string; cta?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { kind: 'section', sectionId: SECTION_IDS.home, label: NAV_LABELS.home },
  { kind: 'section', sectionId: SECTION_IDS.about, label: NAV_LABELS.about },
  { kind: 'section', sectionId: SECTION_IDS.resources, label: NAV_LABELS.resources },
  { kind: 'route', to: ROUTES.portal, label: NAV_LABELS.portal, cta: true },
];

export const SECTION_NAV_IDS = NAV_ITEMS.flatMap((item) => (item.kind === 'section' ? [item.sectionId] : []));

export function navItemKey(item: NavItem): string {
  return item.kind === 'section' ? `section:${item.sectionId}` : `route:${item.to}`;
}
