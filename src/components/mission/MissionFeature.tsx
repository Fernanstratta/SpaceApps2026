import { STATION_11_PANORAMA } from '../../data/missions/roverMission';
import { useRoverMissionText } from '../../i18n/missions';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import { SourceLink } from './SourceLink';

/**
 * Misión destacada en el Portal Educativo, con sus dos entradas:
 * «Iniciar misión» (estudiantes) e «Impartir esta clase» (docentes).
 */
export function MissionFeature() {
  const text = useRoverMissionText();
  return (
    <section className="mission-feature" aria-labelledby="mission-feature-title">
      <figure className="mission-feature__media">
        <img
          src={STATION_11_PANORAMA.src}
          width={STATION_11_PANORAMA.width}
          height={STATION_11_PANORAMA.height}
          alt={text.challenge.panoramaAlt}
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <figcaption>
          {text.challenge.panoramaCaption} <SourceLink id={STATION_11_PANORAMA.sourceId} />
        </figcaption>
      </figure>
      <div className="mission-feature__body">
        <p className="mission-feature__eyebrow">
          {text.meta.lab} · {text.meta.code}
        </p>
        <h2 id="mission-feature-title" className="mission-feature__title">
          {text.meta.title}
        </h2>
        <p className="mission-feature__lead">{text.meta.lead}</p>
        <ul className="badge-list">
          {text.meta.badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
        <div className="mission-feature__actions">
          <Link to={ROUTES.missionStart} className="button button--primary">
            {text.meta.startCta}
          </Link>
          <Link to={ROUTES.missionTeach} className="button button--secondary">
            {text.meta.teachCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
