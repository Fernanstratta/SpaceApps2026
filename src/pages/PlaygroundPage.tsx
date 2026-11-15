import { PlaygroundSection } from '../components/playground/PlaygroundSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18nContext';
import { PLAYGROUND_TEXT } from '../i18n/playground';

/**
 * Starman Playground en su propia pestaña (`/playground`), como el Portal
 * Educativo: la consola de exploración de análogos de la Luna y de Marte.
 */
export function PlaygroundPage() {
  const { language } = useI18n();
  useDocumentTitle(PLAYGROUND_TEXT[language].title);
  return <PlaygroundSection />;
}
