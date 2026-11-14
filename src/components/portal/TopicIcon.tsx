import type { ReactElement } from 'react';
import type { TopicId } from '../../types';

/** Small decorative line icons, one per topic. */
export function TopicIcon({ topicId }: { topicId: TopicId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[topicId]}
    </svg>
  );
}

const ICONS: Record<TopicId, ReactElement> = {
  'size-scale': (
    <>
      <circle cx="9" cy="13" r="6" />
      <circle cx="19" cy="7" r="2.5" />
    </>
  ),
  gravity: (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M12 11v9M8 16l4 4 4-4" />
    </>
  ),
  'surface-terrain': <path d="M2 19l6-9 4 5 3-4 7 8z" />,
  'earth-moon-distance': (
    <>
      <circle cx="5" cy="12" r="3" />
      <circle cx="20" cy="12" r="1.8" />
      <path d="M9 12h8" strokeDasharray="2 2" />
    </>
  ),
  temperature: (
    <>
      <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z" />
      <path d="M12 9v7" />
    </>
  ),
  'impact-craters': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="2.2" />
      <circle cx="15" cy="15" r="1.5" />
    </>
  ),
  atmosphere: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 3a9 9 0 0 1 9 9M3 12a9 9 0 0 1 9-9" strokeDasharray="2 2.5" />
    </>
  ),
  'water-ice': (
    <>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      <path d="M9.5 14.5l5 0M12 12v5" />
    </>
  ),
};
