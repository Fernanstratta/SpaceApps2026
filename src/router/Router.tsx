import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Minimal client-side router based on the History API.
 * Kept dependency-free on purpose; it can be replaced by React Router later
 * without touching pages, since pages only use `Link`, `NavLink`,
 * `useRouter` and `matchPath`.
 */

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname || '/';
}

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function toHref(path: string): string {
  return `${BASE}${path}`;
}

interface RouterContextValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalize(stripBase(window.location.pathname)));

  useEffect(() => {
    const onPopState = () => setPath(normalize(stripBase(window.location.pathname)));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const [pathname, hash] = to.split('#');
    const target = normalize(pathname || '/');
    const url = toHref(target) + (hash ? `#${hash}` : '');
    if (options?.replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
    setPath(target);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used inside <RouterProvider>');
  return context;
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
