import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { PortalViewProvider } from './context/PortalViewContext';
import { ReferenceLocationProvider } from './context/ReferenceLocationContext';
import { EducationalPortalPage } from './pages/EducationalPortalPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SubmodulePage } from './pages/SubmodulePage';
import { TopicModulePage } from './pages/TopicModulePage';
import { matchPath, RouterProvider, useRouter } from './router/Router';
import {
  LEGACY_SECTION_ROUTES,
  ROUTES,
  sectionHref,
  SUBMODULE_ROUTE_PATTERN,
  TOPIC_ROUTE_PATTERN,
  type SectionId,
} from './router/routes';

/** Keeps old links (/sobre-nosotros, /recursos) working by sending them to the section on Inicio. */
function RedirectToSection({ sectionId }: { sectionId: SectionId }) {
  const { navigate } = useRouter();
  useEffect(() => {
    navigate(sectionHref(sectionId), { replace: true });
  }, [navigate, sectionId]);
  return null;
}

function AppRoutes() {
  const { path } = useRouter();

  const legacySection = LEGACY_SECTION_ROUTES[path];
  if (legacySection) return <RedirectToSection sectionId={legacySection} />;

  switch (path) {
    case ROUTES.home:
      return <HomePage />;
    case ROUTES.portal:
      return <EducationalPortalPage />;
    default: {
      const submoduleMatch = matchPath(SUBMODULE_ROUTE_PATTERN, path);
      if (submoduleMatch?.topicId && submoduleMatch.submoduleId) {
        const key = `${submoduleMatch.topicId}/${submoduleMatch.submoduleId}`;
        return <SubmodulePage key={key} topicId={submoduleMatch.topicId} submoduleId={submoduleMatch.submoduleId} />;
      }
      const topicMatch = matchPath(TOPIC_ROUTE_PATTERN, path);
      if (topicMatch?.topicId) {
        return <TopicModulePage key={topicMatch.topicId} topicId={topicMatch.topicId} />;
      }
      return <NotFoundPage />;
    }
  }
}

export default function App() {
  return (
    <RouterProvider>
      <PortalViewProvider>
        <ReferenceLocationProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </ReferenceLocationProvider>
      </PortalViewProvider>
    </RouterProvider>
  );
}
