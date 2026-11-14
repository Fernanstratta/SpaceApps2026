import { useCallback } from 'react';
import { toHref, useRouter } from '../router/Router';
import { ROUTES, sectionHref, type SectionId } from '../router/routes';
import { scrollToSection } from '../utils/scroll';

/**
 * Returns a function that brings the user to a section of Inicio.
 *  - Already on Inicio: smooth-scrolls without reloading; the URL hash is
 *    updated with `replaceState` so it doesn't pile up history entries.
 *  - On another page (e.g. the portal): navigates to `/#section`; the
 *    Inicio page scrolls to the section once it renders.
 */
export function useSectionNavigation() {
  const { path, navigate } = useRouter();

  return useCallback(
    (id: SectionId) => {
      if (path !== ROUTES.home) {
        navigate(sectionHref(id));
        return;
      }
      scrollToSection(id);
      const url = toHref(sectionHref(id));
      if (window.location.pathname + window.location.hash !== url) {
        window.history.replaceState(null, '', url);
      }
    },
    [path, navigate],
  );
}
