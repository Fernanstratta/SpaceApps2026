import type { Language } from '../i18n/config';
import { contentEn } from '../i18n/content/en';
import type { ContentTranslation } from '../i18n/content/types';
import type {
  CommonsImage,
  ReferenceLocation,
  Resource,
  ResourceCategory,
  ResourceCategoryId,
  StudentModule,
  StudentSubmodule,
  Submodule,
  SubmoduleKey,
  TeacherModule,
  TeacherSubmodule,
  Topic,
  TopicId,
} from '../types';
import { getCurriculum } from './curriculum';
import { images } from './images';
import { resourceCategories, resources } from './resources';
import { submoduleKey, submodules } from './submodules';
import { isTopicId, topics } from './topics';

/**
 * Acceso a los datos en el idioma activo. Es el ÚNICO punto que los
 * componentes usan para leer datos (a través de `useData()`).
 *
 * Hoy: datos estáticos en español (`src/data/*`) + traducciones por id
 * (`src/i18n/content/*`). Con el backend: basta con que estas funciones lean
 * de la API (p. ej. `GET /api/topics?lang=en`) y devuelvan los mismos tipos;
 * los componentes no cambian.
 */
export interface DataApi {
  language: Language;
  getSortedTopics: () => Topic[];
  getTopicById: (id: TopicId) => Topic;
  isTopicId: typeof isTopicId;
  getSubmodulesByTopic: (topicId: TopicId) => Submodule[];
  getSubmodule: (topicId: TopicId, id: string) => Submodule | undefined;
  images: CommonsImage[];
  getImage: (id: string) => CommonsImage | undefined;
  resourceCategories: ResourceCategory[];
  resources: Resource[];
  getResourcesByCategory: (categoryId: ResourceCategoryId) => Resource[];
  getStudentModule: (topicId: TopicId) => StudentModule;
  getTeacherModule: (topicId: TopicId) => TeacherModule;
  /** "Aprender" content of a submodule (see `submoduleKey`). */
  getStudentSubmodule: (key: SubmoduleKey) => StudentSubmodule | undefined;
  /** "Enseñar" content (teaching guide) of a submodule. */
  getTeacherSubmodule: (key: SubmoduleKey) => TeacherSubmodule | undefined;
  localizeReferenceLocation: (location: ReferenceLocation) => ReferenceLocation;
}

/** `null` = el idioma de los datos de origen (español), sin traducción. */
const TRANSLATIONS: Record<Language, ContentTranslation | null> = {
  es: null,
  en: contentEn,
};

function buildDataApi(language: Language): DataApi {
  const t = TRANSLATIONS[language];
  // Contenido de los dos modos, ya en el idioma activo (misma fuente para ambos).
  const curriculum = getCurriculum(language);

  const localizedTopics: Topic[] = topics
    .map((topic) => (t ? { ...topic, ...t.topics[topic.id] } : topic))
    .sort((a, b) => a.order - b.order);
  const topicMap = new Map(localizedTopics.map((topic) => [topic.id, topic]));

  // El resumen de cada tarjeta viene de su lección (`i18n/curriculum`).
  const localizedSubmodules: Submodule[] = submodules.map((item) => {
    const translated = t?.submodules[item.id] ? { ...item, ...t.submodules[item.id] } : item;
    return { ...translated, summary: curriculum.summaries[submoduleKey(item)] ?? translated.summary };
  });

  const localizedImages: CommonsImage[] = images.map((image) =>
    t?.images[image.id] ? { ...image, ...t.images[image.id] } : image,
  );
  const imageMap = new Map(localizedImages.map((image) => [image.id, image]));

  const localizedCategories: ResourceCategory[] = resourceCategories.map((category) =>
    t ? { ...category, ...t.resourceCategories[category.id] } : category,
  );

  const localizedResources: Resource[] = resources.map((resource) => {
    const translation = t?.resources[resource.id];
    if (!translation) return resource;
    return {
      ...resource,
      name: translation.name ?? resource.name,
      organization: translation.organization ?? resource.organization,
      description: translation.description,
      informationType: translation.informationType,
      license: translation.license !== undefined ? translation.license : resource.license,
    };
  });

  return {
    language,
    getSortedTopics: () => localizedTopics,
    getTopicById: (id) => {
      const topic = topicMap.get(id);
      if (!topic) throw new Error(`Topic not found: ${id}`);
      return topic;
    },
    isTopicId,
    getSubmodulesByTopic: (topicId) =>
      localizedSubmodules.filter((item) => item.topicId === topicId).sort((a, b) => a.order - b.order),
    getSubmodule: (topicId, id) => localizedSubmodules.find((item) => item.topicId === topicId && item.id === id),
    images: localizedImages,
    getImage: (id) => imageMap.get(id),
    resourceCategories: localizedCategories,
    resources: localizedResources,
    getResourcesByCategory: (categoryId) => localizedResources.filter((item) => item.categoryId === categoryId),
    getStudentModule: (topicId) => curriculum.studentModules[topicId],
    getTeacherModule: (topicId) => curriculum.teacherModules[topicId],
    getStudentSubmodule: (key) => curriculum.studentSubmodules[key],
    getTeacherSubmodule: (key) => curriculum.teacherSubmodules[key],
    localizeReferenceLocation: (location) =>
      t?.referenceLocations[location.id] ? { ...location, ...t.referenceLocations[location.id] } : location,
  };
}

const cache = new Map<Language, DataApi>();

export function getDataApi(language: Language): DataApi {
  let api = cache.get(language);
  if (!api) {
    api = buildDataApi(language);
    cache.set(language, api);
  }
  return api;
}
