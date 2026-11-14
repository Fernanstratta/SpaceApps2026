import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useSectionNavigation } from '../../hooks/useSectionNavigation';
import { toHref } from '../../router/Router';
import { sectionHref, type SectionId } from '../../router/routes';

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  sectionId: SectionId;
};

/**
 * Native anchor to a section of Inicio (`/#recursos`). Plain clicks are
 * intercepted to smooth-scroll without a page load; modified clicks
 * (new tab, etc.) keep normal browser behavior.
 */
export function SectionLink({ sectionId, onClick, ...rest }: SectionLinkProps) {
  const goToSection = useSectionNavigation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    goToSection(sectionId);
  };

  return <a href={toHref(sectionHref(sectionId))} onClick={handleClick} {...rest} />;
}
