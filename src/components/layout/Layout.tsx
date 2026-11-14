import { useEffect, useRef, type ReactNode } from 'react';
import { UI } from '../../content/strings';
import { useRouter } from '../../router/Router';
import { SiteHeader } from '../navigation/SiteHeader';
import { SiteFooter } from './SiteFooter';

export function Layout({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(path);

  // On client-side navigation: scroll to top and move focus to the main
  // content so screen-reader and keyboard users land on the new page.
  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [path]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        {UI.skipToContent}
      </a>
      <SiteHeader />
      <main id="contenido" ref={mainRef} tabIndex={-1} className="app-main">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
