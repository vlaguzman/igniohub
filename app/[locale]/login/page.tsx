import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth/LoginForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'loginPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'loginPage' });

  return (
    <main className="flex min-h-screen items-center justify-center bg-ice-blue-base px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-charcoal-slate/10 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-charcoal-slate">{t('title')}</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
