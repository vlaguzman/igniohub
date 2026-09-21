import { AssessmentApp } from '@/components/assessment/AssessmentApp';

// The assessment instrument's content (questions, options, results copy) is
// Spanish-only for v1 — a deliberate scope decision, not an oversight. The
// route stays reachable at both /en/assessment and /es/assessment: the same
// Spanish content renders either way, and AssessmentApp shows a small
// English-only notice banner when locale === 'en'.
export default async function AssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AssessmentApp locale={locale} />;
}
