import type { ReactNode } from 'react';
import { topicStyle } from '../../content/topicVisuals';
import { getImage } from '../../data';
import type { TopicId } from '../../types';
import { TopicPhoto } from '../common/TopicPhoto';
import { ImageCredit } from '../portal/ImageCredits';
import { TopicIcon } from '../portal/TopicIcon';

interface TopicBannerProps {
  topicId: TopicId;
  title: string;
  lead?: string | null;
  imageId: string;
  /** Back link, topic number, subject pill… */
  eyebrow?: ReactNode;
}

/** Page header in the topic's color with its real-world photo. */
export function TopicBanner({ topicId, title, lead, imageId, eyebrow }: TopicBannerProps) {
  return (
    <header className="topic-banner" style={topicStyle(topicId)}>
      <div className="container topic-banner__inner">
        <div className="topic-banner__text">
          {eyebrow ? <div className="topic-banner__eyebrow">{eyebrow}</div> : null}
          <h1 className="topic-banner__title">
            <span className="topic-banner__icon" aria-hidden="true">
              <TopicIcon topicId={topicId} />
            </span>
            {title}
          </h1>
          {lead ? <p className="topic-banner__lead">{lead}</p> : null}
        </div>
        <figure className="topic-banner__figure">
          <TopicPhoto image={getImage(imageId)} topicId={topicId} width={960} loading="eager" className="topic-banner__photo" />
          <figcaption>
            <ImageCredit imageId={imageId} />
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
