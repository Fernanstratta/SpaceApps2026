import { useMessages } from '../../i18n/I18nContext';
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type TopicTab = 'learn' | 'teach';

const TABS: TopicTab[] = ['learn', 'teach'];
/** Spanish value used in the URL (`?vista=ensenar`) so a view can be shared. */
const QUERY_VALUE: Record<TopicTab, string> = { learn: 'aprender', teach: 'ensenar' };

function readInitialTab(): TopicTab {
  const value = new URLSearchParams(window.location.search).get('vista');
  return value === QUERY_VALUE.teach ? 'teach' : 'learn';
}

interface TopicTabsProps {
  idPrefix: string;
  renderPanel: (tab: TopicTab) => ReactNode;
}

/**
 * "Aprender" / "Enseñar" tabs inside a topic (WAI-ARIA tabs pattern):
 * arrow keys, Home and End move between tabs; only the active panel renders.
 */
export function TopicTabs({ idPrefix, renderPanel }: TopicTabsProps) {
  const { TOPIC_TABS } = useMessages();
  const [active, setActive] = useState<TopicTab>(readInitialTab);
  const tabRefs = useRef<Record<TopicTab, HTMLButtonElement | null>>({ learn: null, teach: null });

  const select = (tab: TopicTab, focus = false) => {
    setActive(tab);
    if (focus) tabRefs.current[tab]?.focus();
    const url = new URL(window.location.href);
    if (tab === 'learn') url.searchParams.delete('vista');
    else url.searchParams.set('vista', QUERY_VALUE[tab]);
    window.history.replaceState(window.history.state, '', url);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(active);
    let next: TopicTab | null = null;
    if (event.key === 'ArrowRight') next = TABS[(index + 1) % TABS.length] ?? null;
    if (event.key === 'ArrowLeft') next = TABS[(index - 1 + TABS.length) % TABS.length] ?? null;
    if (event.key === 'Home') next = TABS[0] ?? null;
    if (event.key === 'End') next = TABS[TABS.length - 1] ?? null;
    if (next) {
      event.preventDefault();
      select(next, true);
    }
  };

  return (
    <div className="topic-tabs">
      <div className="topic-tabs__list" role="tablist" aria-label={TOPIC_TABS.label}>
        {TABS.map((tab) => {
          const selected = tab === active;
          return (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[tab] = element;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${tab}`}
              tabIndex={selected ? 0 : -1}
              className="topic-tabs__tab"
              onClick={() => select(tab)}
              onKeyDown={onKeyDown}
            >
              <span className="topic-tabs__label">{TOPIC_TABS[tab].label}</span>
              <span className="topic-tabs__hint">{TOPIC_TABS[tab].hint}</span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${active}`}
        aria-labelledby={`${idPrefix}-tab-${active}`}
        className="topic-tabs__panel"
      >
        {renderPanel(active)}
      </div>
    </div>
  );
}
