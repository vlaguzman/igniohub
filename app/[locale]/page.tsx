import { useTranslations } from 'next-intl';

// Placeholder landing page. Real copy and layout are out of scope here —
// another engineer owns the bilingual marketing content.
export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-charcoal-slate">{t('title')}</h1>
    </main>
  );
}
