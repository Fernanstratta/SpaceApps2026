import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { Submodule, Topic } from '../../types';
import { useData, useMessages } from '../../i18n/I18nContext';

interface SubmodulePagerProps {
  topic: Topic;
  submodules: Submodule[];
  current: Submodule;
}

/**
 * Previous / next at the end of a submodule. Before the first one it points to
 * the topic presentation; after the last one, to the next topic.
 */
export function SubmodulePager({ topic, submodules, current }: SubmodulePagerProps) {
  const { SUBMODULE_TEXT } = useMessages();
  const { getSortedTopics } = useData();
  const index = submodules.findIndex((item) => item.id === current.id);
  const previous = index > 0 ? submodules[index - 1] : undefined;
  const next = index >= 0 && index < submodules.length - 1 ? submodules[index + 1] : undefined;
  const topics = getSortedTopics();
  const nextTopic = next ? undefined : topics[topics.findIndex((item) => item.id === topic.id) + 1];

  return (
    <nav className="topic-pager submodule-pager" aria-label={SUBMODULE_TEXT.pagerLabel}>
      {previous ? (
        <Link to={ROUTES.submodule(topic.id, previous.id)} className="topic-pager__link topic-pager__link--prev">
          <span className="topic-pager__hint">← {SUBMODULE_TEXT.previous}</span>
          <span className="topic-pager__name">{previous.title}</span>
        </Link>
      ) : (
        <Link to={ROUTES.topic(topic.id)} className="topic-pager__link topic-pager__link--prev">
          <span className="topic-pager__hint">← {SUBMODULE_TEXT.topicOverview}</span>
          <span className="topic-pager__name">{topic.name}</span>
        </Link>
      )}
      {next ? (
        <Link to={ROUTES.submodule(topic.id, next.id)} className="topic-pager__link topic-pager__link--next">
          <span className="topic-pager__hint">{SUBMODULE_TEXT.next} →</span>
          <span className="topic-pager__name">{next.title}</span>
        </Link>
      ) : nextTopic ? (
        <Link to={ROUTES.topic(nextTopic.id)} className="topic-pager__link topic-pager__link--next">
          <span className="topic-pager__hint">{SUBMODULE_TEXT.nextTopic} →</span>
          <span className="topic-pager__name">{nextTopic.name}</span>
        </Link>
      ) : null}
    </nav>
  );
}
