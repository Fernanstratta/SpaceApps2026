import type { MouseEvent } from 'react';
import { LANGUAGES, type Language } from '../../i18n/config';
import { useI18n } from '../../i18n/I18nContext';
import { useRouter } from '../../router/Router';

/**
 * Selector «ES / EN». Cada opción es un enlace real a la misma página en el
 * otro idioma (se puede abrir en otra pestaña o compartir). Con un clic
 * normal cambia de idioma sin recargar y guarda la elección, que tendrá
 * prioridad sobre la detección automática en las próximas visitas.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, messages, setLanguage } = useI18n();
  const { path, href } = useRouter();
  const { LANGUAGE } = messages;

  const onClick = (event: MouseEvent<HTMLAnchorElement>, next: Language) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setLanguage(next);
  };

  return (
    <nav className={['lang-switch', className].filter(Boolean).join(' ')} aria-label={LANGUAGE.switcherLabel}>
      {LANGUAGES.map((option) => {
        const isCurrent = option === language;
        return (
          <a
            key={option}
            href={href(path, option)}
            hrefLang={option}
            lang={option}
            className="lang-switch__option"
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={isCurrent ? LANGUAGE.names[option] : LANGUAGE.switchTo[option]}
            title={LANGUAGE.names[option]}
            onClick={(event) => onClick(event, option)}
          >
            {option.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}
