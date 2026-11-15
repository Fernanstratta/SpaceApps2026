import type { Confidence, ValueStatus } from '../../data/lunarAnalogs';
import { useAnalogText } from './useAnalogText';

/**
 * Iconos de estado: la forma distingue el estado además del color y del
 * texto (medido = punto lleno, literatura = libro, referencia = rombo hueco,
 * provisional = círculo punteado).
 */
function StatusIcon({ status }: { status: ValueStatus }) {
  const common = { viewBox: '0 0 16 16', width: 12, height: 12, 'aria-hidden': true, focusable: false } as const;
  switch (status) {
    case 'measured':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5" fill="currentColor" />
        </svg>
      );
    case 'literature':
      return (
        <svg {...common}>
          <path d="M2.5 3.5h4.2c.7 0 1.3.5 1.3 1.2 0-.7.6-1.2 1.3-1.2h4.2v8.6H9.3c-.7 0-1.3.4-1.3 1 0-.6-.6-1-1.3-1H2.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'reference':
      return (
        <svg {...common}>
          <path d="M8 2.5 13.5 8 8 13.5 2.5 8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case 'placeholder':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.2 2.2" />
        </svg>
      );
  }
}

/** Origen de un valor (medido, literatura, referencia o provisional), con icono y texto. */
export function StatusBadge({ status }: { status: ValueStatus }) {
  const { t } = useAnalogText();
  const text = t.statuses[status];
  return (
    <span className={`an-badge an-badge--${status}`} title={text.meaning}>
      <StatusIcon status={status} />
      {text.label}
    </span>
  );
}

/** Confianza del método (A, B o C). La letra siempre es visible; el significado va en `title` y en la leyenda. */
export function ConfidenceBadge({ level, long = false }: { level: Confidence; long?: boolean }) {
  const { t } = useAnalogText();
  return (
    <span className={`an-confidence an-confidence--${level}`} title={t.confidence[level]}>
      {long ? t.confidenceLabel(level) : level}
      {long ? null : <span className="visually-hidden"> — {t.confidenceLabel(level)}</span>}
    </span>
  );
}

/** Insignia «dato con limitaciones conocidas». */
export function LimitationBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useAnalogText();
  return (
    <span className="an-badge an-badge--limitation" title={compact ? t.table.caveatBadge : undefined}>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
        <path d="M8 2 14.5 13.5h-13z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 6.3v3.4M8 11.6v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {compact ? <span className="visually-hidden">{t.table.caveatBadge}</span> : t.table.caveatBadge}
    </span>
  );
}
