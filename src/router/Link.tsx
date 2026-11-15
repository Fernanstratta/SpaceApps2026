import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useRouter } from './Router';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

/** Internal navigation link. Falls back to normal browser behavior on modified clicks. */
export function Link({ to, onClick, target, ...rest }: LinkProps) {
  const { navigate, href } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedClick(event) || (target && target !== '_self')) return;
    event.preventDefault();
    navigate(to);
  };

  return <a href={href(to)} onClick={handleClick} target={target} {...rest} />;
}

type NavLinkProps = LinkProps & {
  /** When true, only an exact path match counts as active. */
  end?: boolean;
  /**
   * Path whose section makes the link active, when it differs from `to`
   * (e.g. «Portal Educativo» opens the entry screen but is active on every
   * portal page).
   */
  match?: string;
};

/** Link that exposes `aria-current="page"` when its route is active. */
export function NavLink({ to, end = false, match, className, ...rest }: NavLinkProps) {
  const { path } = useRouter();
  const base = match ?? to;
  const isActive = end || base === '/' ? path === base : path === base || path.startsWith(`${base}/`);
  const classes = [className, isActive ? 'is-active' : null].filter(Boolean).join(' ');

  return (
    <Link
      to={to}
      className={classes || undefined}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    />
  );
}
