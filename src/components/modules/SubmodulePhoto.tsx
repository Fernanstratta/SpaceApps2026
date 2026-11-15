import { getImage } from '../../data';
import type { TopicId } from '../../types';
import { TopicPhoto } from '../common/TopicPhoto';
import { ImageCredit } from '../portal/ImageCredits';

/** A real-world photo inside a submodule, with its credit underneath. */
export function SubmodulePhoto({ imageId, topicId, wide = false }: { imageId: string; topicId: TopicId; wide?: boolean }) {
  return (
    <figure className={`submodule-photo${wide ? ' submodule-photo--wide' : ''}`}>
      <TopicPhoto image={getImage(imageId)} topicId={topicId} width={960} className="submodule-photo__img" />
      <figcaption>
        <ImageCredit imageId={imageId} light />
      </figcaption>
    </figure>
  );
}
