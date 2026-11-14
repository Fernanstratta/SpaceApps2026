import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { toHref, useRouter } from './Router';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

/** Internal navigation link. Falls back to normal browser behavior on modified clicks. */
export function Link({ to, onClick, target, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedClick(event) || (target && target !== '_self')) return;
    event.preventDefault();
    navigate(to);
  };

  return <a href={toHref(to)} onClick={handleClick} target={target} {...rest} />;
}

type NavLinkProps = LinkProps & {
  /** When true, only an exact path match counts as active. */
  end?: boolean;
};

/** Link that exposes `aria-current="page"` when its route is active. */
export function NavLink({ to, end = false, className, ...rest }: NavLinkProps) {
  const { path } = useRouter();
  const isActive = end || to === '/' ? path === to : path === to || path.startsWith(`${to}/`);
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
