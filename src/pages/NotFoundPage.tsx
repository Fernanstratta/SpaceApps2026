import { PageHeader } from '../components/layout/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';
import { useMessages } from '../i18n/I18nContext';

export function NotFoundPage() {
  const { NOT_FOUND_TEXT } = useMessages();
  useDocumentTitle(NOT_FOUND_TEXT.title);
  return (
    <>
      <PageHeader title={NOT_FOUND_TEXT.title} lead={NOT_FOUND_TEXT.body} />
      <div className="container page-body">
        <Link to={ROUTES.home} className="button button--primary">
          {NOT_FOUND_TEXT.goHome}
        </Link>
      </div>
    </>
  );
}
