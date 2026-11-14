export const RESOURCE_CATEGORY_IDS = [
  'astronomical-data',
  'lunar-geological',
  'earth-geographic',
  'cartographic',
  'scientific-educational',
] as const;

export type ResourceCategoryId = (typeof RESOURCE_CATEGORY_IDS)[number];

export interface ResourceCategory {
  id: ResourceCategoryId;
  name: string;
  description: string;
}

/** A verifiable scientific source or dataset used by Starman. */
export interface Resource {
  id: string;
  categoryId: ResourceCategoryId;
  /** Nombre del recurso. */
  name: string;
  /** Organización responsable. */
  organization: string;
  /** Descripción. */
  description: string;
  /** URL de origen (must be the official source). */
  sourceUrl: string;
  /** Tipo de información. */
  informationType: string;
  /** Licencia o atribución. `null` when it must be checked on the source site. */
  license: string | null;
  licenseUrl: string | null;
}
