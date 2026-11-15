import { LOCALES, type Language } from '../i18n/config';
import { PLAYGROUND_TEXT } from '../i18n/playground';
import { isAxisId, type AxisId } from '../types/Axis';
import { formatAxisValue, formatNumber, formatPercent, formatScore, timesLarger } from '../utils/analogFormat';
import { formatRaw } from './analogCaveats';
import { type AnalogPair, type Body, getAxisDefinition, getPair, getSite, isComparable, pairAxis, type PairId } from './lunarAnalogs';

/**
 * Sustituye en un texto las marcas `[[…]]` por valores del backend, con el
 * formato del idioma. Así las lecciones citan datos reales sin copiar números:
 * si el backend cambia un valor, el texto cambia con él.
 * Ver la lista de marcas en `i18n/curriculum/types.ts`.
 */

const PAIR_ALIASES: Record<string, PairId> = {
  elegante: 'elegante_linne',
  pinacate: 'pinacate_marius',
  cerro: 'cerro_prieto_gruithuisen',
  laguna: 'laguna_salada_tranquillitatis',
  cucapa: 'cucapa_shackleton',
};

const TOKEN = /\[\[([a-zA-Z]+)((?: [\w-]+)*)\]\]/g;

function fail(token: string, reason: string): never {
  throw new Error(`Marca «${token}»: ${reason}`);
}

function pairOf(alias: string | undefined, token: string): AnalogPair {
  const id = alias ? PAIR_ALIASES[alias] : undefined;
  if (!id) fail(token, `par desconocido «${alias ?? ''}»`);
  return getPair(id);
}

function axisOf(key: string | undefined, token: string): AxisId {
  if (!isAxisId(key)) fail(token, `eje desconocido «${key ?? ''}»`);
  return key;
}

function resolveToken(token: string, kind: string, args: string[], language: Language): string {
  const locale = LOCALES[language];
  const labels = PLAYGROUND_TEXT[language].table.value;

  const side = (body: Body): string => {
    const pair = pairOf(args[0], token);
    const axisId = axisOf(args[1], token);
    const value = pairAxis(pair, axisId)[body];
    if (!value) fail(token, 'el backend no tiene ese valor');
    return formatAxisValue(axisId, value.value, locale, labels);
  };

  switch (kind) {
    case 'earth':
      return side('earth');
    case 'moon':
      return side('moon');
    case 's': {
      const axis = pairAxis(pairOf(args[0], token), axisOf(args[1], token));
      if (!isComparable(axis)) fail(token, 'el eje no tiene dato comparable en ese par');
      return formatScore(axis.similarity, locale);
    }
    case 'rawE':
    case 'rawM': {
      const axis = pairAxis(pairOf(args[0], token), axisOf(args[1], token));
      const raw = formatRaw(axis[kind === 'rawE' ? 'earth' : 'moon'], locale);
      if (!raw) fail(token, 'el backend no trae valor crudo');
      return raw;
    }
    case 'times': {
      const axis = pairAxis(pairOf(args[0], token), axisOf(args[1], token));
      const times = axis.earth && axis.moon ? timesLarger(axis.earth.value, axis.moon.value) : null;
      if (times === null) fail(token, 'no se puede comparar');
      return formatNumber(times, locale, 0);
    }
    case 'ils': {
      const value = pairOf(args[0], token).data.ils.value;
      if (value === null) fail(token, 'el par no tiene ILS');
      return formatScore(value, locale);
    }
    case 'completeness':
      return formatPercent(pairOf(args[0], token).data.ils.data_completeness, locale);
    case 'R':
      return formatNumber(getAxisDefinition(axisOf(args[0], token)).tolerance_R, locale, 2);
    case 'weight':
      return formatNumber(getAxisDefinition(axisOf(args[0], token)).weight, locale, 2);
    case 'conf':
      return getAxisDefinition(axisOf(args[0], token)).confidence;
    case 'fact': {
      const body = args[1];
      if (body !== 'earth' && body !== 'moon') fail(token, 'falta «earth» o «moon»');
      const value = getSite(pairOf(args[0], token), body).facts[args[2] ?? ''];
      if (value === undefined) fail(token, 'el sitio no tiene ese dato');
      return formatNumber(value, locale, 2);
    }
    default:
      return fail(token, 'tipo de marca desconocido');
  }
}

/** Texto con sus marcas resueltas. Lanza un error si alguna no se puede resolver. */
export function resolveTokens(text: string, language: Language): string {
  return text.replace(TOKEN, (token: string, kind: string, rest: string) => resolveToken(token, kind, rest.trim().split(' ').filter(Boolean), language));
}

/** ¿Queda alguna marca sin resolver (o mal escrita) en el texto? */
export function hasUnresolvedTokens(text: string): boolean {
  return text.includes('[[') || text.includes(']]');
}
