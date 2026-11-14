import { useEffect, useState } from 'react';

/**
 * Tracks which section of the page is currently being read, so the
 * navigation can mark it. A section is "active" once its top passes a line
 * one third down the viewport. Returns `null` when disabled.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom of the page the last section is the active one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        const lastPresent = [...ids].reverse().find((id) => document.getElementById(id));
        if (lastPresent) current = lastPresent;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // `key` captures the contents of `ids`.
  }, [key, enabled]);

  return active;
}
