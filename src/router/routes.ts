import type { TopicId } from '../types';

/** Central list of URL paths. User-facing slugs are in Spanish. */
export const ROUTES = {
  home: '/',
  portal: '/portal-educativo',
  topic: (topicId: TopicId) => `/portal-educativo/${topicId}`,
  submodule: (topicId: TopicId, submoduleId: string) => `/portal-educativo/${topicId}/${submoduleId}`,
} as const;

export const TOPIC_ROUTE_PATTERN = '/portal-educativo/:topicId';
export const SUBMODULE_ROUTE_PATTERN = '/portal-educativo/:topicId/:submoduleId';

/**
 * Sections of the single-page Inicio. These ids are used as anchors
 * (`/#sobre-nosotros`) and by the navigation's smooth scrolling.
 */
export const SECTION_IDS = {
  home: 'inicio',
  about: 'sobre-nosotros',
  resources: 'recursos',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Old standalone pages now live on Inicio; their URLs redirect to the section. */
export const LEGACY_SECTION_ROUTES: Record<string, SectionId> = {
  '/sobre-nosotros': SECTION_IDS.about,
  '/recursos': SECTION_IDS.resources,
};

/** URL of a section of Inicio. Inicio itself is just `/` (top of the page). */
export function sectionHref(id: SectionId): string {
  return id === SECTION_IDS.home ? ROUTES.home : `${ROUTES.home}#${id}`;
}
