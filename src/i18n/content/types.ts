import type { CommonsImage, ResourceCategoryId, TopicId } from '../../types';

/**
 * Traducción de los datos (`src/data/`) a otro idioma, indexada por id.
 * Los datos en español son la fuente; aquí solo van los campos de texto.
 * Lo que no se traduce nunca: ids, URLs, archivos de imagen, nombres de
 * autores e instituciones en los créditos y licencias originales.
 */
export interface ContentTranslation {
  topics: Record<TopicId, { name: string; description: string | null }>;
  /** Por id de submódulo. */
  submodules: Record<string, { title: string; tag: string }>;
  /** Por id de imagen. `author` solo traduce las partes descriptivas (p. ej. "tripulación"). */
  images: Record<string, { alt: string; author: string; license: CommonsImage['license'] }>;
  resourceCategories: Record<ResourceCategoryId, { name: string; description: string }>;
  /** Por id de recurso. `name`, `organization` y `license` solo si cambian respecto al original. */
  resources: Record<
    string,
    { description: string; informationType: string; name?: string; organization?: string; license?: string | null }
  >;
  /** Por id de ubicación de referencia. */
  referenceLocations: Record<string, { country: string }>;
}
