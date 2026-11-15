import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_LANGUAGE, type Language } from '../i18n/config';
import { localizePath, parsePath } from '../i18n/paths';
import { stripBase, toHref } from './base';

/**
 * Minimal client-side router based on the History API.
 * Kept dependency-free on purpose; it can be replaced by React Router later
 * without touching pages, since pages only use `Link`, `NavLink`,
 * `useRouter` and `matchPath`.
 *
 * Language-aware: public URLs carry a language prefix (`/es/...`, `/en/...`)
 * and translated slugs, but pages and links only deal with internal,
 * language-neutral paths (`/portal-educativo/gravity`). The router adds and
 * removes the prefix. URLs without a prefix are rewritten once, before React
 * mounts, by `i18n/bootstrap.ts`.
 */

interface Location {
  /** Internal path, without language prefix. */
  path: string;
  language: Language;
}

function readLocation(): Location {
  const parsed = parsePath(stripBase(window.location.pathname));
  return { path: parsed.path, language: parsed.language ?? DEFAULT_LANGUAGE };
}

interface RouterContextValue {
  /** Internal path of the current page (no language prefix). */
  path: string;
  /** Language taken from the URL prefix. */
  language: Language;
  /** Navigates to an internal path (optionally with `#hash`) in the current language. */
  navigate: (to: string, options?: { replace?: boolean }) => void;
  /** Same page in another language, keeping `?query` and `#hash`. */
  switchLanguage: (language: Language) => void;
  /** Public `href` of an internal path, in the current or the given language. */
  href: (to: string, language?: Language) => string;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const href = useCallback(
    (to: string, language: Language = location.language) => {
      const [pathname, hash] = to.split('#');
      return toHref(localizePath(pathname || '/', language)) + (hash ? `#${hash}` : '');
    },
    [location.language],
  );

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      const url = href(to);
      if (options?.replace) window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
      setLocation({ path: parsePath(to.split('#')[0] || '/').path, language: location.language });
    },
    [href, location.language],
  );

  const switchLanguage = useCallback(
    (language: Language) => {
      if (language === location.language) return;
      const url = toHref(localizePath(location.path, language)) + window.location.search + window.location.hash;
      window.history.pushState(null, '', url);
      setLocation({ path: location.path, language });
    },
    [location.path, location.language],
  );

  const value = useMemo(
    () => ({ path: location.path, language: location.language, navigate, switchLanguage, href }),
    [location.path, location.language, navigate, switchLanguage, href],
  );
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used inside <RouterProvider>');
  return context;
}

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

/** Matches patterns like `/portal-educativo/:topicId`. Returns params or null. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = normalize(pattern).split('/');
  const pathParts = normalize(path).split('/');
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i] ?? '';
    const actual = pathParts[i] ?? '';
    if (expected.startsWith(':')) {
      if (!actual) return null;
      try {
        params[expected.slice(1)] = decodeURIComponent(actual);
      } catch {
        return null; // Malformed URL (e.g. a stray "%"): treat as no match → Not Found page.
      }
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}
