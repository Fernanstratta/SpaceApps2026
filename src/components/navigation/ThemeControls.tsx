import { useTheme, type ThemePreference } from '../../context/ThemeContext';
import { useMessages } from '../../i18n/I18nContext';
import { MonitorIcon, MoonIcon, SunIcon } from '../common/Icons';

const OPTIONS: { value: ThemePreference; Icon: typeof SunIcon }[] = [
  { value: 'light', Icon: SunIcon },
  { value: 'dark', Icon: MoonIcon },
  { value: 'system', Icon: MonitorIcon },
];

/** Botón rápido del header: alterna entre modo claro y oscuro. */
export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const { THEME } = useMessages();
  const isDark = theme === 'dark';
  const label = isDark ? THEME.toLight : THEME.toDark;
  return (
    <button type="button" className="icon-button" onClick={toggleTheme} aria-label={label} title={label}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/** Selector de tres opciones (claro / oscuro / sistema) para el menú lateral. */
export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();
  const { THEME } = useMessages();
  return (
    <div className="theme-switch" role="radiogroup" aria-label={THEME.groupLabel}>
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          className="theme-switch__option"
          onClick={() => setPreference(value)}
        >
          <Icon size={16} />
          {THEME[value]}
        </button>
      ))}
    </div>
  );
}
