import type { Comparison, SubmoduleKey } from '../types';
import { mapSubmodules } from './submodules';

/**
 * Earth–Moon comparisons per submodule (shown in the "Aprender" view).
 *
 * INITIAL DATA STATE: every entry is `null` (data not yet provided).
 * To add data, override a submodule below with an array of sourced
 * `Comparison` objects. Do NOT estimate or generate values here.
 */
export const comparisonsBySubmodule: Record<SubmoduleKey, Comparison[] | null> = {
  ...mapSubmodules(() => null),
  // 'gravity/saltar-en-la-luna': [ { id: 'gravedad-superficial', … } ],
};
