/**
 * Shared types for the behavioural-assessment scoring engine.
 *
 * These mirror the shapes used by the original plain-JavaScript engine
 * (`ported-engine.js` + `data-*.js`) as closely as possible. This is a
 * faithful typing pass, not a redesign — see lib/assessment/engine.ts.
 */

export type CapabilityKey = 'SE' | 'RE' | 'OM' | 'CT' | 'EA' | 'SA' | 'LI' | 'EIR';

export type SignalKey = 'IMP' | 'SC' | 'AV' | 'LCT' | 'ECO' | 'POST' | 'EXT';

/** signalNarratives() also emits a 'LOWSE' narrative that isn't one of the raw SIGNALS keys. */
export type NarrativeKey = SignalKey | 'LOWSE';

export type TagKey = 'BLD' | 'STR' | 'CON' | 'OPR';

export type SourceKey = 'capability' | 'scenarios' | 'context';

export type StageKey = 'explorador' | 'buscador' | 'idea' | 'earlyseller' | 'founder';

export type RouteKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'T';

export type RestrictionKind = 'critico' | 'legal' | 'confianza' | 'tiempo';

export type IntensityKey = 'ninguna' | 'leve' | 'moderada' | 'alta';

export type ConfidenceLevel = 'Bajo' | 'Medio' | 'Alto';

export type CapDelta = Partial<Record<CapabilityKey, number>>;
export type SigDelta = Partial<Record<SignalKey, number>>;
export type TagDelta = Partial<Record<TagKey, number>>;

export interface CapabilityDef {
  k: CapabilityKey;
  n: string;
  d: string;
}

export interface SignalDef {
  n: string;
}

export interface SourceDef {
  n: string;
  d: string;
}

export interface StageDef {
  n: string;
  d: string;
  w: Partial<Record<CapabilityKey, number>>;
}

export interface CapLevel {
  max?: number;
  k: string;
  n: string;
  d: string;
}

export interface QuestionOption {
  k?: string;
  t: string;
  c?: CapDelta;
  s?: SigDelta;
  g?: TagDelta;
  r?: RestrictionKind;
  note?: string;
  stage?: StageKey;
  score?: false;
}

export type QuestionType = 'single' | 'multi' | 'open' | 'resources' | 'likert5';

export interface OpenScoreBucketDef {
  label?: string;
  c?: CapDelta;
  s?: SigDelta;
}

export type ResourceBucketKey = 'r0' | 'r1' | 'r2' | 'r3';

export interface Question {
  id: string;
  step: string;
  source: 'context' | 'capability' | 'witness';
  type: QuestionType;
  text: string;
  hint?: string;
  score?: false;
  cap?: CapabilityKey;
  capHead?: string;
  capDesc?: string;
  idx?: string;
  options?: QuestionOption[];
  exclusive?: string;
  buckets?: Record<string, OpenScoreBucketDef>;
  openScore?: Record<string, OpenScoreBucketDef>;
  stageQ?: boolean;
  attention?: boolean;
  expect?: number;
  ds?: boolean;
  evidence?: boolean;
  recent?: boolean;
}

export interface ScenarioOption {
  k: string;
  t: string;
  c?: CapDelta;
  s?: SigDelta;
  g?: TagDelta;
  note?: string;
}

export interface Scenario {
  id: string;
  route: RouteKey;
  title: string;
  situation: string;
  idx?: string;
  options: ScenarioOption[];
}

export interface Archetype {
  k: string;
  d: string;
  caps: Partial<Record<CapabilityKey, number>>;
  tag: TagKey | null;
  tw: number;
}

export interface ScoredArchetype extends Archetype {
  score: number;
}

export interface CatalogItem {
  n: string;
  fmt: string;
  dur: string;
  lvl: string;
  cap: CapabilityKey;
  cap2: CapabilityKey | null;
  bar: SignalKey[];
  stages: StageKey[];
  out: string;
  legal?: boolean;
  lang?: boolean;
}

export interface PathItem extends CatalogItem {
  p: number;
  why: string[];
}

/* ---------------------------------------------------------------------- */
/* Engine state (per-session, held by the factory returned from
 * createAssessmentEngine() — NOT a module-level global). */

export type AnswerValue = number | number[] | string | null | undefined;

export interface ResourceState {
  r1: string;
  r2: string;
  r3: string;
  use: string;
}

export interface ScenarioAnswer {
  most?: string;
  least?: string;
  why?: string;
}

export interface EngineState {
  answers: Record<string, AnswerValue>;
  openOv: Record<string, string>;
  res: ResourceState;
  scn: Record<string, ScenarioAnswer>;
}

/* ---------------------------------------------------------------------- */
/* compute() output */

export interface SlotAccumulator {
  raw: number;
  n: number;
  ids: string[];
}

export type EngineAccumulator = Record<SourceKey, Record<CapabilityKey, SlotAccumulator>>;

export interface TraceEntry {
  id: string;
  src: SourceKey;
  label: string;
  c: CapDelta;
  s: SigDelta;
  g: TagDelta;
}

export interface RestrictionEntry {
  id: string;
  kind: RestrictionKind;
  label: string;
  note: string;
}

export interface SignalResult {
  k: SignalKey;
  n: string;
  raw: number;
  max: number;
  pct: number;
  level: IntensityKey;
}

export interface ConsistencyCheck {
  id: string;
  n: string;
  refs: string;
  status: 'na' | 'ok' | 'alert';
  detail: string;
}

export interface ConfidencePart {
  n: string;
  v: number;
  max: number;
  d: string;
}

export interface PenaltyEntry {
  n: string;
  v: number;
}

export interface ConfidenceResult {
  total: number;
  level: ConfidenceLevel;
  msg: string;
  parts: ConfidencePart[];
  pens: PenaltyEntry[];
  penTotal: number;
}

export interface NarrativeCriterion {
  hit: boolean;
  t: string;
}

export interface SignalNarrative {
  k: NarrativeKey;
  name: string;
  msg: string;
  hits: string[];
  n: number;
  tot: number;
  pct: number;
  level: IntensityKey;
}

export interface ComputeResult {
  stage: StageKey;
  capScore: Record<CapabilityKey, number | null>;
  capLevel: Record<CapabilityKey, CapLevel>;
  perSource: Record<SourceKey, Record<CapabilityKey, number | null>>;
  contrib: Record<CapabilityKey, Partial<Record<SourceKey, { w: number; v: number }>>>;
  readiness: number | null;
  signals: SignalResult[];
  sigPct: Record<SignalKey, number>;
  archs: ScoredArchetype[];
  checks: ConsistencyCheck[];
  conf: ConfidenceResult;
  strengths: CapabilityKey[];
  gapsTop: CapabilityKey[];
  critical: CapabilityKey[];
  strategic: CapabilityKey[];
  narratives: SignalNarrative[];
  path: PathItem[];
  trace: TraceEntry[];
  restr: RestrictionEntry[];
  acc: EngineAccumulator;
  dsExtremes: number;
  attFail: boolean;
  tagPct: Record<TagKey, number>;
  weights: Record<SourceKey, number>;
}
