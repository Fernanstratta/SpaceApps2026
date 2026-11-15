import type { ReactNode } from 'react';
import { MISSION_SOURCES, type SourceId } from '../../data/missions/roverMission';
import { ExternalLink } from '../common/ExternalLink';

/** Enlace a la fuente de un dato. Por defecto muestra la institución que publica. */
export function SourceLink({ id, children }: { id: SourceId; children?: ReactNode }) {
  const source = MISSION_SOURCES[id];
  return (
    <ExternalLink href={source.url} className="source-link" title={source.title}>
      {children ?? source.publisher}
    </ExternalLink>
  );
}

/** Lista completa de fuentes (para la ficha y la guía). */
export function SourceList({ ids }: { ids: readonly SourceId[] }) {
  return (
    <ul className="source-list">
      {ids.map((id) => (
        <li key={id}>
          <ExternalLink href={MISSION_SOURCES[id].url}>{MISSION_SOURCES[id].title}</ExternalLink>
          <span className="source-list__publisher"> — {MISSION_SOURCES[id].publisher}</span>
        </li>
      ))}
    </ul>
  );
}
