import type { Metadata } from 'next';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Section, Eyebrow, SectionHeading } from '@/components/landing/Section';

const STEP_KEYS = ['assess', 'visualise', 'identify', 'intervene', 'measure'] as const;
const SEGMENT_KEYS = ['programmes', 'incubators', 'diaspora', 'economicIntegration'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'organizationsPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default function OrganizationsPage() {
  const t = useTranslations('organizationsPage');
  const tSegments = useTranslations('landing.forOrganisations');
  const locale = useLocale();

  return (
    <>
      <Header />
      <main>
        <Section tone="ice" className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('hero.eyebrow')}</Eyebrow>
            <h1 className="text-4xl font-bold text-charcoal-slate sm:text-5xl">{t('hero.title')}</h1>
            <p className="mt-6 text-lg text-charcoal-slate/80">{t('hero.subhead')}</p>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading>{t('process.title')}</SectionHeading>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEP_KEYS.map((key, index) => (
              <div key={key} className="rounded-xl bg-ice-blue-base/50 p-5">
                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ignio-purple text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-charcoal-slate">{t(`process.steps.${key}.name`)}</h3>
                <p className="mt-2 text-sm text-charcoal-slate/80">{t(`process.steps.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading>{t('useCases.title')}</SectionHeading>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {SEGMENT_KEYS.map((key) => (
              <div key={key} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-charcoal-slate">{tSegments(`segments.${key}`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="forest">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-warm-sand sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-4 text-base text-warm-sand/80">{t('cta.body')}</p>
            {/*
              There is no real contact channel yet (no form, no inbox to
              route to) — this page is the actual destination for that
              intent, so the CTA renders as a disabled "coming soon" state
              rather than a fabricated mailto: or contact form. Mirrors the
              pattern previously used on ForOrganisations.tsx before that
              button had a real destination (see git history). Needs a real
              destination (contact form, mailto:, or booking link) wired up
              before launch.
            */}
            <button
              type="button"
              title={t('cta.comingSoon')}
              className="mt-8 inline-block cursor-not-allowed rounded-full bg-ignio-amber px-8 py-3 text-sm font-semibold text-charcoal-slate opacity-90"
            >
              {t('cta.button')}
            </button>
            <p className="mt-6 text-sm text-warm-sand/70">
              {t('secondary.body')}{' '}
              <Link
                href={`/${locale}/evaluation`}
                className="underline underline-offset-2 hover:text-warm-sand"
              >
                {t('secondary.cta')}
              </Link>
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
