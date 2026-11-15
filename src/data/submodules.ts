import type { Submodule, SubmoduleKey, TopicId } from '../types';

/**
 * Submodules shown as cards in each topic's row of the Portal Educativo.
 *
 * INITIAL DATA STATE
 * - Titles and tags are PROPOSALS for the team to review; rename freely.
 * - `summary` is `null`: no educational content is generated here.
 */
export const submodules: Submodule[] = [
  // Tamaño y escala
  { id: 'tierra-desde-el-espacio', topicId: 'size-scale', title: 'La Tierra vista desde el espacio', tag: 'Astronomía', imageId: 'blue-marble', order: 1, summary: null },
  { id: 'tierra-sobre-la-luna', topicId: 'size-scale', title: 'La Tierra, pequeña sobre la Luna', tag: 'Escala', imageId: 'first-earthrise', order: 2, summary: null },
  // Gravedad
  { id: 'saltar-en-la-luna', topicId: 'gravity', title: 'Saltar en la Luna', tag: 'Física', imageId: 'young-jump', order: 1, summary: null },
  { id: 'caminar-con-menos-peso', topicId: 'gravity', title: 'Caminar con menos peso', tag: 'Física', imageId: 'aldrin', order: 2, summary: null },
  // Superficie y terreno
  { id: 'rocas-lunares-en-la-tierra', topicId: 'surface-terrain', title: 'Rocas lunares en la Tierra', tag: 'Geología', imageId: 'genesis-rock', order: 1, summary: null },
  { id: 'huellas-en-el-polvo-lunar', topicId: 'surface-terrain', title: 'Huellas en el polvo lunar', tag: 'Geología', imageId: 'bootprint', order: 2, summary: null },
  // Distancia entre la Tierra y la Luna
  { id: 'salida-de-la-tierra', topicId: 'earth-moon-distance', title: 'Salida de la Tierra', tag: 'Astronomía', imageId: 'earthrise', order: 1, summary: null },
  { id: 'medir-la-distancia-con-laser', topicId: 'earth-moon-distance', title: 'Medir la distancia con láser', tag: 'Física', imageId: 'laser-reflector', order: 2, summary: null },
  // Temperatura
  { id: 'el-clima-en-la-luna', topicId: 'temperature', title: 'El clima en la Luna', tag: 'Climatología', imageId: 'diviner-south-pole', order: 1, summary: null },
  { id: 'mexico-visto-desde-el-espacio', topicId: 'temperature', title: 'México visto desde el espacio', tag: 'Geografía', imageId: 'mexico-from-iss', order: 2, summary: null },
  // Cráteres de impacto
  { id: 'crater-barringer', topicId: 'impact-craters', title: 'Cráter Barringer, Arizona', tag: 'Geología', imageId: 'barringer', order: 1, summary: null },
  { id: 'crater-tycho', topicId: 'impact-craters', title: 'El cráter Tycho', tag: 'Astronomía', imageId: 'tycho', order: 2, summary: null },
  // Atmósfera
  { id: 'la-capa-que-nos-protege', topicId: 'atmosphere', title: 'La delgada capa que nos protege', tag: 'Meteorología', imageId: 'top-of-atmosphere', order: 1, summary: null },
  { id: 'atardecer-desde-el-espacio', topicId: 'atmosphere', title: 'Atardecer desde el espacio', tag: 'Meteorología', imageId: 'iss-sunset', order: 2, summary: null },
  // Agua y hielo
  { id: 'icebergs-en-groenlandia', topicId: 'water-ice', title: 'Icebergs en Groenlandia', tag: 'Geografía', imageId: 'greenland-iceberg', order: 1, summary: null },
  { id: 'hielo-marino-en-la-antartida', topicId: 'water-ice', title: 'Hielo marino en la Antártida', tag: 'Climatología', imageId: 'antarctic-sea-ice', order: 2, summary: null },
];

export function getSubmodulesByTopic(topicId: TopicId): Submodule[] {
  return submodules.filter((item) => item.topicId === topicId).sort((a, b) => a.order - b.order);
}

export function getSubmodule(topicId: TopicId, id: string): Submodule | undefined {
  return submodules.find((item) => item.topicId === topicId && item.id === id);
}

/** Unique key of a submodule (`topicId/submoduleId`), used by per-submodule content. */
export function submoduleKey(item: Pick<Submodule, 'topicId' | 'id'>): SubmoduleKey {
  return `${item.topicId}/${item.id}`;
}

export const SUBMODULE_KEYS: SubmoduleKey[] = submodules.map(submoduleKey);

/** Builds a record with one entry per submodule by calling `build` for each key. */
export function mapSubmodules<T>(build: (key: SubmoduleKey) => T): Record<SubmoduleKey, T> {
  return Object.fromEntries(SUBMODULE_KEYS.map((key) => [key, build(key)])) as Record<SubmoduleKey, T>;
}
