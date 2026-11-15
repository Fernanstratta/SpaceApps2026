import { MAP_PIECES } from '../../data/missions/lunitaMission';
import { STATION_11_PANORAMA } from '../../data/missions/roverMission';
import { useLunitaMissionText, useRoverMissionText } from '../../i18n/missions';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import { MapPieceArt } from '../lunita/LunitaArt';
import { SourceLink } from './SourceLink';

/**
 * Misiones del Portal en el diseño «Museo interactivo» (claro y oscuro).
 * Dos salas de ancho completo, en este orden:
 *  1. Azul hielo: la misión de 12–17 años, con la panorámica del Apolo 16
 *     arriba y la pregunta debajo.
 *  2. Lavanda: la misión 4Kids (6–12), armada alrededor de las piezas del
 *     rompecabezas, con amarillo y turquesa como acentos.
 * Los colores de las salas cambian con el tema (ver styles/museo.css).
 */
export function MissionsShowcase() {
  const t = useRoverMissionText();
  const k = useLunitaMissionText();
  const [first, ...rest] = MAP_PIECES;

  return (
    <div className="showcase">
      <section className="room room--ice showcase__rover" aria-labelledby="showcase-rover-title">
        <figure className="showcase__panorama">
          <img
            src={STATION_11_PANORAMA.src}
            width={STATION_11_PANORAMA.width}
            height={STATION_11_PANORAMA.height}
            alt={t.challenge.panoramaAlt}
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <figcaption className="container">
            {t.challenge.panoramaCaption} <SourceLink id={STATION_11_PANORAMA.sourceId} />
          </figcaption>
        </figure>
        <div className="container showcase__label">
          <div>
            <p className="showcase__eyebrow">
              {t.meta.lab} · {t.meta.code}
            </p>
            <span className="showcase__age">{t.meta.ages}</span>
            <h2 id="showcase-rover-title" className="showcase__title">
              {t.meta.title}
            </h2>
          </div>
          <div className="showcase__plaque">
            <p className="showcase__lead">{t.meta.lead}</p>
            <ul className="badge-list">
              {t.meta.badges.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>
            <div className="showcase__actions">
              <Link to={ROUTES.missionStart} className="button button--primary">
                {t.meta.startCta}
              </Link>
              <Link to={ROUTES.missionTeach} className="button button--secondary">
                {t.meta.teachCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="room room--lavender showcase__kids" aria-labelledby="showcase-kids-title">
        <div className="container showcase__puzzle">
          {first ? <MapPieceArt piece={first} className="showcase__piece showcase__piece--a" /> : null}
          <div className="showcase__kids-card">
            <p className="showcase__kids-tag">
              <span className="lunita-badge">{k.meta.badge}</span>{' '}
              <span className="showcase__dot">·</span>{' '}
              <span className="showcase__age showcase__age--kids">{k.meta.ages}</span>
            </p>
            <h2 id="showcase-kids-title" className="showcase__title">
              {k.meta.title}
            </h2>
            <p className="showcase__lead">{k.meta.lead}</p>
            <Link to={ROUTES.lunita} className="button lunita-button lunita-button--play">
              <span aria-hidden="true">▶</span> {k.meta.cta}
            </Link>
            <p className="showcase__note">
              <span className="showcase__illustrative">{k.meta.illustrative}</span>
            </p>
          </div>
          <div className="showcase__stack">
            {rest.map((piece, i) => (
              <MapPieceArt key={piece} piece={piece} className={`showcase__piece showcase__piece--${i === 0 ? 'b' : 'c'}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
