import { UI } from '../../content/strings';
import { Link } from '../../router/Link';
import { NAV_ITEMS, navItemKey } from '../navigation/navItems';
import { SectionLink } from '../navigation/SectionLink';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">{UI.siteName}</p>
          <p className="site-footer__tagline">{UI.tagline}</p>
        </div>
        <nav aria-label={UI.footerNavLabel}>
          <ul className="site-footer__links">
            {NAV_ITEMS.map((item) => (
              <li key={navItemKey(item)}>
                {item.kind === 'section' ? (
                  <SectionLink sectionId={item.sectionId}>{item.label}</SectionLink>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
