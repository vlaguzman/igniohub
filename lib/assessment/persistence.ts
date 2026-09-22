/**
 * Pure validation and server-derived recompute for assessment submissions.
 *
 * Zero I/O, zero Supabase imports (D21) — this is the TDD seam. repository.ts
 * is the only module that touches the network; it must never be imported
 * from here.
 */
import { createAssessmentEngine } from './engine';
import type {
  AnswerValue,
  ComputeResult,
  EngineState,
  ResourceState,
  ScenarioAnswer,
  StageKey,
} from './types';

export const ENGINE_VERSION = '1';

export type ValidationError =
  | 'invalid_body'
  | 'invalid_full_name'
  | 'invalid_email'
  | 'invalid_state'
  | 'invalid_answers'
  | 'invalid_open_ov'
  | 'invalid_res'
  | 'invalid_scn';

export interface ValidSubmission {
  fullName: string; // trimmed, 1..120
  email: string; // trimmed, lowercased, <=254
  state: EngineState; // freshly reconstructed (D13)
}

export type ValidationResult =
  | { ok: true; value: ValidSubmission }
  | { ok: false; error: ValidationError };

// Deliberately permissive — mirror this exact regex client-side (RespondentForm, Slice 2).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// D13 — never assign into these key names during record reconstruction. A
// plain object literal target combined with bracket assignment can still
// trigger Object.prototype's legacy __proto__ accessor.
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAnswerValue(value: unknown): value is AnswerValue {
  if (value === null) return true;
  if (typeof value === 'string') return true;
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.every(item => typeof item === 'number');
  return false;
}

/** D13 — reconstructs a fresh Record; never returns the caller's object. */
function reconstructAnswers(input: unknown): Record<string, AnswerValue> | null {
  if (!isPlainObject(input)) return null;
  const out: Record<string, AnswerValue> = {};
  for (const key of Object.keys(input)) {
    if (UNSAFE_KEYS.has(key)) continue;
    const value = input[key];
    if (!isAnswerValue(value)) return null;
    out[key] = value;
  }
  return out;
}

function reconstructOpenOv(input: unknown): Record<string, string> | null {
  if (!isPlainObject(input)) return null;
  const out: Record<string, string> = {};
  for (const key of Object.keys(input)) {
    if (UNSAFE_KEYS.has(key)) continue;
    const value = input[key];
    if (typeof value !== 'string') return null;
    out[key] = value;
  }
  return out;
}

/** D14 — res is required whole: all four fields must be present strings. */
function reconstructRes(input: unknown): ResourceState | null {
  if (!isPlainObject(input)) return null;
  const { r1, r2, r3, use } = input;
  if (
    typeof r1 !== 'string' ||
    typeof r2 !== 'string' ||
    typeof r3 !== 'string' ||
    typeof use !== 'string'
  ) {
    return null;
  }
  return { r1, r2, r3, use };
}

/** D13/D22 — copies most/least/why explicitly. Dropping `why` here would
 *  silently no-op the D22 feature; test 5c guards against exactly that. */
function reconstructScenarioAnswer(input: unknown): ScenarioAnswer | null {
  if (!isPlainObject(input)) return null;
  const entry: ScenarioAnswer = {};
  for (const field of ['most', 'least', 'why'] as const) {
    const value = input[field];
    if (value === undefined) continue;
    if (typeof value !== 'string') return null;
    entry[field] = value;
  }
  return entry;
}

function reconstructScn(input: unknown): Record<string, ScenarioAnswer> | null {
  if (!isPlainObject(input)) return null;
  const out: Record<string, ScenarioAnswer> = {};
  for (const key of Object.keys(input)) {
    if (UNSAFE_KEYS.has(key)) continue;
    const entry = reconstructScenarioAnswer(input[key]);
    if (entry === null) return null;
    out[key] = entry;
  }
  return out;
}

/**
 * Accepts `unknown` (a JSON.parse output). Never throws.
 *
 * D13 — reconstructs a fresh {answers, openOv, res, scn} literal from
 * individually checked values; the caller's object never reaches
 * engine.loadState(). D2 — every one of the four EngineState keys must be
 * present and correctly typed; nothing is computed against engine defaults.
 */
export function validateSubmission(input: unknown): ValidationResult {
  if (!isPlainObject(input)) return { ok: false, error: 'invalid_body' };

  const rawFullName = input.fullName;
  const fullName = typeof rawFullName === 'string' ? rawFullName.trim() : '';
  if (typeof rawFullName !== 'string' || fullName.length === 0 || fullName.length > 120) {
    return { ok: false, error: 'invalid_full_name' };
  }

  const rawEmail = input.email;
  if (typeof rawEmail !== 'string') return { ok: false, error: 'invalid_email' };
  const email = rawEmail.trim().toLowerCase();
  if (email.length === 0 || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'invalid_email' };
  }

  const rawState = input.state;
  if (!isPlainObject(rawState)) return { ok: false, error: 'invalid_state' };

  const answers = reconstructAnswers(rawState.answers);
  if (answers === null) return { ok: false, error: 'invalid_answers' };

  const openOv = reconstructOpenOv(rawState.openOv);
  if (openOv === null) return { ok: false, error: 'invalid_open_ov' };

  const res = reconstructRes(rawState.res);
  if (res === null) return { ok: false, error: 'invalid_res' };

  const scn = reconstructScn(rawState.scn);
  if (scn === null) return { ok: false, error: 'invalid_scn' };

  const state: EngineState = { answers, openOv, res, scn };

  return { ok: true, value: { fullName, email, state } };
}

/** D1 — three statements. loadState returns void; it does NOT chain. */
export function recompute(state: EngineState): ComputeResult {
  const engine = createAssessmentEngine();
  engine.loadState(state);
  return engine.compute();
}

export interface RespondentRow {
  full_name: string;
  email: string;
}

export interface ResultRow {
  stage: StageKey;
  readiness: number | null; // D6
  answers: EngineState; // includes scn[*].why (D22)
  result: ComputeResult;
  engine_version: string; // D18
}

/** Row shaping only. stage/readiness are sourced from the ComputeResult,
 * never re-derived from the payload. */
export function buildRows(
  submission: ValidSubmission,
  result: ComputeResult,
): { respondent: RespondentRow; result: ResultRow } {
  return {
    respondent: {
      full_name: submission.fullName,
      email: submission.email,
    },
    result: {
      stage: result.stage,
      readiness: result.readiness,
      answers: submission.state,
      result,
      engine_version: ENGINE_VERSION,
    },
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** D15 — used to disambiguate malformed vs. unknown tokens before any
 * query runs; both cases return 404, never a 500 from a Postgres 22P02
 * "invalid input syntax for type uuid" error. */
export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}
