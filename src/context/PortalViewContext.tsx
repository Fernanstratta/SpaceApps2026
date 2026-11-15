import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from '../router/Router';
import { ROUTES } from '../router/routes';

/**
 * The two views of every topic and submodule: "Aprender" (students) and
 * "Enseñar" (teachers). The choice is made on the Portal's entry screen
 * (`RoleSelectPage`), can be changed at any time with `PortalViewSwitch`
 * (side menu, submodule sidebar, portal and topic pages), is shared by every
 * portal page, kept for the browser session and reflected in the URL
 * (`?vista=ensenar`) so a view can be shared. This is a local interface
 * choice, not a login.
 */
export type PortalView = 'learn' | 'teach';

export const PORTAL_VIEWS: PortalView[] = ['learn', 'teach'];

const QUERY_KEY = 'vista';
const QUERY_VALUE: Record<PortalView, string> = { learn: 'aprender', teach: 'ensenar' };
const STORAGE_KEY = 'starman:vista';

function readStoredView(): PortalView | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored === 'learn' || stored === 'teach' ? stored : null;
  } catch {
    return null;
  }
}

function storeView(view: PortalView): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, view);
  } catch {
    // Storage can be unavailable (private mode); the URL still keeps the view.
  }
}

function readUrlView(): PortalView | null {
  const fromUrl = new URLSearchParams(window.location.search).get(QUERY_KEY);
  if (fromUrl === QUERY_VALUE.teach) return 'teach';
  if (fromUrl === QUERY_VALUE.learn) return 'learn';
  return null;
}

/**
 * Portal pages whose content depends on the view: the main portal page, topics
 * and submodules. Missions have their own student/teacher routes and the entry
 * screen is where the view is chosen.
 */
function isViewAwarePath(path: string): boolean {
  if (path === ROUTES.portal) return true;
  return (
    path.startsWith(`${ROUTES.portal}/`) && !path.startsWith(`${ROUTES.portal}/mision/`) && path !== ROUTES.portalAccess
  );
}

export interface PortalViewContextValue {
  view: PortalView;
  /** False until a view is chosen in this session (entry screen, switch or a `?vista=` link). */
  hasChosenView: boolean;
  setView: (view: PortalView) => void;
}

export const PortalViewContext = createContext<PortalViewContextValue | null>(null);

export function PortalViewProvider({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  const [initial] = useState(() => {
    const fromUrl = readUrlView();
    const stored = readStoredView();
    return { view: fromUrl ?? stored ?? 'learn', chosen: fromUrl !== null || stored !== null };
  });
  const [view, setViewState] = useState<PortalView>(initial.view);
  const [hasChosenView, setHasChosenView] = useState(initial.chosen);

  const setView = useCallback((next: PortalView) => {
    setViewState(next);
    setHasChosenView(true);
    storeView(next);
  }, []);

  // Keep `?vista=ensenar` on the portal, topic and submodule pages (the router
  // drops the query string when navigating), and nowhere else.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (isViewAwarePath(path) && view === 'teach') url.searchParams.set(QUERY_KEY, QUERY_VALUE.teach);
    else url.searchParams.delete(QUERY_KEY);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  }, [path, view]);

  const value = useMemo(() => ({ view, hasChosenView, setView }), [view, hasChosenView, setView]);
  return <PortalViewContext.Provider value={value}>{children}</PortalViewContext.Provider>;
}
