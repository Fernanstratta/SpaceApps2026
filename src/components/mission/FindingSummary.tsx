import { isSimulated } from '../../data/missions/roverMission';
import type { FindingDraft } from '../../hooks/useMissionProgress';
import { useI18n } from '../../i18n/I18nContext';
import { useRoverMissionText } from '../../i18n/missions';
import { SourceLink } from './SourceLink';

export interface FindingText {
  /** Dónde se miró: sitio, tramo y punto (o la foto). */
  where: string;
  /** Qué dato se leyó, con unidades. */
  data: string;
  /** Qué vista y capas estaban activas. */
  consulted: string;
}

/** Textos de un hallazgo en el idioma activo (se guardan números, no frases). */
export function useFindingText() {
  const { locale } = useI18n();
  const text = useRoverMissionText();
  const f0 = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const f1 = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const n0 = (v: number | undefined) => (v === undefined ? '—' : f0.format(v));
  const n1 = (v: number | undefined) => (v === undefined ? '—' : f1.format(v));

  return (finding: FindingDraft): FindingText => {
    const site = text.sites[finding.site].name;
    const direction = finding.direction === 'north-south' ? text.viewer.northSouth : text.viewer.westEast;
    const { values } = finding;
    const t = text.finding;
    const layers =
      finding.kind === 'photo'
        ? [t.layers.photo]
        : [t.layers.profile, ...(finding.slopeLayer ? [t.layers.slope] : []), ...(finding.compared ? [t.layers.compared] : [])];

    if (finding.kind === 'photo') {
      return { where: t.where.photo(site), data: t.photo, consulted: layers.join(', ') };
    }
    if (finding.kind === 'transect') {
      return {
        where: t.where.transect(site, direction),
        data: t.transect(n0(values.depth), n0(values.rimToRim), n1(values.maxSlope), n1(values.meanSlope)),
        consulted: layers.join(', '),
      };
    }
    return {
      where: t.where.point(site, direction, n0(values.distance)),
      data: t.point(n0(values.height), n1(values.slope)),
      consulted: layers.join(', '),
    };
  };
}

/** Bloque reutilizable: referencia, dato, capas, fuentes y (si aplica) «dato simulado». */
export function FindingSummary({ finding, showNote = true }: { finding: FindingDraft; showNote?: boolean }) {
  const text = useRoverMissionText();
  const describe = useFindingText();
  const { where, data, consulted } = describe(finding);
  const simulated = isSimulated(finding.sourceIds);
  return (
    <div className="finding-summary">
      <p className="finding-summary__where">
        {where}
        {simulated ? <span className="simulated-tag">{text.viewer.simulated}</span> : null}
      </p>
      <p className="finding-summary__data">{data}</p>
      <p className="finding-summary__meta">
        {text.finding.consulted}: {consulted} · {text.log.source}:{' '}
        {finding.sourceIds.map((id, i) => (
          <span key={id}>
            {i > 0 ? ', ' : null}
            <SourceLink id={id} />
          </span>
        ))}
      </p>
      {showNote && finding.note.trim() ? <p className="finding-summary__note">«{finding.note.trim()}»</p> : null}
    </div>
  );
}
