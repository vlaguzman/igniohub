import { NextResponse } from 'next/server';

import { getAssessmentResult } from '@/lib/assessment/repository';

/**
 * Thin wrapper over getAssessmentResult (D12). The results page RSC calls
 * the same function directly with no HTTP hop; this route exists for
 * external/JS consumers. Both inherit the minimal-response contract
 * enforced inside getAssessmentResult.
 *
 * Next 16 — `params` is a Promise.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = await getAssessmentResult(id);
    if (!data) {
      // D15 — both a malformed and an unknown-but-well-formed id return 404.
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('GET /api/assessment/[id] failed', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
