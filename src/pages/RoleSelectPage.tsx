import { StudentIcon, TeacherIcon } from '../components/common/Icons';
import { PORTAL_VIEWS, type PortalView } from '../context/PortalViewContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePortalView } from '../hooks/usePortalView';
import { useMessages } from '../i18n/I18nContext';
import { useRouter } from '../router/Router';
import { ROUTES } from '../router/routes';

const ICONS: Record<PortalView, typeof StudentIcon> = { learn: StudentIcon, teach: TeacherIcon };

/**
 * Entrada al Portal Educativo: una pantalla casi en blanco que solo pregunta
 * si se entra como estudiante o como docente. Al elegir, lleva al Portal con
 * esa vista. La elección se puede cambiar después con `PortalViewSwitch`.
 */
export function RoleSelectPage() {
  const { ROLE_SELECT, PORTAL_TEXT } = useMessages();
  const { view, hasChosenView, setView } = usePortalView();
  const { navigate } = useRouter();
  useDocumentTitle(ROLE_SELECT.documentTitle);

  const choose = (next: PortalView) => {
    setView(next);
    navigate(ROUTES.portal);
  };

  return (
    <div className="role-select">
      <div className="role-select__inner">
        <p className="role-select__eyebrow">{PORTAL_TEXT.title}</p>
        <h1 className="role-select__title">{ROLE_SELECT.title}</h1>
        <p className="role-select__lead">{ROLE_SELECT.lead}</p>

        <ul className="role-select__options" aria-label={ROLE_SELECT.optionsLabel}>
          {PORTAL_VIEWS.map((option) => {
            const Icon = ICONS[option];
            const text = ROLE_SELECT[option];
            const isCurrent = hasChosenView && view === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  className={`role-option role-option--${option}${isCurrent ? ' is-current' : ''}`}
                  onClick={() => choose(option)}
                >
                  <span className="role-option__icon" aria-hidden="true">
                    <Icon size={28} />
                  </span>
                  <span className="role-option__label">{text.label}</span>
                  <span className="role-option__description">{text.description}</span>
                  {isCurrent ? <span className="role-option__current">{ROLE_SELECT.current}</span> : null}
                  <span className="role-option__cta" aria-hidden="true">
                    {text.cta} →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="role-select__note">{ROLE_SELECT.note}</p>
      </div>
    </div>
  );
}
