import { topicStyle } from '../../content/topicVisuals';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { Submodule, Topic } from '../../types';
import { SubmoduleCard } from './SubmoduleCard';
import { TopicIcon } from './TopicIcon';
import { useMessages } from '../../i18n/I18nContext';

/** Horizontal, swipeable list of submodule cards. */
export function SubmoduleList({ submodules, label }: { submodules: Submodule[]; label: string }) {
  return (
    <ul className="sub-row" aria-label={label}>
      {submodules.map((submodule) => (
        <li key={submodule.id}>
          <SubmoduleCard submodule={submodule} />
        </li>
      ))}
    </ul>
  );
}

/** One topic of the portal: colored heading (the category) and its cards. */
export function TopicRow({ topic, submodules }: { topic: Topic; submodules: Submodule[] }) {
  const { PORTAL_TEXT } = useMessages();
  const headingId = `fila-${topic.id}`;
  return (
    <section className="topic-row" style={topicStyle(topic.id)} aria-labelledby={headingId}>
      <div className="topic-row__header">
        <h2 id={headingId} className="topic-row__title">
          <span className="topic-row__icon" aria-hidden="true">
            <TopicIcon topicId={topic.id} />
          </span>
          {topic.name}
        </h2>
        <Link to={ROUTES.topic(topic.id)} className="topic-row__more">
          {PORTAL_TEXT.viewTopic}
          <span className="visually-hidden">: {topic.name}</span>
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
      <SubmoduleList submodules={submodules} label={`${PORTAL_TEXT.submodulesTitle}: ${topic.name}`} />
    </section>
  );
}
