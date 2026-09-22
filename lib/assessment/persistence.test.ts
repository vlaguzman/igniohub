import { describe, expect, it } from 'vitest';

import { FIXTURE } from './engine.test';
import { buildRows, ENGINE_VERSION, isUuid, recompute, validateSubmission } from './persistence';
import type { ComputeResult, EngineState } from './types';

/**
 * lib/assessment/persistence.ts is pure — zero I/O, zero Supabase imports
 * (D21). Nothing here is mocked; that is the point of the seam. Importing
 * FIXTURE from ./engine.test also re-registers that file's own parity
 * test when this file is collected — expected and benign.
 */

function validPayload() {
  return {
    fullName: 'Ana Gómez',
    email: 'ana@example.com',
    state: JSON.parse(JSON.stringify(FIXTURE)) as EngineState,
  };
}

describe('validateSubmission — group A (submission shape + EngineState validation)', () => {
  it('case 1 (anchor): accepts a JSON-round-tripped FIXTURE and recomputes the ground-truth result', () => {
    const payload = validPayload();

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const computed = recompute(result.value.state);
    expect(computed.stage).toBe('idea');
    expect(computed.readiness).toBe(77);
  });

  it('case 2: rejects a state missing openOv', () => {
    const payload = validPayload();
    delete (payload.state as Partial<EngineState>).openOv;

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_open_ov' });
  });

  it('case 2: rejects a state missing answers', () => {
    const payload = validPayload();
    delete (payload.state as Partial<EngineState>).answers;

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_answers' });
  });

  it('case 2: rejects a state missing scn (D2 tampering vector)', () => {
    const payload = validPayload();
    delete (payload.state as Partial<EngineState>).scn;

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_scn' });
  });

  it('case 3: rejects res: {} (one-level-down shallow-merge vector, D14)', () => {
    const payload = validPayload();
    payload.state.res = {} as EngineState['res'];

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_res' });
  });

  it('case 3: rejects a partially-filled res', () => {
    const payload = validPayload();
    payload.state.res = { r1: 'x' } as unknown as EngineState['res'];

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_res' });
  });

  it('case 4: rejects an answers entry with a disallowed shape', () => {
    const payload = validPayload();
    payload.state.answers = { 'B1-Q1': { evil: true } } as unknown as EngineState['answers'];

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_answers' });
  });

  it('case 4: accepts number, number[], string, and null answer values', () => {
    const payload = validPayload();
    payload.state.answers = { a: 1, b: [1, 2, 3], c: 'text', d: null };

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
  });

  it('case 5a: rejects a scn entry with a non-string most', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { most: 5 } } as unknown as EngineState['scn'];

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_scn' });
  });

  it('case 5a: rejects a scn entry with a non-string why', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { why: 42 } } as unknown as EngineState['scn'];

    expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_scn' });
  });

  it('case 5b: accepts a scn entry with only most set (least and why absent, D9/D14)', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { most: 'A' } };

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.state.scn.T1).toEqual({ most: 'A' });
  });

  it('case 5c (state half, D22): a scn why round-trips through validateSubmission', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { most: 'A', least: 'C', why: 'porque tengo poco tiempo' } };

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.state.scn.T1.why).toBe('porque tengo poco tiempo');
  });

  it('case 5d: accepts a why-only scn entry with no most selected', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { why: 'x' } };

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.state.scn.T1).toEqual({ why: 'x' });
  });

  it('case 6: normalizes email casing and surrounding whitespace', () => {
    const payload = validPayload();
    payload.email = '  Ana@Example.COM ';

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.email).toBe('ana@example.com');
  });

  it('case 6: rejects malformed and non-string emails', () => {
    for (const bad of ['', 'nope', 'a@b', 42]) {
      const payload = validPayload();
      payload.email = bad as unknown as string;
      expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_email' });
    }
  });

  it('case 7: trims fullName', () => {
    const payload = validPayload();
    payload.fullName = '  Ana Gómez  ';

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fullName).toBe('Ana Gómez');
  });

  it('case 7: rejects whitespace-only and non-string fullName', () => {
    for (const bad of ['   ', 42]) {
      const payload = validPayload();
      payload.fullName = bad as unknown as string;
      expect(validateSubmission(payload)).toEqual({ ok: false, error: 'invalid_full_name' });
    }
  });

  it('case 8: reconstruction drops state.extraKey and a JSON-smuggled top-level __proto__ key (D13)', () => {
    const raw = JSON.parse(
      '{"answers":{"a":1,"__proto__":{"nested":true}},"openOv":{},' +
        '"res":{"r1":"","r2":"","r3":"","use":""},"scn":{},' +
        '"extraKey":"nope","__proto__":{"polluted":true}}',
    );
    const payload = { fullName: 'Ana Gómez', email: 'ana@example.com', state: raw };

    const result = validateSubmission(payload);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.value.state)).toEqual(['answers', 'openOv', 'res', 'scn']);
    expect(Object.getPrototypeOf(result.value.state)).toBe(Object.prototype);
    expect(Object.keys(result.value.state.answers)).not.toContain('__proto__');
    expect((result.value.state as unknown as { polluted?: unknown }).polluted).toBeUndefined();
    expect((Object.prototype as unknown as { polluted?: unknown }).polluted).toBeUndefined();
  });
});

describe('buildRows — group B (row shaping)', () => {
  it('case 9: passes readiness: null through untouched', () => {
    const payload = validPayload();
    const submitted = validateSubmission(payload);
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;

    const fakeResult = { stage: 'idea', readiness: null } as unknown as ComputeResult;

    const rows = buildRows(submitted.value, fakeResult);

    expect(rows.result.readiness).toBeNull();
  });

  it('case 9: sources stage from the ComputeResult, not the payload', () => {
    const payload = validPayload();
    const submitted = validateSubmission(payload);
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;

    const fakeResult = { stage: 'founder', readiness: 62 } as unknown as ComputeResult;

    const rows = buildRows(submitted.value, fakeResult);

    expect(rows.result.stage).toBe('founder');
  });

  it('case 9: stamps engine_version with ENGINE_VERSION', () => {
    const payload = validPayload();
    const submitted = validateSubmission(payload);
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;

    const fakeResult = { stage: 'idea', readiness: 50 } as unknown as ComputeResult;

    const rows = buildRows(submitted.value, fakeResult);

    expect(rows.result.engine_version).toBe(ENGINE_VERSION);
  });

  it('case 5c (buildRows half, D22 regression guard R4b): scn why survives row shaping', () => {
    const payload = validPayload();
    payload.state.scn = { T1: { most: 'A', least: 'C', why: 'porque tengo poco tiempo' } };
    const submitted = validateSubmission(payload);
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;

    const computed = recompute(submitted.value.state);
    const rows = buildRows(submitted.value, computed);

    expect(rows.result.answers.scn.T1.why).toBe('porque tengo poco tiempo');
  });

  it('shapes the respondent row from full_name/email', () => {
    const payload = validPayload();
    const submitted = validateSubmission(payload);
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;

    const fakeResult = { stage: 'idea', readiness: 77 } as unknown as ComputeResult;

    const rows = buildRows(submitted.value, fakeResult);

    expect(rows.respondent).toEqual({ full_name: 'Ana Gómez', email: 'ana@example.com' });
  });
});

describe('isUuid — group C (D15 token guard)', () => {
  it('case 10: accepts a well-formed v4 uuid', () => {
    expect(isUuid('e8d3f1a2-4b5c-4d6e-8f7a-9b0c1d2e3f4a')).toBe(true);
  });

  it('case 10: rejects a non-uuid string', () => {
    expect(isUuid('abc')).toBe(false);
  });

  it('case 10: rejects an empty string', () => {
    expect(isUuid('')).toBe(false);
  });

  it('case 10: rejects a sql-injection-shaped string', () => {
    expect(isUuid("1' or '1'='1")).toBe(false);
  });

  it('case 10: rejects a uuid with trailing whitespace', () => {
    expect(isUuid('e8d3f1a2-4b5c-4d6e-8f7a-9b0c1d2e3f4a ')).toBe(false);
  });

  it('case 10: rejects non-string input', () => {
    expect(isUuid(42)).toBe(false);
    expect(isUuid(null)).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });
});
