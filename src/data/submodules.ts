import type { Submodule, SubmoduleKey, SubmoduleStage, TopicId } from '../types';

/**
 * Submodules of each comparative axis. Every axis follows the same learning
 * progression (see `SubmoduleStage`): concept → measurement → analogs, in
 * both the student and the teacher view. Several titles and photos come from
 * the previous topics (e.g. «El clima en la Luna», «Huellas en el polvo
 * lunar», «Salida de la Tierra») and were moved to the axis they illustrate.
 *
 * `summary` stays `null` until the team writes one.
 */
type SubmoduleSeed = [id: string, stage: SubmoduleStage, title: string, tag: string, imageId: string];

const SEEDS: Record<TopicId, [SubmoduleSeed, SubmoduleSeed, SubmoduleSeed]> = {
  slope: [
    ['terreno-plano-para-aterrizar', 'concept', 'Terreno plano para aterrizar', 'Ingeniería', 'aldrin'],
    ['medir-pendientes-desde-el-espacio', 'measurement', 'Medir pendientes desde el espacio', 'Cartografía', 'apollo11-lro'],
    ['donde-si-y-donde-no-aterrizar', 'analogs', 'Dónde sí y dónde no aterrizar', 'Análogos', 'shackleton-lroc'],
  ],
  roughness: [
    ['superficies-lisas-y-rocosas', 'concept', 'Superficies lisas y rocosas', 'Geología', 'young-jump'],
    ['ver-la-rugosidad-con-radar', 'measurement', 'Ver la rugosidad con radar', 'Física', 'tycho'],
    ['campos-de-lava-y-sierras', 'analogs', 'Campos de lava y sierras', 'Análogos', 'marius-pit'],
  ],
  mineralogy: [
    ['rocas-oscuras-y-rocas-claras', 'concept', 'Rocas oscuras y rocas claras', 'Geología', 'genesis-rock'],
    ['leer-la-composicion-desde-el-espacio', 'measurement', 'Leer la composición desde el espacio', 'Percepción remota', 'mexico-from-iss'],
    ['volcanes-de-baja-california-y-sonora', 'analogs', 'Volcanes de Baja California y Sonora', 'Análogos', 'gruithuisen-apollo15'],
  ],
  albedo: [
    ['cuanta-luz-refleja-una-superficie', 'concept', '¿Cuánta luz refleja una superficie?', 'Física', 'blue-marble'],
    ['medir-el-albedo-con-satelites', 'measurement', 'Medir el albedo con satélites', 'Percepción remota', 'first-earthrise'],
    ['sitios-claros-y-oscuros', 'analogs', 'Sitios claros y sitios oscuros', 'Análogos', 'apollo11-lro'],
  ],
  thermal: [
    ['el-clima-en-la-luna', 'concept', 'El clima en la Luna', 'Climatología', 'diviner-south-pole'],
    ['medir-la-temperatura-desde-orbita', 'measurement', 'Medir la temperatura desde la órbita', 'Percepción remota', 'top-of-atmosphere'],
    ['del-dia-a-la-noche', 'analogs', 'Del día a la noche en Sonora y en la Luna', 'Análogos', 'iss-sunset'],
  ],
  aridity: [
    ['salida-de-la-tierra', 'concept', 'Salida de la Tierra', 'Astronomía', 'earthrise'],
    ['mexico-visto-desde-el-espacio', 'measurement', 'México visto desde el espacio', 'Geografía', 'mexico-from-iss'],
    ['desiertos-como-analogos-lunares', 'analogs', 'Desiertos como análogos lunares', 'Análogos', 'apollo11-lro'],
  ],
  volatiles: [
    ['agua-en-la-tierra-hielo-en-la-luna', 'concept', 'Agua en la Tierra, hielo en la Luna', 'Hidrología', 'greenland-iceberg'],
    ['buscar-agua-desde-el-espacio', 'measurement', 'Buscar agua desde el espacio', 'Percepción remota', 'antarctic-sea-ice'],
    ['seco-contra-helado', 'analogs', 'Seco contra helado: Cucapá y Shackleton', 'Análogos', 'shackleton-lroc'],
  ],
  dust: [
    ['huellas-en-el-polvo-lunar', 'concept', 'Huellas en el polvo lunar', 'Geología', 'bootprint'],
    ['cuanto-polvo-fino-tiene-un-suelo', 'measurement', 'Cuánto polvo fino tiene un suelo', 'Edafología', 'laser-reflector'],
    ['polvo-en-la-laguna-salada', 'analogs', 'Polvo en la Laguna Salada y en la Luna', 'Análogos', 'aldrin'],
  ],
  craters: [
    ['crater-barringer', 'concept', 'Cómo se forma un cráter', 'Geología', 'barringer'],
    ['crater-tycho', 'measurement', 'Medir la forma de un cráter', 'Geometría', 'tycho'],
    ['crateres-y-cavidades-de-la-region', 'analogs', 'Cráteres y cavidades de la región', 'Análogos', 'linne-lro'],
  ],
};

export const submodules: Submodule[] = (Object.keys(SEEDS) as TopicId[]).flatMap((topicId) =>
  SEEDS[topicId].map(([id, stage, title, tag, imageId], index) => ({
    id,
    topicId,
    stage,
    title,
    tag,
    imageId,
    order: index + 1,
    summary: null,
  })),
);

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
