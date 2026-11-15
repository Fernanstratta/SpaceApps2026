import { albedoEs } from './es/albedo';
import { aridityEs } from './es/aridity';
import { cratersEs } from './es/craters';
import { dustEs } from './es/dust';
import { iceEs } from './es/ice';
import { mineralogyEs } from './es/mineralogy';
import { roughnessEs } from './es/roughness';
import { sharedEs } from './es/shared';
import { slopeEs } from './es/slope';
import { thermalEs } from './es/thermal';
import type { CurriculumText } from './types';

/**
 * Lecciones y planes docentes de los nueve ejes en español de México: un
 * archivo por eje en `es/`. Cada submódulo está escrito para su nivel
 * (`data/submodules.ts`) y cita los datos del backend con marcas `[[…]]`.
 */
export const curriculumEs: CurriculumText = {
  axes: {
    slope: slopeEs,
    roughness: roughnessEs,
    mineralogy: mineralogyEs,
    albedo: albedoEs,
    thermal: thermalEs,
    aridity: aridityEs,
    ice: iceEs,
    dust: dustEs,
    craters: cratersEs,
  },
  shared: sharedEs,
};
