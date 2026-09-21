/**
 * UI-only helpers for the assessment instrument.
 *
 * Nothing here touches scoring math — it only replicates the tiny,
 * side-effect-free bits of routing/answered-ness logic that the engine
 * keeps private (`stageOf`, `activeScenarios`, `isAnswered`), so the React
 * layer can render the right scenarios and a progress indicator without
 * reaching into `lib/assessment/engine.ts` internals or modifying it.
 *
 * `lib/assessment/` itself is verified against a parity test and must not
 * be edited — see the task brief. This file is intentionally separate.
 */
import { STAGE_ROUTE } from '@/lib/assessment/data/capabilities';
import { Q } from '@/lib/assessment/data/questions';
import { SCENARIOS } from '@/lib/assessment/data/scenarios';
import { QBY } from '@/lib/assessment/engine';
import type { EngineState, Question, Scenario, StageKey } from '@/lib/assessment/types';

/** Mirrors engine.ts's private stageOf() exactly (verified against
 * lines ~179-187 of engine.ts): B1-Q12 drives the stage when answered,
 * otherwise B1-Q5 index 5 ("Tengo un negocio") implies founder, otherwise
 * explorador. */
export function stageOf(state: EngineState): StageKey {
  const q12 = state.answers['B1-Q12'];
  if (typeof q12 === 'number') {
    const opt = QBY['B1-Q12'].options?.[q12];
    if (opt?.stage) return opt.stage;
  }
  if (state.answers['B1-Q5'] === 5) return 'founder';
  return 'explorador';
}

/** Mirrors engine.ts's private activeScenarios() exactly: scenarios whose
 * route matches the current stage's route, plus the always-on 'T' set. */
export function activeScenarios(stage: StageKey): Scenario[] {
  const route = STAGE_ROUTE[stage];
  return SCENARIOS.filter((s) => s.route === route || s.route === 'T');
}

/** Mirrors engine.ts's private isAnswered() for progress-bar purposes only
 * (not used for scoring). Attention-check questions are excluded from
 * counts, matching the engine's own confidence grp() helper, so the
 * top-of-page progress % doesn't drift from the Confianza tab's own
 * completeness breakdown. */
export function isQuestionAnswered(q: Question, state: EngineState): boolean {
  if (q.type === 'multi') {
    const v = state.answers[q.id];
    return Array.isArray(v) && v.length > 0;
  }
  if (q.type === 'resources') {
    return !!(state.res.r1 || state.res.r2 || state.res.r3 || state.res.use);
  }
  if (q.type === 'open') {
    const v = state.answers[q.id];
    return !!((v as string | null | undefined) || '').trim();
  }
  const v = state.answers[q.id];
  return v !== undefined && v !== null;
}

export const FORM_STEPS = [
  { key: 'b1a', label: 'Bloque 1 · Perfil base' },
  { key: 'b1b', label: 'Bloque 1 · Estado funcional' },
  { key: 'b2a', label: 'Bloque 2 · Capacidades 1–4' },
  { key: 'b2b', label: 'Bloque 2 · Capacidades 5–8' },
  { key: 'b3', label: 'Escenarios' },
  { key: 'wit', label: 'Testigos' },
] as const;

export type StepKey = (typeof FORM_STEPS)[number]['key'];

export function questionsForStep(step: StepKey): Question[] {
  return Q.filter((q) => q.step === step);
}

export interface QuestionGroup {
  capHead?: string;
  capDesc?: string;
  questions: Question[];
}

/** Groups a step's questions by consecutive `cap` runs, surfacing the
 * `capHead`/`capDesc` carried by the first question of each capability
 * block. Questions without a `cap` (e.g. ATT-1) become their own
 * ungrouped, headerless entry. */
export function groupByCapability(questions: Question[]): QuestionGroup[] {
  const groups: QuestionGroup[] = [];
  let current: QuestionGroup | null = null;
  let currentCap: string | undefined;
  questions.forEach((q) => {
    if (!q.cap) {
      groups.push({ questions: [q] });
      current = null;
      currentCap = undefined;
      return;
    }
    if (!current || q.cap !== currentCap) {
      current = { capHead: q.capHead, capDesc: q.capDesc, questions: [q] };
      currentCap = q.cap;
      groups.push(current);
    } else {
      current.questions.push(q);
    }
  });
  return groups;
}

/** Total question count across steps b1a/b1b/b2a/b2b used for progress,
 * excluding attention-check items (mirrors the engine's own confidence
 * grouping, which also excludes them). */
export function countableStepQuestions(): Question[] {
  return Q.filter((q) => ['b1a', 'b1b', 'b2a', 'b2b'].includes(q.step) && !q.attention);
}
