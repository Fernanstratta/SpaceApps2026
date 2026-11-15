import type { AxisId, ComparisonDetail, EducationLevel, SubmoduleStage } from '../types';
import type { PairId } from './lunarAnalogs';

/**
 * Estructura (sin textos) de cada submódulo: con qué pares del catálogo
 * trabaja y cuánta duración tiene la sesión. Es igual en todos los idiomas.
 *
 * Los pares se eligieron mirando los datos del backend, para que cada lección
 * muestre tanto una coincidencia como una ruptura de la analogía:
 *  - Concepto: un solo par, el que ilustra el eje de la forma más clara.
 *  - Medición: dos pares que obligan a mirar cómo se obtuvo el dato.
 *  - Análogos: tres o más pares, del más al menos parecido en ese eje
 *    (en cráteres van los cinco, para ver los dos que no tienen el eje).
 */
export const SUBMODULE_PAIRS: Record<AxisId, Record<SubmoduleStage, readonly PairId[]>> = {
  slope: {
    concept: ['laguna_salada_tranquillitatis'],
    measurement: ['laguna_salada_tranquillitatis', 'elegante_linne'],
    analogs: ['laguna_salada_tranquillitatis', 'cucapa_shackleton', 'pinacate_marius'],
  },
  roughness: {
    concept: ['laguna_salada_tranquillitatis'],
    measurement: ['elegante_linne', 'pinacate_marius'],
    analogs: ['cerro_prieto_gruithuisen', 'cucapa_shackleton', 'pinacate_marius'],
  },
  mineralogy: {
    concept: ['pinacate_marius'],
    measurement: ['pinacate_marius', 'elegante_linne'],
    analogs: ['pinacate_marius', 'cerro_prieto_gruithuisen', 'elegante_linne'],
  },
  albedo: {
    concept: ['laguna_salada_tranquillitatis'],
    measurement: ['elegante_linne', 'cucapa_shackleton'],
    analogs: ['elegante_linne', 'pinacate_marius', 'laguna_salada_tranquillitatis'],
  },
  thermal: {
    concept: ['elegante_linne'],
    measurement: ['elegante_linne', 'cucapa_shackleton'],
    analogs: ['elegante_linne', 'pinacate_marius', 'cucapa_shackleton'],
  },
  aridity: {
    concept: ['laguna_salada_tranquillitatis'],
    measurement: ['laguna_salada_tranquillitatis', 'pinacate_marius'],
    analogs: ['laguna_salada_tranquillitatis', 'elegante_linne', 'pinacate_marius'],
  },
  ice: {
    concept: ['cucapa_shackleton'],
    measurement: ['cucapa_shackleton', 'laguna_salada_tranquillitatis'],
    analogs: ['cucapa_shackleton', 'laguna_salada_tranquillitatis'],
  },
  dust: {
    concept: ['laguna_salada_tranquillitatis'],
    measurement: ['laguna_salada_tranquillitatis', 'cucapa_shackleton'],
    analogs: ['laguna_salada_tranquillitatis', 'cucapa_shackleton', 'pinacate_marius'],
  },
  craters: {
    concept: ['elegante_linne'],
    measurement: ['elegante_linne', 'cerro_prieto_gruithuisen'],
    analogs: ['elegante_linne', 'pinacate_marius', 'cerro_prieto_gruithuisen', 'laguna_salada_tranquillitatis', 'cucapa_shackleton'],
  },
};

/** Cuánto detalle de los datos se muestra en cada nivel educativo. */
export const DETAIL_BY_LEVEL: Record<EducationLevel, ComparisonDetail> = {
  primaria: 'simple',
  secundaria: 'guided',
  preparatoria: 'full',
};

/** Duración de una sesión, en minutos, según el nivel. */
export const SESSION_MINUTES: Record<EducationLevel, number> = {
  primaria: 40,
  secundaria: 50,
  preparatoria: 50,
};

/** Número de preguntas de la comprobación según el nivel (mínimo y máximo). */
export const QUIZ_SIZE: Record<EducationLevel, readonly [number, number]> = {
  primaria: [2, 2],
  secundaria: [3, 3],
  preparatoria: [4, 4],
};
