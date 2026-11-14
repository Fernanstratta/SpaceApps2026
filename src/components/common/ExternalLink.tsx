import type { AnchorHTMLAttributes } from 'react';
import { UI } from '../../content/strings';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Link to an external site, opened in a new tab with an accessible hint. */
export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
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
