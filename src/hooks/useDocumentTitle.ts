import { useEffect } from 'react';

const SITE_NAME = 'Starman';

export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
