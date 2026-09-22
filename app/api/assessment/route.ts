import { NextResponse } from 'next/server';

import { buildRows, recompute, validateSubmission } from '@/lib/assessment/persistence';
import { saveAssessment } from '@/lib/assessment/repository';

/**
 * First API route in the project. Manually verified per D11 (no jsdom/HTTP
 * test tooling in the repo).
 *
 * The client posts only raw EngineState (D-#2 in the proposal) — this
 * handler recomputes stage/readiness/result server-side and never trusts a
 * client-submitted score.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const validated = validateSubmission(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const result = recompute(validated.value.state);
    const rows = buildRows(validated.value, result);
    const { id } = await saveAssessment(rows);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    // Never echo the Postgres/driver error message to the client.
    console.error('POST /api/assessment failed', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
