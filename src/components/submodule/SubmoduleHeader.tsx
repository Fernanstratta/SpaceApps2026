import { topicStyle } from '../../content/topicVisuals';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { Submodule, Topic } from '../../types';
import { TopicIcon } from '../portal/TopicIcon';
import { useMessages } from '../../i18n/I18nContext';

interface SubmoduleHeaderProps {
  topic: Topic;
  submodule: Submodule;
  total: number;
}

/** Submodule header: back link to the topic, icon and submodule name. */
export function SubmoduleHeader({ topic, submodule, total }: SubmoduleHeaderProps) {
  const { PORTAL_TEXT, SUBMODULE_TEXT, EDUCATION_LEVEL_LABELS, LEVEL_LABEL } = useMessages();
  return (
    <header className="submodule-header" style={topicStyle(topic.id)}>
      <div className="container">
        <Link to={ROUTES.topic(topic.id)} className="submodule-header__back">
          ← {SUBMODULE_TEXT.backToTopic(topic.name)}
        </Link>
        <div className="submodule-header__title-row">
          <span className="submodule-header__icon" aria-hidden="true">
            <TopicIcon topicId={topic.id} />
          </span>
          <div>
            <p className="submodule-header__eyebrow">
              {PORTAL_TEXT.topicNumber} {String(topic.order).padStart(2, '0')} · {topic.name} ·{' '}
              {SUBMODULE_TEXT.position(submodule.order, total)}
            </p>
            <h1 className="submodule-header__title">{submodule.title}</h1>
          </div>
          <span className="submodule-header__pills">
            <span className="topic-pill submodule-header__pill">{submodule.tag}</span>
            <span className={`level-pill level-pill--${submodule.level}`}>
              <span className="visually-hidden">{LEVEL_LABEL}: </span>
              {EDUCATION_LEVEL_LABELS[submodule.level]}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
