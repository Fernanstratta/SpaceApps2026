import type { PortalView } from '../../context/PortalViewContext';
import { topicStyle } from '../../content/topicVisuals';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { Submodule } from '../../types';
import { TopicPhoto } from '../common/TopicPhoto';
import { TopicIcon } from './TopicIcon';
import { useData, useMessages } from '../../i18n/I18nContext';

interface SubmoduleCardProps {
  submodule: Submodule;
  /**
   * Topic and submodule pages pass the active view: the card then shows its
   * number, summary and a call to action for that view.
   */
  view?: PortalView;
  /** Marks the submodule being read (submodule page). */
  current?: boolean;
  /** Extra detail after the number, e.g. the teacher's estimated duration. */
  meta?: string | null;
}

/** Card for one submodule: photo, topic icon, title and subject pill. */
export function SubmoduleCard({ submodule, view, current = false, meta }: SubmoduleCardProps) {
  const { getImage } = useData();
  const { MODULE_TEXT, SUBMODULE_TEXT } = useMessages();
  const number = String(submodule.order).padStart(2, '0');
  const cta = view === 'teach' ? MODULE_TEXT.openTeacherGuide : MODULE_TEXT.startLearning;

  return (
    <article
      className={`sub-card${view ? ' sub-card--detailed' : ''}${current ? ' is-current' : ''}`}
      style={topicStyle(submodule.topicId)}
    >
      <div className="sub-card__media">
        <TopicPhoto image={getImage(submodule.imageId)} topicId={submodule.topicId} width={500} />
        <span className="sub-card__icon" aria-hidden="true">
          <TopicIcon topicId={submodule.topicId} />
        </span>
      </div>
      <div className="sub-card__body">
        {view ? (
          <p className="sub-card__number">
            {MODULE_TEXT.submoduleNumber} {number}
            {meta ? <span className="sub-card__meta"> · {meta}</span> : null}
          </p>
        ) : null}
        <h3 className="sub-card__title">
          <Link
            to={ROUTES.submodule(submodule.topicId, submodule.id)}
            className="sub-card__link"
            aria-current={current ? 'page' : undefined}
          >
            {submodule.title}
          </Link>
        </h3>
        {view ? (
          <p className="sub-card__summary">{submodule.summary ?? MODULE_TEXT.stageSummaries[submodule.stage]}</p>
        ) : null}
        <span className="topic-pill">{submodule.tag}</span>
        {view ? (
          <span className="sub-card__cta" aria-hidden="true">
            {current ? SUBMODULE_TEXT.current : `${cta} →`}
          </span>
        ) : null}
      </div>
    </article>
  );
}
