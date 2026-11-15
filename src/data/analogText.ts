import type { Language } from '../i18n/config';
import { PLAYGROUND_TEXT } from '../i18n/playground';
import type { AxisId } from '../types/Axis';
import { type AnalogPair, type AnalogSite, aoiNote, type Body, educationBreaks, getSite } from './lunarAnalogs';

/**
 * Textos de los pares en el idioma activo.
 *
 * En español son los del backend, sin tocar (salvo los que el propio backend
 * marcó como desactualizados; ver `STALE_BACKEND_TEXTS`). En inglés salen de
 * la traducción de `i18n/playground.en.ts` (`backend`). Los campos que el
 * backend solo redacta en español y son largos y técnicos (`source`,
 * `method`) no se traducen: se muestran en español con un aviso.
 */

export interface SiteLabels {
  name: string;
  region: string;
  type: string;
  /** Por qué se eligió el área de análisis. */
  aoiNote: string;
}

export interface BreakLabel {
  key: string;
  axisId: AxisId | null;
  /** Nombre del eje, o la etiqueta de la clave («Origen»). */
  label: string;
  text: string;
}

export interface PairLabels {
  /** Título completo del par («Cráter El Elegante ↔ Cráter Linné»). */
  title: string;
  /** Nombre corto («El Elegante ↔ Linné»). */
  short: string;
  /** «Por qué se comparan» (`education.match_es`). */
  match: string;
  /** «Pregunta para clase» (`education.hook_es`). */
  hook: string;
  breaks: BreakLabel[];
  earth: SiteLabels;
  moon: SiteLabels;
}

function breakLabel(key: string, axisId: AxisId | null, language: Language): string {
  const t = PLAYGROUND_TEXT[language];
  if (axisId) return t.axes[axisId].name;
  return t.breakLabels[key] ?? key.charAt(0).toLocaleUpperCase(language) + key.slice(1);
}

function backendSiteLabels(site: AnalogSite): SiteLabels {
  return { name: site.name, region: site.region, type: site.type_es, aoiNote: aoiNote(site) };
}

export function getSiteLabels(pair: AnalogPair, body: Body, language: Language): SiteLabels {
  const translation = PLAYGROUND_TEXT[language].backend?.pairs[pair.id];
  return translation ? translation[body] : backendSiteLabels(getSite(pair, body));
}

export function getPairLabels(pair: AnalogPair, language: Language): PairLabels {
  const t = PLAYGROUND_TEXT[language];
  const translation = t.backend?.pairs[pair.id];
  const breaks = educationBreaks(pair).map((item) => ({
    key: item.key,
    axisId: item.axisId,
    label: breakLabel(item.key, item.axisId, language),
    // Si faltara la traducción de una ruptura, se muestra el texto original.
    text: translation ? (translation.breaks[item.key] ?? item.text) : item.text,
  }));
  return {
    title: translation?.title ?? pair.data.title_es,
    short: t.pairs[pair.id].short,
    match: translation?.match ?? pair.data.education.match_es,
    hook: translation?.hook ?? pair.data.education.hook_es,
    breaks,
    earth: getSiteLabels(pair, 'earth', language),
    moon: getSiteLabels(pair, 'moon', language),
  };
}

/** Fuente prevista de un eje (`source_plan`), en el idioma activo. */
export function getSourcePlan(axisId: AxisId, body: Body, backendText: string, language: Language): string {
  return PLAYGROUND_TEXT[language].backend?.sourcePlans[axisId][body] ?? backendText;
}
