/**
 * The only module in this feature that touches the network. Never imported
 * BY persistence.ts (D21) — that would reintroduce an env/network read into
 * the pure TDD seam.
 *
 * Manually verified per D11 — mocking @supabase/supabase-js here would
 * assert the shape of a mock, not of Postgres.
 */
import { createServerSupabaseClient } from '../supabase/server';
import { isUuid, type RespondentRow, type ResultRow } from './persistence';
import type { ComputeResult, StageKey } from './types';

/** The ONLY shape that ever leaves the DB layer toward a consumer (D12 + minimal read contract). */
export interface PublicAssessmentResult {
  stage: StageKey;
  readiness: number | null;
  result: ComputeResult;
}
// NOTE: no `answers` (so no scn[*].why either), no `full_name`, no `email`,
// no `respondent_id`, no `id`.

/**
 * Two non-atomic inserts (D19) — PostgREST has no cross-request transaction.
 * A failed second insert orphans a respondent row; accepted for v1 (D7/D19).
 */
export async function saveAssessment(rows: {
  respondent: RespondentRow;
  result: ResultRow;
}): Promise<{ id: string }> {
  const supabase = createServerSupabaseClient();

  const { data: respondent, error: respondentError } = await supabase
    .from('respondents')
    .insert(rows.respondent)
    .select('id')
    .single();

  if (respondentError) throw respondentError;

  const { data: result, error: resultError } = await supabase
    .from('assessment_results')
    .insert({ ...rows.result, respondent_id: respondent.id })
    .select('id')
    .single();

  if (resultError) throw resultError;

  return { id: result.id as string };
}

export async function getAssessmentResult(id: string): Promise<PublicAssessmentResult | null> {
  if (!isUuid(id)) return null; // D15 — malformed tokens never reach Postgres (avoids a 22P02 -> 500)

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('assessment_results')
    // Explicit column list IS the contract — never select('*') here (D12).
    .select('stage, readiness, result')
    .eq('id', id)
    .maybeSingle(); // D16 — .single() would turn "no such token" into a 500

  if (error) throw error;
  if (!data) return null;

  return data as unknown as PublicAssessmentResult;
}
