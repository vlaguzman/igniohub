import { useTranslations } from 'next-intl';

// Placeholder for the interactive behavioural-assessment tool. The real
// diagnostic instrument logic is out of scope here — another engineer owns it.
export default function AssessmentPage() {
  const t = useTranslations('AssessmentPage');

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-charcoal-slate">{t('title')}</h1>
    </main>
  );
}
