import { useState, type MouseEvent, type ReactNode } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { Link } from '../../router/Link';
import { ROUTES } from '../../router/routes';
import type { TopicId } from '../../types';
import { scrollToSection } from '../../utils/scroll';
import { Chevron } from '../common/Chevron';
import { TopicIcon } from '../portal/TopicIcon';
import { useData, useMessages } from '../../i18n/I18nContext';

export interface SubmoduleSectionLink {
  id: string;
  label: string;
}

interface SubmoduleLayoutProps {
  sections: SubmoduleSectionLink[];
  topicId: TopicId;
  submoduleId: string;
  children: ReactNode;
}

const DESKTOP_QUERY = '(min-width: 64rem)';
const SIDEBAR_STORAGE_KEY = 'starman:submodule-sidebar';

function isDesktop(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(DESKTOP_QUERY).matches;
}

/**
 * On desktop the sidebar remembers the last choice during the session (open
 * by default); on phones it starts closed so the content comes first.
 */
function readInitialOpen(): boolean {
  if (!isDesktop()) return false;
  try {
    return window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY) !== 'closed';
  } catch {
    return true;
  }
}

function storeOpen(open: boolean): void {
  try {
    window.sessionStorage.setItem(SIDEBAR_STORAGE_KEY, open ? 'open' : 'closed');
  } catch {
    // Persistence is a convenience only.
  }
}

/**
 * Two-column submodule layout: a collapsible sidebar ("En esta página" and the
 * tree of modules with their submodules) and the reading column.
 */
export function SubmoduleLayout({ sections, topicId, submoduleId, children }: SubmoduleLayoutProps) {
  const { SUBMODULE_TEXT, UI } = useMessages();
  const { getSortedTopics, getSubmodulesByTopic } = useData();
  const [open, setOpen] = useState(readInitialOpen);
  // Many sections are short, so one counts as "being read" once it reaches
  // the top fifth of the screen.
  const activeSection = useActiveSection(
    sections.map((section) => section.id),
    true,
    0.2,
  );

  const toggle = () => {
    setOpen((current) => {
      const next = !current;
      if (isDesktop()) storeOpen(next);
      return next;
    });
  };

  const goToSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    scrollToSection(id);
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, '', url);
    // On phones the open index covers the content: close it after choosing.
    if (!isDesktop()) setOpen(false);
  };

  return (
    <div className={`submodule-layout${open ? '' : ' is-collapsed'}`}>
      <aside className="submodule-sidebar" aria-label={SUBMODULE_TEXT.sidebarLabel}>
        <button
          type="button"
          className="submodule-sidebar__toggle"
          aria-expanded={open}
          aria-controls="submodule-sidebar-panel"
          onClick={toggle}
        >
          <Chevron direction={open ? 'left' : 'right'} />
          <span className="submodule-sidebar__toggle-label">{open ? SUBMODULE_TEXT.hideSidebar : SUBMODULE_TEXT.showSidebar}</span>
        </button>

        <div id="submodule-sidebar-panel" className="submodule-sidebar__panel" hidden={!open}>
          <nav className="submodule-toc" aria-labelledby="submodule-toc-title">
            <p id="submodule-toc-title" className="submodule-sidebar__heading">
              {UI.onThisPage}
            </p>
            <ol className="submodule-toc__list">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`submodule-toc__link${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={goToSection(section.id)}
                    >
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <nav className="module-tree" aria-labelledby="module-tree-title">
            <p id="module-tree-title" className="submodule-sidebar__heading">
              <ModulesIcon />
              {SUBMODULE_TEXT.modules}
            </p>
            <ul className="module-tree__list">
              {getSortedTopics().map((topic) => {
                const isCurrentTopic = topic.id === topicId;
                return (
                  <li key={topic.id}>
                    <details className="module-tree__group" open={isCurrentTopic}>
                      <summary className={`module-tree__summary${isCurrentTopic ? ' is-current' : ''}`}>
                        <span className="module-tree__icon" aria-hidden="true">
                          <TopicIcon topicId={topic.id} />
                        </span>
                        <span>{topic.name}</span>
                      </summary>
                      <ul className="module-tree__items">
                        <li>
                          <Link to={ROUTES.topic(topic.id)} className="module-tree__link module-tree__link--overview">
                            {SUBMODULE_TEXT.topicOverview}
                          </Link>
                        </li>
                        {getSubmodulesByTopic(topic.id).map((item) => {
                          const isCurrent = isCurrentTopic && item.id === submoduleId;
                          return (
                            <li key={item.id}>
                              <Link
                                to={ROUTES.submodule(topic.id, item.id)}
                                className={`module-tree__link${isCurrent ? ' is-current' : ''}`}
                                aria-current={isCurrent ? 'page' : undefined}
                              >
                                {item.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <article className="submodule-content">{children}</article>
    </div>
  );
}

function ModulesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 10.5L12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}
