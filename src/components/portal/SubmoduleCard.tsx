import { topicStyle } from '../../content/topicVisuals';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { Submodule } from '../../types';
import { TopicPhoto } from '../common/TopicPhoto';
import { TopicIcon } from './TopicIcon';
import { useData } from '../../i18n/I18nContext';

/** Card for one submodule: photo, topic icon, title and subject pill. */
export function SubmoduleCard({ submodule }: { submodule: Submodule }) {
  const { getImage } = useData();
  return (
    <article className="sub-card" style={topicStyle(submodule.topicId)}>
      <div className="sub-card__media">
        <TopicPhoto image={getImage(submodule.imageId)} topicId={submodule.topicId} width={500} />
        <span className="sub-card__icon" aria-hidden="true">
          <TopicIcon topicId={submodule.topicId} />
        </span>
      </div>
      <div className="sub-card__body">
        <h3 className="sub-card__title">
          <Link to={ROUTES.submodule(submodule.topicId, submodule.id)} className="sub-card__link">
            {submodule.title}
          </Link>
        </h3>
        <span className="topic-pill">{submodule.tag}</span>
      </div>
    </article>
  );
}
