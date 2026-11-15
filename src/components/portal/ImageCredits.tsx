import { commonsPageUrl } from '../../utils/commons';
import { ExternalLink } from '../common/ExternalLink';
import { useMessages, useData } from '../../i18n/I18nContext';

/** Attribution for every photo used in the portal. */
export function ImageCredits() {
  const { IMAGE_TEXT } = useMessages();
  const { images } = useData();
  return (
    <section className="image-credits" aria-labelledby="creditos-imagenes">
      <h2 id="creditos-imagenes" className="image-credits__title">
        {IMAGE_TEXT.creditsTitle}
      </h2>
      <p className="image-credits__intro">{IMAGE_TEXT.creditsIntro}</p>
      <ul className="image-credits__list">
        {images.map((image) => (
          <li key={image.id}>
            <ExternalLink href={commonsPageUrl(image)}>{image.alt}</ExternalLink>
            <span className="image-credits__meta">
              {' '}
              — {image.author}. {image.license}.
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One-line credit under a photo. Use `light` on page backgrounds (not on a banner). */
export function ImageCredit({ imageId, light = false }: { imageId: string; light?: boolean }) {
  const { IMAGE_TEXT } = useMessages();
  const { images } = useData();
  const image = images.find((item) => item.id === imageId);
  if (!image) return null;
  return (
    <p className={`photo-credit${light ? ' photo-credit--light' : ''}`}>
      {IMAGE_TEXT.photo}: {image.author} · {image.license} ·{' '}
      <ExternalLink href={commonsPageUrl(image)}>{IMAGE_TEXT.viewSource}</ExternalLink>
    </p>
  );
}
