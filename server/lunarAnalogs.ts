import index from '../data/lunar-analogs/index.json' with { type: 'json' };
import elegante from '../data/lunar-analogs/pairs/elegante_linne.json' with { type: 'json' };
import pinacate from '../data/lunar-analogs/pairs/pinacate_marius.json' with { type: 'json' };
import cerroPrieto from '../data/lunar-analogs/pairs/cerro_prieto_gruithuisen.json' with { type: 'json' };
import lagunaSalada from '../data/lunar-analogs/pairs/laguna_salada_tranquillitatis.json' with { type: 'json' };
import cucapa from '../data/lunar-analogs/pairs/cucapa_shackleton.json' with { type: 'json' };
import type { Comparison, AnalogPairSummary } from '../src/lib/spaceApiTypes';

export const lunarAnalogIndex = index as AnalogPairSummary[];
const allowedIds = new Set(lunarAnalogIndex.map(({ pair_id }) => pair_id));

// Static imports bundle the catalog with the function, as in analogRepository.ts.
const pairs = [elegante, pinacate, cerroPrieto, lagunaSalada, cucapa] as Comparison[];
const byId = new Map(pairs.map(pair => [pair.pair_id, pair]));

export function getLunarAnalog(id: string): Comparison | undefined {
  return allowedIds.has(id) ? byId.get(id) : undefined;
}
