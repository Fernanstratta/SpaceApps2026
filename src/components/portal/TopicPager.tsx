import { getSortedTopics } from '../../data/topics';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { TopicId } from '../../types';

const TEXT = {
  label: 'Navegación entre temas',
  previous: 'Tema anterior',
  next: 'Tema siguiente',
} as const;

/** Previous / next topic links at the end of a module page. */
export function TopicPager({ currentId }: { currentId: TopicId }) {
  const topics = getSortedTopics();
  const index = topics.findIndex((topic) => topic.id === currentId);
  const previous = index > 0 ? topics[index - 1] : undefined;
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined;

  return (
    <nav className="topic-pager" aria-label={TEXT.label}>
      {previous ? (
        <Link to={ROUTES.topic(previous.id)} className="topic-pager__link topic-pager__link--prev">
          <span className="topic-pager__hint">← {TEXT.previous}</span>
          <span className="topic-pager__name">{previous.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={ROUTES.topic(next.id)} className="topic-pager__link topic-pager__link--next">
          <span className="topic-pager__hint">{TEXT.next} →</span>
          <span className="topic-pager__name">{next.name}</span>
        </Link>
      ) : null}
    </nav>
  );
}
