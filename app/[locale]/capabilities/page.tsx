import type { Metadata } from 'next';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Section, Eyebrow, SectionHeading } from '@/components/landing/Section';
import { CAPABILITY_KEYS } from '@/lib/sample-profile';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'capabilitiesPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default function CapabilitiesPage() {
  const t = useTranslations('capabilitiesPage');
  const tLanding = useTranslations('landing.capabilities.items');
  const locale = useLocale();

  return (
    <>
      <Header />
      <main>
        <Section tone="ice" className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('hero.eyebrow')}</Eyebrow>
            <h1 className="text-4xl font-bold text-charcoal-slate sm:text-5xl">{t('hero.title')}</h1>
            <p className="mt-6 text-lg text-charcoal-slate/80">{t('hero.body')}</p>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-4xl space-y-10">
            {CAPABILITY_KEYS.map((key) => (
              <div key={key} className="rounded-2xl border border-charcoal-slate/10 bg-ice-blue-base/30 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal-slate">{tLanding(`${key}.name`)}</h2>
                <p className="mt-2 text-sm font-semibold text-ignio-purple">
                  {t(`items.${key}.description`)}
                </p>
                <p className="mt-4 text-sm text-charcoal-slate/80 sm:text-base">
                  {t(`items.${key}.expanded`)}
                </p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-charcoal-slate/60">
                  {t('labels.examplesHeading')}
                </p>
                <ul className="mt-2 space-y-2">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-charcoal-slate/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ignio-purple" />
                      <span>{t(`items.${key}.examples.${i}`)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-lg bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ignio-amber">
                    {t('labels.developmentHeading')}
                  </p>
                  <p className="mt-1 text-sm text-charcoal-slate/80">{t(`items.${key}.development`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="forest">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-warm-sand sm:text-4xl">{t('finalCta.title')}</h2>
            <Link
              href={`/${locale}/assessment`}
              className="mt-8 inline-block rounded-full bg-ignio-amber px-8 py-3 text-sm font-semibold text-charcoal-slate transition hover:opacity-90"
            >
              {t('finalCta.cta')}
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
