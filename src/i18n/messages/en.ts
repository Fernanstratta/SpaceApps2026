import type { Messages } from './es';

/** English interface copy. Same shape as `es.ts` (enforced by the `Messages` type). */
export const en: Messages = {
  META: {
    description: 'Starman: an educational resource to explore astronomy concepts about the Earth and the Moon.',
  },

  UI: {
    siteName: 'Starman',
    tagline: 'Educational resource about the Earth and the Moon',
    skipToContent: 'Skip to main content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    mainNavLabel: 'Main navigation',
    footerNavLabel: 'Footer navigation',
    externalLinkHint: '(opens in a new tab)',
    backToTopics: 'Back to topics',
    onThisPage: 'On this page',
    loading: 'Loading…',
    pending: 'Content pending. This information will be added in a future update.',
    empty: 'There are no entries in this section.',
    fieldPending: 'Pending',
    genericError: 'Something went wrong while displaying this section.',
  },

  NAV_LABELS: {
    home: 'Home',
    playground: 'Playground',
    about: 'About Us',
    resources: 'Resources',
    portal: 'Educational Portal',
  },

  LANGUAGE: {
    switcherLabel: 'Language',
    names: { es: 'Español', en: 'English' },
    switchTo: { es: 'Ver en español', en: 'View in English' },
  },

  THEME: {
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    groupLabel: 'App theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },

  DRAWER: {
    accountLabel: 'Account',
    guest: 'Guest',
    guestHint: 'Sign in to save your progress.',
    signIn: 'Sign in',
    signUp: 'Create account',
    navigation: 'Navigation',
    mySpace: 'My space',
    progress: 'My progress',
    favorites: 'Favorites',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    support: 'Support',
    helpCenter: 'Help center',
    soon: 'Soon',
    portalGroup: 'Educational Portal',
    portalView: 'View the portal as',
  },

  AUTH: {
    login: {
      title: 'Sign in',
      lead: 'Sign in to save your progress and favorite topics.',
      submit: 'Sign in',
      switchText: 'Don’t have an account yet?',
      switchLink: 'Create account',
    },
    register: {
      title: 'Create account',
      lead: 'Sign up as a student or teacher to personalize your experience.',
      submit: 'Create account',
      switchText: 'Already have an account?',
      switchLink: 'Sign in',
    },
    name: 'Name',
    role: 'I am a',
    student: 'Student',
    teacher: 'Teacher',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 8 characters.',
    remember: 'Remember me on this device',
    comingSoonTitle: 'Starman accounts are coming very soon.',
    comingSoonBody: 'In the meantime, you can explore all the content without signing up.',
    goToPortal: 'Go to the Educational Portal',
    continueAsGuest: 'Continue as a guest',
  },

  HOME: {
    hero: {
      title: 'Starman',
      lead: 'Explore the universe through the Earth. Discover how the phenomena and features of the Moon and other celestial bodies relate to our planet through educational experiences.',
      primaryCta: 'Explore the Educational Portal',
    },
    intro: {
      title: 'What is Starman?',
      purpose: {
        title: 'What is it for?',
        body: 'It brings astronomy topics together in one place, with organized information for learning at home or in the classroom.',
      },
      realWorld: {
        title: 'Learning from familiar places',
        body: 'Starman will connect astronomical information with real places on Earth. That way, scientific concepts are understood through familiar settings, and teachers can plan activities and school trips.',
      },
    },
    audiences: {
      title: 'Every topic, two views',
      student: 'for students',
      teacher: 'for teachers',
      cta: 'Explore the modules',
    },
    topicsTitle: 'Portal topics',
    earthAlt: '3D model of a spinning planet that alternates between the Earth, the Moon and Mars',
    earthFallbackAlt: 'Illustration of the Earth',
  },

  ABOUT: {
    eyebrow: 'About the project',
    title: 'What is Starman?',
    lead: 'An educational portal to explore the universe starting from what we already know: the Earth.',
    features: [
      {
        title: 'What is it for?',
        text: 'It brings astronomy topics together in one place, with organized information for learning at home or in the classroom.',
      },
      {
        title: 'Learning from familiar places',
        text: 'Starman will connect astronomical information with real places on Earth. That way, scientific concepts are understood through familiar settings, and teachers can plan activities and school trips.',
      },
    ],
    viewsTitle: 'Every topic, two views',
    views: [
      {
        title: 'Learn',
        audience: 'for students',
        text: 'Scientific concepts, the Earth and the Moon side by side, real places and activities.',
      },
      {
        title: 'Teach',
        audience: 'for teachers',
        text: 'Lesson plans, geographic recommendations, field trips and classroom alternatives.',
      },
    ],
    cta: 'Explore the modules',
  },

  TOPIC_TABS: {
    label: 'Topic views',
    learn: {
      label: 'Learn',
      hint: 'For students',
      description: 'Scientific concepts, the Earth and the Moon side by side, real places and activities.',
    },
    teach: {
      label: 'Teach',
      hint: 'For teachers',
      description: 'Lesson plans, geographic recommendations, field trips and classroom alternatives.',
    },
  },

  VIEW_SWITCH: {
    label: 'Educational Portal view',
    showingAs: 'View as',
    learn: 'Student',
    teach: 'Teacher',
  },

  ROLE_SELECT: {
    documentTitle: 'Choose your view',
    title: 'How would you like to enter the Educational Portal?',
    lead: 'The modules are the same in both views; what changes is the content you will see in each one.',
    optionsLabel: 'Available views',
    learn: {
      label: 'I’m a student',
      description: 'Learn each topic through explanations, photographs, examples and activities.',
      cta: 'Start learning',
    },
    teach: {
      label: 'I’m a teacher',
      description: 'Open the lesson plan for each module: objectives, session structure, activities and assessment.',
      cta: 'Start teaching',
    },
    current: 'Current view',
    note: 'You can switch views at any time with the “Student / Teacher” selector in the side menu.',
  },

  PORTAL_TEXT: {
    title: 'Educational Portal',
    modulesTitle: 'Modules',
    intro: 'Each topic brings together submodules with real photographs of the Earth and the Moon.',
    searchLabel: 'Search modules',
    searchPlaceholder: 'Search by topic, module or subject…',
    clearSearch: 'Clear search',
    resultCount: (n: number) => (n === 1 ? '1 module found' : `${n} modules found`),
    noResults: (query: string) => `We couldn’t find modules for “${query}”. Try another word.`,
    viewTopic: 'View topic',
    topicNumber: 'Topic',
    submodulesTitle: 'Submodules',
    topicNotFoundTitle: 'Topic not found',
    topicNotFoundBody: 'The topic you are looking for doesn’t exist or has moved.',
    gamesEyebrow: 'Educational games',
    gamesTitle: 'Interactive missions',
    gamesIntro: 'Put what you learned in the modules into practice with these missions.',
  },

  PAGER: {
    label: 'Topic navigation',
    previous: 'Previous topic',
    next: 'Next topic',
  },

  /** Topic ("module") page. */
  MODULE_TEXT: {
    submoduleCount: (n: number) => (n === 1 ? '1 submodule' : `${n} submodules`),
    aboutTopic: 'About this topic',
    submodulesLearnIntro: 'Each submodule explores one part of the topic. Follow them in order or pick the one you like best.',
    submodulesTeachIntro: 'Each submodule includes its teaching guide: objectives, lesson plan, activities and resources.',
    submoduleNumber: 'Submodule',
    summaryPending: 'Summary pending',
    startLearning: 'Start',
    openTeacherGuide: 'View teaching guide',
    teacherSheet: 'Teaching sheet',
    teacherPlanTitle: 'Module plan',
    lessonSequence: 'Lesson sequence',
    lessonSequenceHint: 'One session per submodule, in this order.',
    carouselPrevious: 'Show previous submodules',
    carouselNext: 'Show more submodules',
  },

  /** Submodule page. */
  SUBMODULE_TEXT: {
    notFoundTitle: 'Submodule not found',
    notFoundBody: 'The submodule you are looking for doesn’t exist or has moved.',
    backToTopic: (topic: string) => `Back to ${topic}`,
    position: (current: number, total: number) => `Submodule ${current} of ${total}`,
    sidebarLabel: 'Submodule contents',
    hideSidebar: 'Hide',
    showSidebar: 'Show contents',
    modules: 'Modules',
    topicOverview: 'Topic overview',
    references: 'References',
    referencesPending: 'References will appear once this submodule has content with verified sources.',
    submodules: 'Submodules',
    current: 'You are here',
    pagerLabel: 'Submodule navigation',
    previous: 'Previous submodule',
    next: 'Next submodule',
    nextTopic: 'Next topic',
  },

  IMAGE_TEXT: {
    photo: 'Photo',
    creditsTitle: 'Image credits',
    creditsIntro:
      'Photographs from Wikimedia Commons. NASA and USGS works are in the public domain; one has a CC0 dedication.',
    viewSource: 'View on Wikimedia Commons',
  },

  STUDENT_SECTIONS: {
    introduction: 'Introduction',
    development: 'Exploring the topic',
    conclusion: 'Conclusion',
    scientificConcepts: 'Scientific concepts',
    earth: 'The Earth',
    moon: 'The Moon',
    bodies: 'The Earth and the Moon',
    comparisons: 'Comparison',
    comparisonsDescription: 'How the Earth and the Moon compare in this submodule.',
    relatedLocations: 'Related places on Earth',
    additionalFacts: 'Did you know…?',
    learningActivities: 'Learning activities',
  },

  TEACHER_SECTIONS: {
    general: 'General information',
    topicName: 'Topic',
    submoduleName: 'Submodule',
    description: 'Description',
    gradeLevel: 'Recommended grade level',
    estimatedDuration: 'Estimated duration',
    learningObjectives: 'Learning objectives',
    requiredMaterials: 'Required materials',
    lessonPlan: 'Lesson plan',
    lessonIntroduction: 'Introduction to the topic',
    suggestedExplanation: 'Suggested explanation',
    classroomActivities: 'Classroom activities',
    discussionQuestions: 'Discussion questions',
    experiments: 'Experiments or demonstrations',
    assessment: 'Assessment methods',
    activities: 'Activities',
    geographicalRecommendations: 'Geographic recommendations',
    fieldTrips: 'Educational field trips',
    classroomAlternatives: 'In-classroom alternatives',
  },

  LOCATION_TEXT: {
    name: 'Location name',
    description: 'Description',
    features: 'Geographic features',
    coordinates: 'Coordinates',
    distance: 'Distance from the reference location',
    relation: 'Connection to the topic',
    suggestedActivities: 'Suggested activities',
    fieldTripActivities: 'Activities at the location',
    accessibility: 'Accessibility',
    safety: 'Safety',
    materials: 'Required materials',
    referenceTitle: 'Reference location',
    referenceDescription: 'Distances to the recommended places will be calculated from this location.',
    referenceFuture: 'In a future version you will be able to choose another reference location.',
    mapTitle: 'Map',
    mapPending: 'The map will be shown once locations are registered for this topic.',
    mapEmpty: 'There are no registered locations to show on the map.',
    mapLoading: 'Loading map…',
    mapError: 'The map could not be loaded. Check your connection and try again.',
    mapLabel: 'Interactive map of locations',
    osmAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    cardinal: { north: 'N', south: 'S', east: 'E', west: 'W' },
  },

  COMPARISON_TEXT: {
    property: 'Property',
    earth: 'Earth',
    moon: 'Moon',
    ratio: 'Moon/Earth ratio',
    explanation: 'Explanation',
    source: 'Source',
  },

  LEARNING_ACTIVITY_TYPE_LABELS: {
    observation: 'Observation',
    calculation: 'Calculation',
    model: 'Model',
    reflection: 'Reflection',
    exploration: 'Exploration',
  },

  CLASSROOM_ALTERNATIVE_LABELS: {
    'physical-model': 'Physical models',
    experiment: 'Experiments',
    demonstration: 'Demonstrations',
    printable: 'Printable activities',
    exercise: 'Educational exercises',
  },

  RESOURCE_TEXT: {
    title: 'Resources',
    intro:
      'These are the scientific sources and datasets that Starman uses or will use. All of them belong to recognized organizations and can be consulted on their official websites.',
    categoriesNav: 'Resource categories',
    organization: 'Responsible organization',
    informationType: 'Type of information',
    license: 'License or attribution',
    licenseUnknown: 'Check the terms of use on the source website.',
    licenseLink: 'View terms',
    visit: 'Visit source',
    emptyCategory: 'There are no resources in this category yet.',
    count: (n: number) => (n === 1 ? '1 resource' : `${n} resources`),
  },

  NOT_FOUND_TEXT: {
    title: 'Page not found',
    body: 'The page you are looking for doesn’t exist or has been moved.',
    goHome: 'Go to the home page',
  },
};
