import { useEffect, useId, useMemo, useState } from 'react';
import { MissionsShowcase } from '../components/mission/MissionsShowcase';
import { ImageCredits } from '../components/portal/ImageCredits';
import { PortalViewSwitch } from '../components/portal/PortalViewSwitch';
import { TopicRow } from '../components/portal/TopicRow';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePortalView } from '../hooks/usePortalView';
import { useData, useMessages } from '../i18n/I18nContext';
import { useRouter } from '../router/Router';
import { ROUTES } from '../router/routes';
import type { Submodule, Topic } from '../types';
import { normalizeText } from '../utils/text';

interface TopicGroup {
  topic: Topic;
  submodules: Submodule[];
}

/**
 * A topic whose name matches keeps all its cards; otherwise only matching cards stay.
 * Search runs on the texts of the active language.
 */
function filterGroups(allGroups: TopicGroup[], query: string): TopicGroup[] {
  const q = normalizeText(query);
  if (!q) return allGroups;
  return allGroups.flatMap(({ topic, submodules }) => {
    const topicMatches = normalizeText(`${topic.name} ${topic.description ?? ''}`).includes(q);
    const matching = topicMatches
      ? submodules
      : submodules.filter((item) => normalizeText(`${item.title} ${item.tag}`).includes(q));
    return matching.length > 0 ? [{ topic, submodules: matching }] : [];
  });
}

/**
 * Portal Educativo: "Módulos" with a search box and the Estudiante / Docente
 * switch, then one full-width band per topic (in the topic's own color) with
 * its submodule cards, and at the bottom the educational games (missions),
 * shown only in the student view. Without a chosen view, the entry screen
 * (`RoleSelectPage`) comes first.
 */
export function EducationalPortalPage() {
  const { PORTAL_TEXT } = useMessages();
  const { getSortedTopics, getSubmodulesByTopic } = useData();
  const { view, hasChosenView } = usePortalView();
  const { navigate } = useRouter();
  useDocumentTitle(PORTAL_TEXT.title);
  const [query, setQuery] = useState('');
  const searchId = useId();
  const allGroups = useMemo<TopicGroup[]>(
    () => getSortedTopics().map((topic) => ({ topic, submodules: getSubmodulesByTopic(topic.id) })),
    [getSortedTopics, getSubmodulesByTopic],
  );
  const groups = useMemo(() => filterGroups(allGroups, query), [allGroups, query]);
  const resultCount = groups.reduce((total, group) => total + group.submodules.length, 0);
  const isSearching = query.trim().length > 0;

  useEffect(() => {
    if (!hasChosenView) navigate(ROUTES.portalAccess, { replace: true });
  }, [hasChosenView, navigate]);

  if (!hasChosenView) return null;

  // Games are for students: hidden in the teacher view and while searching modules.
  const showGames = view === 'learn' && !isSearching;

  return (
    <div className="portal">
      <div className="container">
        <header className="portal__head">
          <div>
            <p className="portal__eyebrow">{PORTAL_TEXT.title}</p>
            <h1 className="portal__title">{PORTAL_TEXT.modulesTitle}</h1>
            <p className="portal__intro">{PORTAL_TEXT.intro}</p>
            <PortalViewSwitch showLabel className="portal__view" />
          </div>
          <div className="portal-search" role="search">
            <label htmlFor={searchId} className="visually-hidden">
              {PORTAL_TEXT.searchLabel}
            </label>
            <svg className="portal-search__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id={searchId}
              type="search"
              className="portal-search__input"
              placeholder={PORTAL_TEXT.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {isSearching ? (
              <button type="button" className="portal-search__clear" onClick={() => setQuery('')}>
                <span aria-hidden="true">×</span>
                <span className="visually-hidden">{PORTAL_TEXT.clearSearch}</span>
              </button>
            ) : null}
          </div>
        </header>

        <p className={isSearching ? 'portal__count' : 'visually-hidden'} role="status">
          {isSearching ? PORTAL_TEXT.resultCount(resultCount) : ''}
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="portal__rows">
          {groups.map(({ topic, submodules }) => (
            <TopicRow key={topic.id} topic={topic} submodules={submodules} />
          ))}
        </div>
      ) : (
        <div className="container">
          <p className="data-state data-state--empty portal__empty">{PORTAL_TEXT.noResults(query.trim())}</p>
        </div>
      )}

      {/*
        Juegos educativos (misiones) al final, después de los módulos. Primero
        la de 12–17 años y debajo la 4Kids (6–12), en salas de ancho completo
        (diseño «Museo»). Solo en la vista de estudiante.
      */}
      {showGames ? (
        <section className="portal-games" aria-labelledby="portal-games-title">
          <div className="container portal-games__head">
            <p className="portal__eyebrow">{PORTAL_TEXT.gamesEyebrow}</p>
            <h2 id="portal-games-title" className="portal-games__title">
              {PORTAL_TEXT.gamesTitle}
            </h2>
            <p className="portal__intro">{PORTAL_TEXT.gamesIntro}</p>
          </div>
          <MissionsShowcase />
        </section>
      ) : null}

      <div className="container">
        <ImageCredits />
      </div>
    </div>
  );
}
