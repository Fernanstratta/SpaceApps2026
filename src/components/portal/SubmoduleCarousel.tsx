import { useCallback, useEffect, useRef, useState } from 'react';
import type { PortalView } from '../../context/PortalViewContext';
import type { Submodule } from '../../types';
import { Chevron } from '../common/Chevron';
import { SubmoduleCard } from './SubmoduleCard';
import { useMessages } from '../../i18n/I18nContext';

interface SubmoduleCarouselProps {
  submodules: Submodule[];
  label: string;
  view: PortalView;
  /** Id of the submodule being read, highlighted and scrolled into view. */
  currentId?: string;
  getMeta?: (submodule: Submodule) => string | null;
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Submodule cards in a swipeable row. The ‹ › buttons appear only when the
 * cards do not fit; touch, trackpad and keyboard (Tab) scrolling always work.
 */
export function SubmoduleCarousel({ submodules, label, view, currentId, getMeta }: SubmoduleCarouselProps) {
  const { MODULE_TEXT } = useMessages();
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ overflow: false, atStart: true, atEnd: true });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setEdges({ overflow: maxScroll > 4, atStart: track.scrollLeft <= 4, atEnd: track.scrollLeft >= maxScroll - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(track);
    return () => {
      track.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [measure, submodules.length]);

  // Bring the current card into view without moving the page.
  useEffect(() => {
    const track = trackRef.current;
    const current = track?.querySelector<HTMLElement>('[data-current="true"]');
    if (!track || !current || track.scrollWidth <= track.clientWidth) return;
    const offset = current.getBoundingClientRect().left - track.getBoundingClientRect().left;
    if (offset < 0 || offset + current.offsetWidth > track.clientWidth) {
      track.scrollLeft += offset - 4;
      measure();
    }
  }, [currentId, measure]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className={`sub-carousel${edges.overflow ? ' sub-carousel--overflow' : ''}`}>
      {edges.overflow ? (
        <button
          type="button"
          className="sub-carousel__arrow sub-carousel__arrow--prev"
          onClick={() => scrollByPage(-1)}
          disabled={edges.atStart}
          aria-label={MODULE_TEXT.carouselPrevious}
        >
          <Chevron direction="left" />
        </button>
      ) : null}
      <ul ref={trackRef} className="sub-row sub-row--detailed" aria-label={label}>
        {submodules.map((submodule) => {
          const isCurrent = submodule.id === currentId;
          return (
            <li key={submodule.id} data-current={isCurrent || undefined}>
              <SubmoduleCard submodule={submodule} view={view} current={isCurrent} meta={getMeta?.(submodule) ?? null} />
            </li>
          );
        })}
      </ul>
      {edges.overflow ? (
        <button
          type="button"
          className="sub-carousel__arrow sub-carousel__arrow--next"
          onClick={() => scrollByPage(1)}
          disabled={edges.atEnd}
          aria-label={MODULE_TEXT.carouselNext}
        >
          <Chevron direction="right" />
        </button>
      ) : null}
    </div>
  );
}
