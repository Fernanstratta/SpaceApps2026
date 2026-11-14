function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scrolls to a section of the current page. The fixed header offset comes
 * from CSS (`scroll-padding-top` on <html>), which `scrollIntoView` honors.
 * Focus moves to the section heading so keyboard and screen-reader users
 * continue reading from the new position.
 */
export function scrollToSection(id: string, options: { smooth?: boolean; focus?: boolean } = {}): boolean {
  const { smooth = true, focus = true } = options;
  const target = document.getElementById(id);
  if (!target) return false;

  const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
  if (target.dataset.scrollTop === 'true') {
    window.scrollTo({ top: 0, behavior });
  } else {
    target.scrollIntoView({ behavior, block: 'start' });
  }

  if (focus) {
    const heading = target.querySelector<HTMLElement>('[data-section-heading]') ?? target;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  return true;
}

/** Reads the section id from the URL hash; malformed hashes are ignored. */
export function readHashId(): string | null {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}
