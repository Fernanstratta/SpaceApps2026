import type { ClassroomAlternativeType, LearningActivityType } from '../../types';

/**
 * Textos de la interfaz en español (idioma de referencia).
 * `en.ts` debe tener exactamente la misma forma: el tipo `Messages` se deriva
 * de este objeto y TypeScript avisa si falta o sobra una clave.
 * El contenido de datos (temas, submódulos, créditos, recursos) se traduce en
 * `src/i18n/content/`.
 */

const learningActivityTypes: Record<LearningActivityType, string> = {
  observation: 'Observación',
  calculation: 'Cálculo',
  model: 'Modelo',
  reflection: 'Reflexión',
  exploration: 'Exploración',
};

const classroomAlternativeTypes: Record<ClassroomAlternativeType, string> = {
  'physical-model': 'Modelos físicos',
  experiment: 'Experimentos',
  demonstration: 'Demostraciones',
  printable: 'Actividades imprimibles',
  exercise: 'Ejercicios educativos',
};

export const es = {
  META: {
    description: 'Terranauta: recurso educativo para explorar conceptos astronómicos de la Tierra y la Luna.',
  },

  UI: {
    siteName: 'Terranauta',
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
  },

  NAV_LABELS: {
    home: 'Inicio',
    playground: 'Playground',
    about: 'Sobre Nosotros',
    resources: 'Recursos',
    portal: 'Portal Educativo',
  },

  LANGUAGE: {
    switcherLabel: 'Idioma',
    names: { es: 'Español', en: 'English' },
    /** Texto accesible de cada opción del selector ES / EN. */
    switchTo: { es: 'Ver en español', en: 'View in English' },
  },

  THEME: {
    toLight: 'Cambiar a modo claro',
    toDark: 'Cambiar a modo oscuro',
    groupLabel: 'Tema de la aplicación',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },

  DRAWER: {
    accountLabel: 'Cuenta',
    guest: 'Invitado',
    guestHint: 'Inicia sesión para guardar tu progreso.',
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    navigation: 'Navegación',
    mySpace: 'Mi espacio',
    progress: 'Mi progreso',
    favorites: 'Favoritos',
    preferences: 'Preferencias',
    theme: 'Tema',
    language: 'Idioma',
    support: 'Soporte',
    helpCenter: 'Centro de ayuda',
    soon: 'Pronto',
    portalGroup: 'Portal Educativo',
    portalView: 'Ver el portal como',
  },

  AUTH: {
    login: {
      title: 'Iniciar sesión',
      lead: 'Accede para guardar tu progreso y tus temas favoritos.',
      submit: 'Iniciar sesión',
      switchText: '¿Aún no tienes cuenta?',
      switchLink: 'Crear cuenta',
    },
    register: {
      title: 'Crear cuenta',
      lead: 'Regístrate como estudiante o docente para personalizar tu experiencia.',
      submit: 'Crear cuenta',
      switchText: '¿Ya tienes cuenta?',
      switchLink: 'Iniciar sesión',
    },
    name: 'Nombre',
    role: 'Soy',
    student: 'Estudiante',
    teacher: 'Docente',
    email: 'Correo electrónico',
    password: 'Contraseña',
    passwordHint: 'Mínimo 8 caracteres.',
    remember: 'Recordarme en este dispositivo',
    comingSoonTitle: 'Las cuentas de Terranauta estarán disponibles muy pronto.',
    comingSoonBody: 'Mientras tanto puedes explorar todo el contenido sin registrarte.',
    goToPortal: 'Ir al Portal Educativo',
    continueAsGuest: 'Continuar como invitado',
  },

  HOME: {
    hero: {
      title: 'Terranauta',
      lead: 'Explora el universo a través de la Tierra. Descubre cómo los fenómenos y características de la Luna y otros cuerpos celestes se relacionan con nuestro planeta mediante experiencias educativas.',
      primaryCta: 'Explorar Portal Educativo',
    },
    intro: {
      title: '¿Qué es Terranauta?',
      purpose: {
        title: '¿Para qué sirve?',
        body: 'Reúne temas de astronomía en un solo lugar, con información organizada para aprender en casa o en el salón de clases.',
      },
      realWorld: {
        title: 'Aprender desde lugares conocidos',
        body: 'Terranauta relacionará la información astronómica con lugares reales de la Tierra. Así, los conceptos científicos se entienden a partir de entornos familiares y los docentes pueden planear actividades y salidas escolares.',
      },
    },
    audiences: {
      title: 'Cada tema, dos vistas',
      student: 'para estudiantes',
      teacher: 'para docentes',
      cta: 'Explorar los módulos',
    },
    topicsTitle: 'Temas del portal',
    earthAlt: 'Modelo 3D de un planeta girando que alterna entre la Tierra, la Luna y Marte',
    earthFallbackAlt: 'Ilustración de la Tierra',
  },

  ABOUT: {
    eyebrow: 'Sobre el proyecto',
    title: '¿Qué es Terranauta?',
    lead: 'Un portal educativo para explorar el universo partiendo de lo que ya conocemos: la Tierra.',
    features: [
      {
        title: '¿Para qué sirve?',
        text: 'Reúne temas de astronomía en un solo lugar, con información organizada para aprender en casa o en el salón de clases.',
      },
      {
        title: 'Aprender desde lugares conocidos',
        text: 'Terranauta relacionará la información astronómica con lugares reales de la Tierra. Así, los conceptos científicos se entienden a partir de entornos familiares y los docentes pueden planear actividades y salidas escolares.',
      },
    ],
    viewsTitle: 'Cada tema, dos vistas',
    views: [
      {
        title: 'Aprender',
        audience: 'para estudiantes',
        text: 'Conceptos científicos, la Tierra y la Luna lado a lado, lugares reales y actividades.',
      },
      {
        title: 'Enseñar',
        audience: 'para docentes',
        text: 'Planes de clase, recomendaciones geográficas, excursiones y alternativas para el aula.',
      },
    ],
    cta: 'Explorar los módulos',
  },

  /** The two views of every topic: learning content and teaching resources. */
  TOPIC_TABS: {
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
  },

  /** Selector de vista del Portal (menú lateral, barra lateral de submódulos, portal y temas). */
  VIEW_SWITCH: {
    label: 'Vista del Portal Educativo',
    showingAs: 'Ver como',
    learn: 'Estudiante',
    teach: 'Docente',
  },

  /** Pantalla de entrada al Portal: elegir la vista. */
  ROLE_SELECT: {
    documentTitle: 'Elige tu vista',
    title: '¿Cómo quieres entrar al Portal Educativo?',
    lead: 'Los módulos son los mismos en las dos vistas; cambia el contenido que verás en cada uno.',
    optionsLabel: 'Vistas disponibles',
    learn: {
      label: 'Soy estudiante',
      description: 'Aprende cada tema con explicaciones, fotografías, ejemplos y actividades.',
      cta: 'Entrar a aprender',
    },
    teach: {
      label: 'Soy docente',
      description: 'Consulta el plan de clase de cada módulo: objetivos, estructura de la sesión, actividades y evaluación.',
      cta: 'Entrar a enseñar',
    },
    current: 'Vista actual',
    note: 'Puedes cambiar de vista cuando quieras con el selector «Estudiante / Docente» del menú lateral.',
  },

  PORTAL_TEXT: {
    title: 'Portal Educativo',
    modulesTitle: 'Módulos',
    intro:
      'Nueve ejes para comparar la Tierra y la Luna. Cada eje avanza en tres submódulos: qué describe, cómo se mide y su aplicación a sitios reales de Baja California y Sonora.',
    searchLabel: 'Buscar módulos',
    searchPlaceholder: 'Buscar por eje, submódulo o materia…',
    clearSearch: 'Limpiar búsqueda',
    resultCount: (n: number) => (n === 1 ? '1 módulo encontrado' : `${n} módulos encontrados`),
    noResults: (query: string) => `No encontramos módulos para «${query}». Prueba con otra palabra.`,
    viewTopic: 'Ver tema',
    topicNumber: 'Eje',
    submodulesTitle: 'Submódulos',
    topicNotFoundTitle: 'Tema no encontrado',
    topicNotFoundBody: 'El tema que buscas no existe o cambió de dirección.',
    gamesEyebrow: 'Juegos educativos',
    gamesTitle: 'Misiones interactivas',
    gamesIntro: 'Pon en práctica lo que aprendiste en los módulos con estas misiones.',
  },

  PAGER: {
    label: 'Navegación entre temas',
    previous: 'Tema anterior',
    next: 'Tema siguiente',
  },

  /** Página de un tema («módulo»). */
  MODULE_TEXT: {
    submoduleCount: (n: number) => (n === 1 ? '1 submódulo' : `${n} submódulos`),
    aboutTopic: 'Acerca de este tema',
    submodulesLearnIntro:
      'Tres pasos para aprender el eje: qué describe, cómo se mide en la Tierra y en la Luna, y sitios reales de la región. Te recomendamos seguirlos en orden.',
    submodulesTeachIntro:
      'Una sesión por submódulo, en el mismo orden que ven tus estudiantes: objetivos, contenidos a impartir, actividades sugeridas, evaluación y resultados esperados.',
    submoduleNumber: 'Submódulo',
    summaryPending: 'Resumen pendiente',
    /** Resumen de cada paso de la progresión de un eje (tarjetas de submódulo). */
    stageSummaries: {
      concept: 'Qué describe este eje y por qué importa para explorar la Luna.',
      measurement: 'Cómo se mide en la Tierra y en la Luna, y cómo se comparan los datos.',
      analogs: 'El eje aplicado a pares de sitios de Baja California y Sonora con la Luna.',
    },
    startLearning: 'Comenzar',
    openTeacherGuide: 'Ver guía docente',
    teacherSheet: 'Ficha docente',
    teacherPlanTitle: 'Plan del módulo',
    lessonSequence: 'Secuencia de clases',
    lessonSequenceHint: 'Una sesión por submódulo, en este orden.',
    carouselPrevious: 'Ver submódulos anteriores',
    carouselNext: 'Ver más submódulos',
  },

  /** Página de un submódulo. */
  SUBMODULE_TEXT: {
    notFoundTitle: 'Submódulo no encontrado',
    notFoundBody: 'El submódulo que buscas no existe o cambió de dirección.',
    backToTopic: (topic: string) => `Volver a ${topic}`,
    position: (current: number, total: number) => `Submódulo ${current} de ${total}`,
    sidebarLabel: 'Índice del submódulo',
    hideSidebar: 'Esconder',
    showSidebar: 'Mostrar índice',
    modules: 'Módulos',
    topicOverview: 'Presentación del tema',
    references: 'Referencias',
    referencesPending: 'Las referencias se mostrarán cuando este submódulo tenga contenido con fuentes verificadas.',
    submodules: 'Submódulos',
    current: 'Estás aquí',
    pagerLabel: 'Navegación entre submódulos',
    previous: 'Submódulo anterior',
    next: 'Submódulo siguiente',
    nextTopic: 'Siguiente tema',
  },

  IMAGE_TEXT: {
    photo: 'Foto',
    creditsTitle: 'Créditos de las imágenes',
    creditsIntro:
      'Fotografías de Wikimedia Commons. Las obras de la NASA y del USGS son de dominio público; una tiene dedicación CC0.',
    viewSource: 'Ver en Wikimedia Commons',
  },

  STUDENT_SECTIONS: {
    introduction: 'Introducción',
    development: 'Desarrollo del tema',
    conclusion: 'Conclusión',
    scientificConcepts: 'Conceptos científicos',
    earth: 'La Tierra',
    moon: 'La Luna',
    bodies: 'La Tierra y la Luna',
    comparisons: 'Comparación',
    comparisonsDescription: 'Cómo se comparan la Tierra y la Luna en este submódulo.',
    relatedLocations: 'Lugares de la Tierra relacionados',
    additionalFacts: '¿Sabías que…?',
    learningActivities: 'Actividades de aprendizaje',
    knowledgeCheck: 'Comprueba lo que aprendiste',
    quizQuestion: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    quizCorrect: '¡Correcto!',
    quizWrong: 'No exactamente.',
    quizAnswer: (answer: string) => `La respuesta es: ${answer}`,
    exploreTitle: 'Explora más en Terranauta Playground',
    exploreText: 'Abre la comparación completa: los nueve ejes, las fotos de los dos sitios, las fuentes y dónde se rompe la analogía.',
  },

  EDUCATION_LEVEL_LABELS: { primaria: 'Primaria', secundaria: 'Secundaria', preparatoria: 'Preparatoria' },
  LEVEL_LABEL: 'Nivel',

  TEACHER_SECTIONS: {
    general: 'Información general',
    topicName: 'Tema',
    submoduleName: 'Submódulo',
    description: 'Descripción',
    gradeLevel: 'Nivel educativo recomendado',
    estimatedDuration: 'Duración estimada',
    learningObjectives: 'Objetivos de aprendizaje',
    requiredMaterials: 'Materiales necesarios',
    lessonPlan: 'Plan de clase',
    lessonIntroduction: 'Introducción al tema',
    suggestedExplanation: 'Contenidos a impartir',
    classroomActivities: 'Actividades sugeridas',
    discussionQuestions: 'Preguntas de discusión',
    experiments: 'Experimentos o demostraciones',
    assessment: 'Métodos de evaluación',
    expectedOutcomes: 'Resultados esperados',
    activities: 'Actividades complementarias',
    geographicalRecommendations: 'Recomendaciones geográficas',
    fieldTrips: 'Excursiones educativas',
    classroomAlternatives: 'Alternativas dentro del aula',
    priorKnowledge: 'Conocimientos previos',
    playground: 'Para proyectar en clase',
    playgroundText: 'Abre la comparación de los pares de esta sesión en Terranauta Playground.',
  },

  LOCATION_TEXT: {
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
    referenceDescription: 'Las distancias a los lugares recomendados se calcularán desde esta ubicación.',
    referenceFuture: 'En una próxima versión podrás elegir otra ubicación de referencia.',
    mapTitle: 'Mapa',
    mapPending: 'El mapa se mostrará cuando existan ubicaciones registradas para este tema.',
    mapEmpty: 'No hay ubicaciones registradas para mostrar en el mapa.',
    mapLoading: 'Cargando mapa…',
    mapError: 'No fue posible cargar el mapa. Revisa tu conexión e inténtalo de nuevo.',
    mapLabel: 'Mapa interactivo de ubicaciones',
    osmAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">Colaboradores de OpenStreetMap</a>',
    /** Abreviaturas de los puntos cardinales en las coordenadas. */
    cardinal: { north: 'N', south: 'S', east: 'E', west: 'O' },
  },

  COMPARISON_TEXT: {
    property: 'Propiedad',
    earth: 'Tierra',
    moon: 'Luna',
    ratio: 'Relación Luna/Tierra',
    explanation: 'Explicación',
    source: 'Fuente',
  },

  LEARNING_ACTIVITY_TYPE_LABELS: learningActivityTypes,
  CLASSROOM_ALTERNATIVE_LABELS: classroomAlternativeTypes,

  RESOURCE_TEXT: {
    title: 'Recursos',
    intro:
      'Estas son las fuentes científicas y los conjuntos de datos que Terranauta utiliza o utilizará. Todas pertenecen a organizaciones reconocidas y pueden consultarse en su sitio oficial.',
    categoriesNav: 'Categorías de recursos',
    organization: 'Organización responsable',
    informationType: 'Tipo de información',
    license: 'Licencia o atribución',
    licenseUnknown: 'Consulta los términos de uso en el sitio de origen.',
    licenseLink: 'Ver términos',
    visit: 'Visitar fuente',
    emptyCategory: 'Todavía no hay recursos registrados en esta categoría.',
    count: (n: number) => (n === 1 ? '1 recurso' : `${n} recursos`),
  },

  NOT_FOUND_TEXT: {
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o fue movida.',
    goHome: 'Ir al inicio',
  },
};

export type Messages = typeof es;
