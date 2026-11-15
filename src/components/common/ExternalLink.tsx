import { useMessages } from '../../i18n/I18nContext';
import type { AnchorHTMLAttributes } from 'react';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Link to an external site, opened in a new tab with an accessible hint. */
export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  const { UI } = useMessages();
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="visually-hidden"> {UI.externalLinkHint}</span>
      <span aria-hidden="true" className="external-icon">
        ↗
      </span>
    </a>
  );
}
