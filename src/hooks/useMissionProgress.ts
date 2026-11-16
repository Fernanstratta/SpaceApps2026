import { useCallback, useEffect, useState } from 'react';
import {
  CANDIDATE_SITE_IDS,
  getMissionSite,
  isCandidateSite,
  MISSION_SITE_IDS,
  MISSION_SOURCES,
  type CandidateSiteId,
  type MissionSiteId,
  type SourceId,
} from '../data/missions/roverMission';
import type { TransectDirection } from '../utils/terrain';

/**
 * Avance de un equipo en la Misión 01: bitácora de hallazgos, propuesta,
 * revisión entre equipos y decisión revisada. Todo vive en `localStorage`
 * (sin cuentas ni servidor), así que sobrevive a una recarga. Cuando exista
 * backend, este hook es el único punto que habría que sincronizar.
 */

export const MISSION_STEPS = [1, 2, 3, 4, 5] as const;
export type MissionStep = (typeof MISSION_STEPS)[number];

/** Qué se registró: un punto del perfil, el tramo completo o la foto del sitio. */
export type FindingKind = 'point' | 'transect' | 'photo';

/** Valores leídos en el visor (en metros y grados). Solo los que aplican a cada tipo. */
export interface FindingValues {
  distance?: number;
  height?: number;
  slope?: number;
  depth?: number;
  rimToRim?: number;
  maxSlope?: number;
  meanSlope?: number;
}

/** Un hallazgo de la bitácora: dónde se miró, qué capa, qué fuente y por qué importa. */
export interface Finding {
  id: string;
  site: MissionSiteId;
  kind: FindingKind;
  /** Vista y capas activas al registrarlo. */
  view: 'photo' | 'relief';
  slopeLayer: boolean;
  compared: boolean;
  direction: TransectDirection | null;
  /** Índice del punto en el perfil (solo `point`). */
  index: number | null;
  values: FindingValues;
  sourceIds: SourceId[];
  /** Nota del equipo: qué observó y por qué importa. */
  note: string;
}

export type FindingDraft = Omit<Finding, 'id'>;

export type ReviewDecision = 'keep' | 'change' | 'more-evidence';
export const REVIEW_DECISIONS: readonly ReviewDecision[] = ['keep', 'change', 'more-evidence'];

export interface MissionProgress {
  step: MissionStep;
  team: string;
  provisionalSite: CandidateSiteId | null;
  hypothesis: string;
  findings: Finding[];
  /** Hallazgo que se está registrando (también se guarda, para no perderlo al recargar). */
  findingDraft: FindingDraft | null;
  /** Propuesta para la revisión. */
  proposedSite: CandidateSiteId | null;
  mainFindingId: string | null;
  explanation: string;
  limitation: string;
  nextData: string;
  /** Revisión entre equipos. */
  reviewerTeam: string;
  objection: string;
  decision: ReviewDecision | null;
  /** Hallazgo que respalda la decisión (no aplica a «Necesitamos más evidencia»). */
  decisionFindingId: string | null;
  /** Qué dato respalda la decisión o qué dato hace falta. */
  decisionReason: string;
}

export const MAX_FINDINGS = 8;
export const MIN_NOTE_LENGTH = 15;
const STORAGE_KEY = 'terranauta-mission-rover-v2';
/** Formato anterior (observaciones sin nota); se migra al leerlo. */
const LEGACY_STORAGE_KEY = 'terranauta-mission-rover-v1';

export const EMPTY_PROGRESS: MissionProgress = {
  step: 1,
  team: '',
  provisionalSite: null,
  hypothesis: '',
  findings: [],
  findingDraft: null,
  proposedSite: null,
  mainFindingId: null,
  explanation: '',
  limitation: '',
  nextData: '',
  reviewerTeam: '',
  objection: '',
  decision: null,
  decisionFindingId: null,
  decisionReason: '',
};

/** El sitio que resulta de la decisión revisada (`null` si el equipo pide más evidencia). */
export function revisedSite(p: MissionProgress): CandidateSiteId | null {
  if (p.decision === 'keep') return p.proposedSite;
  if (p.decision === 'change') return otherCandidate(p.proposedSite);
  return null;
}

export function otherCandidate(site: CandidateSiteId | null): CandidateSiteId | null {
  if (!site) return null;
  return CANDIDATE_SITE_IDS.find((id) => id !== site) ?? null;
}

/** Fuentes de un hallazgo según lo que se consultó. */
export function findingSources(site: MissionSiteId, kind: FindingKind, compared: boolean): SourceId[] {
  const { demSourceId, photo } = getMissionSite(site);
  if (kind === 'photo') return [photo.sourceId];
  const sources: SourceId[] = [demSourceId];
  if (compared && site !== 'north-ray') sources.push(getMissionSite('north-ray').demSourceId);
  return sources.filter((id, i) => sources.indexOf(id) === i);
}

// ---------------------------------------------------------------------------
// Lectura segura del almacenamiento: un dato corrupto o manipulado nunca rompe la página.

const text = (value: unknown, max = 1000) => (typeof value === 'string' ? value.slice(0, max) : '');
const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined);
const isSite = (value: unknown): value is MissionSiteId => (MISSION_SITE_IDS as readonly unknown[]).includes(value);
const isDirection = (value: unknown): value is TransectDirection => value === 'west-east' || value === 'north-south';
const isKind = (value: unknown): value is FindingKind => value === 'point' || value === 'transect' || value === 'photo';

function sanitizeValues(raw: unknown): FindingValues {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const values: FindingValues = {};
  for (const key of ['distance', 'height', 'slope', 'depth', 'rimToRim', 'maxSlope', 'meanSlope'] as const) {
    const value = num(r[key]);
    if (value !== undefined) values[key] = value;
  }
  return values;
}

function sanitizeDraft(raw: unknown): FindingDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!isSite(r.site) || !isKind(r.kind)) return null;
  const kind = r.kind;
  const direction = isDirection(r.direction) ? r.direction : null;
  if (kind !== 'photo' && !direction) return null;
  const compared = r.compared === true;
  const sourceIds = Array.isArray(r.sourceIds) ? r.sourceIds.filter((id): id is SourceId => typeof id === 'string' && id in MISSION_SOURCES) : [];
  return {
    site: r.site,
    kind,
    view: kind === 'photo' ? 'photo' : 'relief',
    slopeLayer: r.slopeLayer === true,
    compared,
    direction: kind === 'photo' ? null : direction,
    index: kind === 'point' ? (num(r.index) ?? null) : null,
    values: sanitizeValues(r.values),
    sourceIds: sourceIds.length > 0 ? sourceIds : findingSources(r.site, kind, compared),
    note: text(r.note),
  };
}

/** Observación del formato anterior → hallazgo de tipo «punto» (sin nota: el equipo la completa). */
function legacyObservation(raw: unknown): Finding | null {
  const r = raw as Record<string, unknown> | null;
  if (!r || typeof r.id !== 'string' || !isSite(r.site) || !isDirection(r.direction)) return null;
  return {
    id: r.id,
    site: r.site,
    kind: 'point',
    view: 'relief',
    slopeLayer: false,
    compared: false,
    direction: r.direction,
    index: num(r.index) ?? null,
    values: sanitizeValues(r),
    sourceIds: findingSources(r.site, 'point', false),
    note: '',
  };
}

export function sanitizeProgress(raw: unknown): MissionProgress {
  if (!raw || typeof raw !== 'object') return EMPTY_PROGRESS;
  const r = raw as Record<string, unknown>;
  const legacy = Array.isArray(r.observations) && !Array.isArray(r.findings);

  const findings: Finding[] = legacy
    ? (r.observations as unknown[]).map(legacyObservation).filter((f): f is Finding => f !== null)
    : Array.isArray(r.findings)
      ? (r.findings as unknown[]).flatMap((f) => {
          const draft = sanitizeDraft(f);
          const id = (f as { id?: unknown } | null)?.id;
          return draft && typeof id === 'string' ? [{ ...draft, id }] : [];
        })
      : [];
  const limited = findings.slice(0, MAX_FINDINGS);
  const has = (id: unknown) => typeof id === 'string' && limited.some((f) => f.id === id);

  // Formato anterior: 1 Reto, 2 Evidencia, 3 Decisión, 4 Ficha → los pasos 3 y 4 son ahora la propuesta.
  const rawStep = r.step as MissionStep;
  const step = MISSION_STEPS.includes(rawStep) ? (legacy && rawStep === 4 ? 3 : rawStep) : 1;
  const proposed = legacy ? r.finalSite : r.proposedSite;
  const main = legacy ? r.citedObservationId : r.mainFindingId;

  return {
    step,
    team: text(r.team, 60),
    provisionalSite: isCandidateSite(r.provisionalSite) ? r.provisionalSite : null,
    hypothesis: text(r.hypothesis),
    findings: limited,
    findingDraft: sanitizeDraft(r.findingDraft),
    proposedSite: isCandidateSite(proposed) ? proposed : null,
    mainFindingId: has(main) ? (main as string) : null,
    explanation: text(r.explanation),
    limitation: text(r.limitation),
    nextData: text(r.nextData),
    reviewerTeam: text(r.reviewerTeam, 60),
    objection: text(r.objection),
    decision: (REVIEW_DECISIONS as readonly unknown[]).includes(r.decision) ? (r.decision as ReviewDecision) : null,
    decisionFindingId: has(r.decisionFindingId) ? (r.decisionFindingId as string) : null,
    decisionReason: text(r.decisionReason),
  };
}

function read(): MissionProgress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return stored ? sanitizeProgress(JSON.parse(stored)) : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function useMissionProgress() {
  const [progress, setProgress] = useState<MissionProgress>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Sin almacenamiento: el avance dura solo mientras la página esté abierta.
    }
  }, [progress]);

  const update = useCallback((patch: Partial<MissionProgress>) => {
    setProgress((current) => ({ ...current, ...patch }));
  }, []);

  /** Guarda el borrador abierto en la bitácora. */
  const commitDraft = useCallback(() => {
    setProgress((current) => {
      const draft = current.findingDraft;
      if (!draft || draft.note.trim().length < MIN_NOTE_LENGTH || current.findings.length >= MAX_FINDINGS) return current;
      const id = `f-${Date.now().toString(36)}-${current.findings.length}`;
      return { ...current, findings: [...current.findings, { ...draft, note: draft.note.trim(), id }], findingDraft: null };
    });
  }, []);

  const editFindingNote = useCallback((id: string, note: string) => {
    setProgress((current) => ({
      ...current,
      findings: current.findings.map((f) => (f.id === id ? { ...f, note } : f)),
    }));
  }, []);

  const removeFinding = useCallback((id: string) => {
    setProgress((current) => ({
      ...current,
      findings: current.findings.filter((f) => f.id !== id),
      mainFindingId: current.mainFindingId === id ? null : current.mainFindingId,
      decisionFindingId: current.decisionFindingId === id ? null : current.decisionFindingId,
    }));
  }, []);

  const reset = useCallback(() => setProgress(EMPTY_PROGRESS), []);

  return { progress, update, commitDraft, editFindingNote, removeFinding, reset };
}

// ---------------------------------------------------------------------------

/** Errores de validación de cada paso (claves; el texto sale de los mensajes). */
export type StepError =
  | 'errorSite'
  | 'errorHypothesis'
  | 'errorFinding'
  | 'errorFindingNote'
  | 'errorProposal'
  | 'errorCite'
  | 'errorExplanation'
  | 'errorLimitation'
  | 'errorNextData'
  | 'errorObjection'
  | 'errorDecision'
  | 'errorDecisionFinding'
  | 'errorDecisionReason';

export function validateStep(step: MissionStep, p: MissionProgress): StepError[] {
  const errors: StepError[] = [];
  if (step === 1) {
    if (!p.provisionalSite) errors.push('errorSite');
    if (p.hypothesis.trim().length < 20) errors.push('errorHypothesis');
  }
  if (step === 2) {
    if (p.findings.length === 0) errors.push('errorFinding');
    else if (p.findings.some((f) => f.note.trim().length < MIN_NOTE_LENGTH)) errors.push('errorFindingNote');
  }
  if (step === 3) {
    if (!p.proposedSite) errors.push('errorProposal');
    if (!p.mainFindingId) errors.push('errorCite');
    if (p.explanation.trim().length < 30) errors.push('errorExplanation');
    if (p.limitation.trim().length < 15) errors.push('errorLimitation');
    if (p.nextData.trim().length < 10) errors.push('errorNextData');
  }
  if (step === 4) {
    if (p.objection.trim().length < 15) errors.push('errorObjection');
    if (!p.decision) errors.push('errorDecision');
    if ((p.decision === 'keep' || p.decision === 'change') && !p.decisionFindingId) errors.push('errorDecisionFinding');
    if (p.decisionReason.trim().length < 30) errors.push('errorDecisionReason');
  }
  return errors;
}
