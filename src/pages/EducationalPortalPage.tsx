import { useId, useMemo, useState } from 'react';
import { ImageCredits } from '../components/portal/ImageCredits';
import { TopicRow } from '../components/portal/TopicRow';
import { PORTAL_TEXT } from '../content/strings';
import { getSortedTopics, getSubmodulesByTopic } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Submodule, Topic } from '../types';
import { normalizeText } from '../utils/text';

interface TopicGroup {
  topic: Topic;
  submodules: Submodule[];
}

const ALL_GROUPS: TopicGroup[] = getSortedTopics().map((topic) => ({
  topic,
  submodules: getSubmodulesByTopic(topic.id),
}));

/** A topic whose name matches keeps all its cards; otherwise only matching cards stay. */
function filterGroups(query: string): TopicGroup[] {
  const q = normalizeText(query);
  if (!q) return ALL_GROUPS;
  return ALL_GROUPS.flatMap(({ topic, submodules }) => {
    const topicMatches = normalizeText(`${topic.name} ${topic.description ?? ''}`).includes(q);
    const matching = topicMatches
      ? submodules
      : submodules.filter((item) => normalizeText(`${item.title} ${item.tag}`).includes(q));
    return matching.length > 0 ? [{ topic, submodules: matching }] : [];
  });
}

/**
 * Portal Educativo: "Módulos" with a search box, then one row per topic
 * (each topic is a category) with its submodule cards. No mode selection.
 */
export function EducationalPortalPage() {
  useDocumentTitle(PORTAL_TEXT.title);
  const [query, setQuery] = useState('');
  const searchId = useId();
  const groups = useMemo(() => filterGroups(query), [query]);
  const resultCount = groups.reduce((total, group) => total + group.submodules.length, 0);
  const isSearching = query.trim().length > 0;

  return (
    <div className="portal">
      <div className="container">
        <header className="portal__head">
          <div>
            <p className="portal__eyebrow">{PORTAL_TEXT.title}</p>
            <h1 className="portal__title">{PORTAL_TEXT.modulesTitle}</h1>
            <p className="portal__intro">{PORTAL_TEXT.intro}</p>
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

        {groups.length > 0 ? (
          <div className="portal__rows">
            {groups.map(({ topic, submodules }) => (
              <TopicRow key={topic.id} topic={topic} submodules={submodules} />
            ))}
          </div>
        ) : (
          <p className="data-state data-state--empty portal__empty">{PORTAL_TEXT.noResults(query.trim())}</p>
        )}

        <ImageCredits />
      </div>
    </div>
  );
}
