import type { ClassroomAlternativeType, LearningActivityType } from '../types';

/**
 * Shared user-facing strings (Spanish). Page-specific copy lives in
 * `home.ts` and `about.ts` so it can be edited without touching components.
 */
export const UI = {
  siteName: 'Starman',
  tagline: 'Recurso educativo sobre la Tierra y la Luna',
  skipToContent: 'Saltar al contenido principal',
  openMenu: 'Abrir menú de navegación',
  closeMenu: 'Cerrar menú de navegación',
  mainNavLabel: 'Navegación principal',
  footerNavLabel: 'Navegación del pie de página',
  externalLinkHint: '(se abre en una pestaña nueva)',
  backToTopics: 'Volver a los temas',
  onThisPage: 'En esta página',
  loading: 'Cargando…',
  pending: 'Contenido pendiente. Esta información se incorporará en una próxima actualización.',
  empty: 'No hay elementos registrados en esta sección.',
  fieldPending: 'Pendiente',
  genericError: 'Ocurrió un error al mostrar esta sección.',
} as const;

export const NAV_LABELS = {
  home: 'Inicio',
  about: 'Sobre Nosotros',
  resources: 'Recursos',
  portal: 'Portal Educativo',
} as const;

/** The two views of every topic: learning content and teaching resources. */
export const TOPIC_TABS = {
  label: 'Vistas del tema',
  learn: {
    label: 'Aprender',
    hint: 'Para estudiantes',
    description: 'Conceptos científicos, la Tierra y la Luna lado a lado, lugares reales y actividades.',
  },
  teach: {
    label: 'Enseñar',
    hint: 'Para docentes',
    description: 'Planes de clase, recomendaciones geográficas, excursiones y alternativas para el aula.',
  },
} as const;

export const PORTAL_TEXT = {
  title: 'Portal Educativo',
  modulesTitle: 'Módulos',
  intro: 'Cada tema reúne submódulos con fotografías reales de la Tierra y la Luna.',
  searchLabel: 'Buscar módulos',
  searchPlaceholder: 'Buscar por tema, módulo o materia…',
  clearSearch: 'Limpiar búsqueda',
  resultCount: (n: number) => (n === 1 ? '1 módulo encontrado' : `${n} módulos encontrados`),
  noResults: (query: string) => `No encontramos módulos para «${query}». Prueba con otra palabra.`,
  viewTopic: 'Ver tema',
  topicNumber: 'Tema',
  submodulesTitle: 'Submódulos',
  topicNotFoundTitle: 'Tema no encontrado',
  topicNotFoundBody: 'El tema que buscas no existe o cambió de dirección.',
} as const;

export const SUBMODULE_TEXT = {
  notFoundTitle: 'Módulo no encontrado',
  notFoundBody: 'El módulo que buscas no existe o cambió de dirección.',
  contentTitle: 'Contenido del módulo',
  backToTopic: (topic: string) => `Ir al tema «${topic}»`,
  otherInTopic: 'Más módulos de este tema',
} as const;

export const IMAGE_TEXT = {
  photo: 'Foto',
  creditsTitle: 'Créditos de las imágenes',
  creditsIntro:
    'Fotografías de Wikimedia Commons. Las obras de la NASA y del USGS son de dominio público; una tiene dedicación CC0.',
  viewSource: 'Ver en Wikimedia Commons',
} as const;

export const STUDENT_SECTIONS = {
  introduction: 'Introducción',
  scientificConcepts: 'Conceptos científicos',
  earth: 'La Tierra',
  moon: 'La Luna',
  bodies: 'La Tierra y la Luna',
  comparisons: 'Comparaciones entre la Tierra y la Luna',
  relatedLocations: 'Lugares de la Tierra relacionados',
  additionalFacts: 'Datos adicionales',
  learningActivities: 'Actividades de aprendizaje',
} as const;

export const TEACHER_SECTIONS = {
  general: 'Información general',
  topicName: 'Nombre del tema',
  description: 'Descripción',
  gradeLevel: 'Nivel educativo recomendado',
  estimatedDuration: 'Duración estimada',
  learningObjectives: 'Objetivos de aprendizaje',
  requiredMaterials: 'Materiales necesarios',
  lessonPlan: 'Plan de clase',
  lessonIntroduction: 'Introducción al tema',
  suggestedExplanation: 'Explicación sugerida',
  classroomActivities: 'Actividades en el aula',
  discussionQuestions: 'Preguntas de discusión',
  experiments: 'Experimentos o demostraciones',
  assessment: 'Métodos de evaluación',
  activities: 'Actividades',
  geographicalRecommendations: 'Recomendaciones geográficas',
  fieldTrips: 'Excursiones educativas',
  classroomAlternatives: 'Alternativas dentro del aula',
} as const;

export const LOCATION_TEXT = {
  name: 'Nombre de la ubicación',
  description: 'Descripción',
  features: 'Características geográficas',
  coordinates: 'Coordenadas',
  distance: 'Distancia desde la ubicación de referencia',
  relation: 'Relación con el tema',
  suggestedActivities: 'Actividades sugeridas',
  fieldTripActivities: 'Actividades en la ubicación',
  accessibility: 'Accesibilidad',
  safety: 'Seguridad',
  materials: 'Materiales necesarios',
  referenceTitle: 'Ubicación de referencia',
  referenceDescription:
    'Las distancias a los lugares recomendados se calcularán desde esta ubicación.',
  referenceFuture: 'En una próxima versión podrás elegir otra ubicación de referencia.',
  mapTitle: 'Mapa',
  mapPending: 'El mapa se mostrará cuando existan ubicaciones registradas para este tema.',
  mapEmpty: 'No hay ubicaciones registradas para mostrar en el mapa.',
  mapLoading: 'Cargando mapa…',
  mapError: 'No fue posible cargar el mapa. Revisa tu conexión e inténtalo de nuevo.',
  mapLabel: 'Mapa interactivo de ubicaciones',
  osmAttribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">Colaboradores de OpenStreetMap</a>',
} as const;

export const COMPARISON_TEXT = {
  property: 'Propiedad',
  earth: 'Tierra',
  moon: 'Luna',
  ratio: 'Relación Luna/Tierra',
  explanation: 'Explicación',
  source: 'Fuente',
} as const;

export const LEARNING_ACTIVITY_TYPE_LABELS: Record<LearningActivityType, string> = {
  observation: 'Observación',
  calculation: 'Cálculo',
  model: 'Modelo',
  reflection: 'Reflexión',
  exploration: 'Exploración',
};

export const CLASSROOM_ALTERNATIVE_LABELS: Record<ClassroomAlternativeType, string> = {
  'physical-model': 'Modelos físicos',
  experiment: 'Experimentos',
  demonstration: 'Demostraciones',
  printable: 'Actividades imprimibles',
  exercise: 'Ejercicios educativos',
};

export const RESOURCE_TEXT = {
  title: 'Recursos',
  intro:
    'Estas son las fuentes científicas y los conjuntos de datos que Starman utiliza o utilizará. Todas pertenecen a organizaciones reconocidas y pueden consultarse en su sitio oficial.',
  categoriesNav: 'Categorías de recursos',
  organization: 'Organización responsable',
  informationType: 'Tipo de información',
  license: 'Licencia o atribución',
  licenseUnknown: 'Consulta los términos de uso en el sitio de origen.',
  licenseLink: 'Ver términos',
  visit: 'Visitar fuente',
  emptyCategory: 'Todavía no hay recursos registrados en esta categoría.',
  count: (n: number) => (n === 1 ? '1 recurso' : `${n} recursos`),
} as const;

export const NOT_FOUND_TEXT = {
  title: 'Página no encontrada',
  body: 'La página que buscas no existe o fue movida.',
  goHome: 'Ir al inicio',
} as const;
