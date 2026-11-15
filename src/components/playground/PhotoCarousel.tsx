import { useState, type KeyboardEvent } from 'react';
import type { PlaygroundPhoto } from '../../data/playground';
import { ExternalLink } from '../common/ExternalLink';

/**
 * Carrusel de fotos del área activa. Cambiar de foto solo cambia la imagen
 * (no el área). El padre lo monta con `key={areaId}`, así que al cambiar de
 * área vuelve a la primera foto. Si una imagen no carga, se indica y los
 * controles siguen disponibles.
 */
export function PhotoCarousel({
  photos,
  texts,
  labels,
}: {
  photos: readonly PlaygroundPhoto[];
  texts: readonly { alt: string; caption: string }[];
  labels: { prev: string; next: string; counter: (n: number, total: number) => string; error: string; empty: string; region: string };
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const total = photos.length;

  if (total === 0) {
    return (
      <p className="pg-state" role="status">
        {labels.empty}
      </p>
    );
  }

  const photo = photos[index]!;
  const text = texts[index];
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  };

  return (
    <section className="pg-carousel" aria-roledescription="carrusel" aria-label={labels.region} onKeyDown={onKeyDown}>
      <figure className="pg-carousel__figure">
        <div className="pg-carousel__frame">
          {failed.has(index) ? (
            <p className="pg-state pg-state--image" role="status">
              {labels.error}
            </p>
          ) : (
            <img
              key={photo.src}
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={text?.alt ?? ''}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setFailed((current) => new Set(current).add(index))}
            />
          )}
        </div>
        <figcaption className="pg-carousel__caption">
          {text?.caption}{' '}
          <ExternalLink href={photo.page}>
            {photo.author} · {photo.license}
          </ExternalLink>
        </figcaption>
      </figure>
      <div className="pg-carousel__controls">
        <button type="button" className="pg-icon-button" onClick={() => go(-1)} disabled={total < 2} aria-label={labels.prev}>
          <span aria-hidden="true">‹</span>
        </button>
        <p className="pg-carousel__counter" aria-live="polite">
          {labels.counter(index + 1, total)}
        </p>
        <button type="button" className="pg-icon-button" onClick={() => go(1)} disabled={total < 2} aria-label={labels.next}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
