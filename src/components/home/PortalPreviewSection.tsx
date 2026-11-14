import { HOME_CONTENT } from '../../content/home';
import { TOPIC_TABS } from '../../content/strings';
import { topicStyle } from '../../content/topicVisuals';
import { getSortedTopics } from '../../data';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import { TopicIcon } from '../portal/TopicIcon';

/** What Starman is, the two views of every topic and the topic list. Part of Inicio. */
export function PortalPreviewSection() {
  const { intro, audiences, topicsTitle } = HOME_CONTENT;

  return (
    <section className="home-band home-band--portal" aria-labelledby="que-es-starman">
      <div className="container">
        <h2 id="que-es-starman" className="band-title">
          {intro.title}
        </h2>
        <div className="intro-grid">
          <article className="info-block">
            <h3>{intro.purpose.title}</h3>
            <p>{intro.purpose.body}</p>
          </article>
          <article className="info-block">
            <h3>{intro.realWorld.title}</h3>
            <p>{intro.realWorld.body}</p>
          </article>
        </div>

        <div className="home-subsection">
          <h3 className="subsection-title">{audiences.title}</h3>
          <ul className="audience-grid">
            {(['learn', 'teach'] as const).map((tab) => (
              <li key={tab}>
                <article className={`audience-card audience-card--${tab}`}>
                  <h4>
                    {TOPIC_TABS[tab].label} · {tab === 'learn' ? audiences.student : audiences.teacher}
                  </h4>
                  <p>{TOPIC_TABS[tab].description}</p>
                </article>
              </li>
            ))}
          </ul>
          <Link to={ROUTES.portal} className="button button--secondary home-portal-link">
            {audiences.cta}
          </Link>
        </div>

        <div className="home-subsection">
          <h3 className="subsection-title">{topicsTitle}</h3>
          <ul className="topic-chips">
            {getSortedTopics().map((topic) => (
              <li key={topic.id}>
                <Link to={ROUTES.topic(topic.id)} className="topic-chip" style={topicStyle(topic.id)}>
                  <TopicIcon topicId={topic.id} />
                  <span>{topic.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
