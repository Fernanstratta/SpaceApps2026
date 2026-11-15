import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from '../router/Router';

/**
 * The two views of every topic and submodule: "Aprender" (students) and
 * "Enseñar" (teachers). The choice is shared by the topic and submodule pages,
 * kept for the browser session and reflected in the URL (`?vista=ensenar`) so
 * a view can be shared. This is a local interface choice, not a login.
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

function readInitialView(): PortalView {
  const fromUrl = new URLSearchParams(window.location.search).get(QUERY_KEY);
  if (fromUrl === QUERY_VALUE.teach) return 'teach';
  if (fromUrl === QUERY_VALUE.learn) return 'learn';
  return readStoredView() ?? 'learn';
}

export interface PortalViewContextValue {
  view: PortalView;
  setView: (view: PortalView) => void;
}

export const PortalViewContext = createContext<PortalViewContextValue | null>(null);

export function PortalViewProvider({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  const [view, setViewState] = useState<PortalView>(readInitialView);

  const setView = useCallback((next: PortalView) => {
    setViewState(next);
    storeView(next);
  }, []);

  // Keep `?vista=ensenar` on topic and submodule pages (the router drops the
  // query string when navigating), and nowhere else.
  useEffect(() => {
    const url = new URL(window.location.href);
    // Topic and submodule pages only (missions have their own student/teacher routes).
    const onTopicPage = path.startsWith('/portal-educativo/') && !path.startsWith('/portal-educativo/mision/');
    if (onTopicPage && view === 'teach') url.searchParams.set(QUERY_KEY, QUERY_VALUE.teach);
    else url.searchParams.delete(QUERY_KEY);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  }, [path, view]);

  const value = useMemo(() => ({ view, setView }), [view, setView]);
  return <PortalViewContext.Provider value={value}>{children}</PortalViewContext.Provider>;
}
