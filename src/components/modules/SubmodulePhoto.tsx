import type { TopicId } from '../../types';
import { TopicPhoto } from '../common/TopicPhoto';
import { ImageCredit } from '../portal/ImageCredits';
import { useData } from '../../i18n/I18nContext';

/** A real-world photo inside a submodule, with its credit underneath. */
export function SubmodulePhoto({ imageId, topicId, wide = false }: { imageId: string; topicId: TopicId; wide?: boolean }) {
  const { getImage } = useData();
  return (
    <figure className={`submodule-photo${wide ? ' submodule-photo--wide' : ''}`}>
      <TopicPhoto image={getImage(imageId)} topicId={topicId} width={960} className="submodule-photo__img" />
      <figcaption>
        <ImageCredit imageId={imageId} light />
      </figcaption>
    </figure>
  );
}
