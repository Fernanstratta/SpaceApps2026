import type { TopicId } from '../../types';
import { useRoverMissionText } from '../../i18n/missions';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';

/** Ejes cuyo contenido conecta con la Misión 01 (pendientes y perfiles de cráteres). */
export const ROVER_MISSION_TOPICS: readonly TopicId[] = ['slope', 'craters'];

/**
 * Acceso a la misión desde las pestañas de un tema: «Aprender» lleva a la
 * vista del estudiante y «Enseñar», a la guía docente. Son dos entradas a la
 * misma misión.
 */
export function MissionCallout({ topicId, view }: { topicId: TopicId; view: 'learn' | 'teach' }) {
  const text = useRoverMissionText();
  if (!ROVER_MISSION_TOPICS.includes(topicId)) return null;
  const callout = text.callout[view];
  return (
    <aside className={`mission-callout mission-callout--${view}`} aria-label={text.meta.title}>
      <div>
        <p className="mission-callout__eyebrow">{callout.eyebrow}</p>
        <p className="mission-callout__title">{text.meta.title}</p>
        <p className="mission-callout__text">{callout.text}</p>
      </div>
      <Link
        to={view === 'learn' ? ROUTES.missionStart : ROUTES.missionTeach}
        className={`button ${view === 'learn' ? 'button--primary' : 'button--secondary'}`}
      >
        {callout.cta} →
      </Link>
    </aside>
  );
}
