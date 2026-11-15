import { DataNotes } from '../components/mission/DataNotes';
import { getSiteTerrain } from '../components/mission/missionTerrain';
import { SourceList } from '../components/mission/SourceLink';
import { MISSION_SITE_IDS, MISSION_SOURCES, type SourceId } from '../data/missions/roverMission';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18nContext';
import { useMessages } from '../i18n/I18nContext';
import { useRoverMissionText } from '../i18n/missions';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

const SECTION_IDS = [
  'objetivo',
  'materiales',
  'preparacion',
  'secuencia',
  'revision',
  'preguntas',
  'rubrica',
  'cierre',
  'datos',
  'fuentes',
] as const;

/**
 * «Impartir esta clase»: guía docente gratuita de 45 minutos, sin cuenta e
 * imprimible desde el navegador (los estilos de impresión ocultan la
 * navegación y los botones).
 */
export function MissionTeacherPage() {
  const { locale } = useI18n();
  const text = useRoverMissionText();
  const { NAV_LABELS } = useMessages();
  const g = text.guide;
  const v = text.viewer;
  useDocumentTitle(text.meta.teacherPageTitle);

  const f0 = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const f1 = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const sectionTitles: Record<(typeof SECTION_IDS)[number], string> = {
    objetivo: g.objectiveTitle,
    materiales: g.materialsTitle,
    preparacion: g.preparationTitle,
    secuencia: g.timelineTitle,
    revision: g.reviewTitle,
    preguntas: g.questionsTitle,
    rubrica: g.rubricTitle,
    cierre: g.closingTitle,
    datos: g.answersTitle,
    fuentes: g.sourcesTitle,
  };

  return (
    <div className="guide">
      <header className="guide__head">
        <div className="container">
          <Link to={ROUTES.portal} className="mission__back">
            ← {NAV_LABELS.portal}
          </Link>
          <p className="mission__eyebrow">
            {text.meta.lab} · {text.meta.code}
          </p>
          <h1 className="mission__title">{text.meta.title}</h1>
          <p className="guide__subtitle">{g.title}</p>
          <p className="guide__intro">{g.intro}</p>
          <ul className="badge-list">
            {text.meta.badges.map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>
          <div className="guide__actions print-hide">
            <button type="button" className="button button--primary" onClick={() => window.print()}>
              {g.print}
            </button>
            <Link to={ROUTES.missionStart} className="button button--ghost">
              {g.openStudent} →
            </Link>
          </div>
        </div>
      </header>

      <div className="container guide__layout">
        <nav className="guide__toc print-hide" aria-label={g.onThisPage}>
          <p className="section-nav__title">{g.onThisPage}</p>
          <ol>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{sectionTitles[id]}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="guide__content">
          <section id="objetivo" className="guide-section">
            <h2>{g.objectiveTitle}</h2>
            <p>{g.objective}</p>
            <h3>{g.audienceTitle}</h3>
            <p>{g.audience}</p>
            <h3>{text.challenge.maneuverTitle}</h3>
            <p>{text.challenge.maneuver}</p>
          </section>

          <section id="materiales" className="guide-section">
            <h2>{g.materialsTitle}</h2>
            <ul>
              {g.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="preparacion" className="guide-section">
            <h2>{g.preparationTitle}</h2>
            <ul>
              {g.preparation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="secuencia" className="guide-section">
            <h2>{g.timelineTitle}</h2>
            <ol className="timeline">
              {g.timeline.map((item) => (
                <li key={item.time} className="timeline__item">
                  <span className="timeline__time">{item.time}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="revision" className="guide-section">
            <h2>{g.reviewTitle}</h2>
            <p>{g.reviewIntro}</p>
            <ol className="review-steps">
              {g.reviewSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="objection-example">
              <h3>{g.objectionExampleTitle}</h3>
              <p className="objection-example__quote">«{g.objectionExample}»</p>
              <p>{g.objectionCheck}</p>
            </div>
            <h3>{g.objectionMoreTitle}</h3>
            <ul>
              {g.objectionMore.map((item) => (
                <li key={item}>«{item}»</li>
              ))}
            </ul>
          </section>

          <section id="preguntas" className="guide-section">
            <h2>{g.questionsTitle}</h2>
            <ol>
              {g.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>

          <section id="rubrica" className="guide-section">
            <h2>{g.rubricTitle}</h2>
            <p className="neutral-note">{g.rubricNote}</p>
            <div className="responsive-table rubric">
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="visually-hidden">{g.rubricTitle}</span>
                    </th>
                    {g.rubricLevels.map((level) => (
                      <th key={level} scope="col">
                        {level}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.rubric.map((row) => (
                    <tr key={row.criterion}>
                      <th scope="row">{row.criterion}</th>
                      {row.levels.map((level, index) => (
                        <td key={level} data-label={g.rubricLevels[index]}>
                          {level}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="cierre" className="guide-section guide-section--closing">
            <h2>{g.closingTitle}</h2>
            <p className="guide__closing">«{g.closing}»</p>
          </section>

          <section id="datos" className="guide-section">
            <h2>{g.answersTitle}</h2>
            <p>{g.answersIntro}</p>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{g.tableSite}</th>
                    <th scope="col">{v.stats.depth}</th>
                    <th scope="col">{v.stats.rimToRim}</th>
                    <th scope="col">{v.stats.maxSlope}</th>
                    <th scope="col">{v.stats.meanSlope}</th>
                  </tr>
                </thead>
                <tbody>
                  {MISSION_SITE_IDS.map((id) => {
                    const { profiles } = getSiteTerrain(id);
                    const we = profiles['west-east'].stats;
                    const ns = profiles['north-south'].stats;
                    return (
                      <tr key={id}>
                        <th scope="row" data-label={g.tableSite}>
                          {text.sites[id].name}
                        </th>
                        <td data-label={v.stats.depth}>
                          {f0.format(we.depth)} / {f0.format(ns.depth)} m
                        </td>
                        <td data-label={v.stats.rimToRim}>
                          {f0.format(we.rimToRim)} / {f0.format(ns.rimToRim)} m
                        </td>
                        <td data-label={v.stats.maxSlope}>
                          {f1.format(we.maxSlope)} / {f1.format(ns.maxSlope)}°
                        </td>
                        <td data-label={v.stats.meanSlope}>
                          {f1.format(we.meanSlope)} / {f1.format(ns.meanSlope)}°
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ul>
              {g.answersArguments.map((argument) => (
                <li key={argument}>{argument}</li>
              ))}
            </ul>
          </section>

          <section id="fuentes" className="guide-section">
            <h2>{g.sourcesTitle}</h2>
            <SourceList ids={Object.keys(MISSION_SOURCES) as SourceId[]} />
            <DataNotes />
          </section>
        </div>
      </div>
    </div>
  );
}
