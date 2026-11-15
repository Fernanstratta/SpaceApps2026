import { lazy, Suspense, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { PortalViewProvider } from './context/PortalViewContext';
import { ReferenceLocationProvider } from './context/ReferenceLocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n/I18nContext';
import { AuthPage } from './pages/AuthPage';
import { MissionStudentPage } from './pages/MissionStudentPage';
import { MissionTeacherPage } from './pages/MissionTeacherPage';
import { LunitaMissionPage } from './pages/LunitaMissionPage';
import { EducationalPortalPage } from './pages/EducationalPortalPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
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

/**
 * Vista previa de propuestas de diseño (solo en desarrollo). Se carga aparte
 * y con sus propios estilos, así que no toca la página actual ni el build.
 */
const MissionsPreviewPage = import.meta.env.DEV
  ? lazy(() => import('./pages/MissionsPreviewPage').then((m) => ({ default: m.MissionsPreviewPage })))
  : null;

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
    case ROUTES.portalAccess:
      return <RoleSelectPage />;
    case ROUTES.login:
      return <AuthPage key="login" mode="login" />;
    case ROUTES.register:
      return <AuthPage key="register" mode="register" />;
    case ROUTES.missionStart:
      return <MissionStudentPage />;
    case ROUTES.missionTeach:
      return <MissionTeacherPage />;
    case ROUTES.lunita:
      return <LunitaMissionPage />;
    case ROUTES.missionsPreview:
      return MissionsPreviewPage ? (
        <Suspense fallback={null}>
          <MissionsPreviewPage />
        </Suspense>
      ) : (
        <NotFoundPage />
      );
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
    <ThemeProvider>
      <RouterProvider>
        <I18nProvider>
          <PortalViewProvider>
            <ReferenceLocationProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </ReferenceLocationProvider>
          </PortalViewProvider>
        </I18nProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
