import { useState } from 'react';
import { HERO_MOON_IMAGE } from '../../content/home';
import { ExternalLink } from '../common/ExternalLink';

/**
 * Hero Moon. The PNG has a transparent background, so it sits directly on the
 * black hero with its natural proportions. If the image cannot load, a simple
 * drawn Moon is shown instead so the hero never shows a broken image.
 * A credit line is rendered only when `HERO_MOON_IMAGE.credit` is set.
 */
export function MoonImage() {
  const [failed, setFailed] = useState(false);
  const { src, width, height, alt, credit, creditUrl } = HERO_MOON_IMAGE;

  return (
    <figure className="hero__moon">
      {failed ? (
        <MoonFallback />
      ) : (
        <img
          className="hero__moon-img"
          src={src}
          width={width}
          height={height}
          alt={alt}
          decoding="async"
          fetchPriority="high"
          onError={() => setFailed(true)}
        />
      )}
      {credit && !failed ? (
        <figcaption className="hero__credit">
          {creditUrl ? <ExternalLink href={creditUrl}>{credit}</ExternalLink> : credit}
        </figcaption>
      ) : null}
    </figure>
  );
}

function MoonFallback() {
  return (
    <svg
      className="hero__moon-img hero__moon-img--fallback"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Ilustración de la Luna"
    >
      <circle cx="100" cy="100" r="96" fill="#d9dce3" />
      <circle cx="72" cy="70" r="22" fill="#b9bec9" />
      <circle cx="128" cy="118" r="30" fill="#c2c7d1" />
      <circle cx="78" cy="138" r="12" fill="#b4b9c4" />
      <circle cx="140" cy="62" r="9" fill="#bcc1cb" />
      <circle cx="104" cy="96" r="6" fill="#b4b9c4" />
    </svg>
  );
}
