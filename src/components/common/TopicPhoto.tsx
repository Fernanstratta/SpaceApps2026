import { useState } from 'react';
import type { CommonsImage, TopicId } from '../../types';
import { commonsThumbUrl, type ThumbWidth } from '../../utils/commons';
import { TopicIcon } from '../portal/TopicIcon';

interface TopicPhotoProps {
  image: CommonsImage | undefined;
  topicId: TopicId;
  width: ThumbWidth;
  className?: string;
  /** Lazy for cards below the fold; eager for the banner. */
  loading?: 'lazy' | 'eager';
}

/**
 * Real-world photo for a topic or submodule. Images are loaded from
 * Wikimedia Commons; if one is missing or the network fails, the topic's
 * icon on its color is shown instead, so a card never looks broken.
 */
export function TopicPhoto({ image, topicId, width, className, loading = 'lazy' }: TopicPhotoProps) {
  const [failed, setFailed] = useState(false);
  const classes = ['topic-photo', className].filter(Boolean).join(' ');

  if (!image || failed) {
    return (
      <div
        className={`${classes} topic-photo--fallback`}
        {...(image ? { role: 'img', 'aria-label': image.alt } : { 'aria-hidden': true })}
      >
        <span className="topic-photo__fallback-icon" aria-hidden="true">
          <TopicIcon topicId={topicId} />
        </span>
      </div>
    );
  }

  return (
    <div className={classes}>
      <img
        src={commonsThumbUrl(image, width)}
        alt={image.alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
