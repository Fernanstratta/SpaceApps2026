import { Link } from '../../router/Link';
import { NAV_ITEMS, navItemKey } from '../navigation/navItems';
import { SectionLink } from '../navigation/SectionLink';
import { useMessages } from '../../i18n/I18nContext';

export function SiteFooter() {
  const { UI, NAV_LABELS } = useMessages();
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
                  <SectionLink sectionId={item.sectionId}>{NAV_LABELS[item.label]}</SectionLink>
                ) : (
                  <Link to={item.to}>{NAV_LABELS[item.label]}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
