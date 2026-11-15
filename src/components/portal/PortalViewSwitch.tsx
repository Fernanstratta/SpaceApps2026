import { useRef, type KeyboardEvent } from 'react';
import { PORTAL_VIEWS, type PortalView } from '../../context/PortalViewContext';
import { usePortalView } from '../../hooks/usePortalView';
import { useMessages } from '../../i18n/I18nContext';
import { StudentIcon, TeacherIcon } from '../common/Icons';

const ICONS: Record<PortalView, typeof StudentIcon> = { learn: StudentIcon, teach: TeacherIcon };

interface PortalViewSwitchProps {
  className?: string;
  /** Visible label before the options (e.g. «Ver como»). Without it the label is only announced. */
  showLabel?: boolean;
}

/**
 * «Estudiante / Docente»: cambia la vista de todo el Portal al instante, sin
 * salir de la página. Como el contenido de cada tema y submódulo se elige con
 * la vista (ver `PortalViewContext`), el módulo o submódulo abierto se queda
 * donde está y solo cambia su versión.
 */
export function PortalViewSwitch({ className, showLabel = false }: PortalViewSwitchProps) {
  const { view, setView } = usePortalView();
  const { VIEW_SWITCH } = useMessages();
  const groupRef = useRef<HTMLDivElement>(null);

  // Flechas: pasan a la otra opción, como en un grupo de botones de radio.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const next: PortalView = view === 'learn' ? 'teach' : 'learn';
    setView(next);
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-view='${next}']`)?.focus();
  };

  const group = (
    <div
      ref={groupRef}
      className="view-switch"
      role="radiogroup"
      aria-label={VIEW_SWITCH.label}
      data-active={view}
      onKeyDown={onKeyDown}
    >
      {PORTAL_VIEWS.map((option) => {
        const Icon = ICONS[option];
        const checked = view === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-view={option}
            className={`view-switch__option view-switch__option--${option}`}
            onClick={() => setView(option)}
          >
            <Icon size={16} />
            <span className="view-switch__text">{VIEW_SWITCH[option]}</span>
          </button>
        );
      })}
    </div>
  );

  if (!showLabel) return className ? <div className={className}>{group}</div> : group;
  return (
    <div className={['view-bar', className].filter(Boolean).join(' ')}>
      <span className="view-bar__label" aria-hidden="true">
        {VIEW_SWITCH.showingAs}
      </span>
      {group}
    </div>
  );
}
