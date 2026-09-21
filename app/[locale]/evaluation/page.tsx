import type { Metadata } from 'next';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Section, Eyebrow, SectionHeading } from '@/components/landing/Section';
import {
  CAPABILITY_KEYS,
  SAMPLE_SCORES,
  STRONGEST_CAPABILITY,
  DEVELOPMENT_OPPORTUNITY,
} from '@/lib/sample-profile';

const WHO_FOR_KEYS = ['exploring', 'validating', 'running'] as const;
const STEP_KEYS = ['assess', 'understand', 'act', 'evolve'] as const;
const FAQ_KEYS = ['personalityTest', 'language', 'experience', 'results'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'evaluationPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default function EvaluationPage() {
  const t = useTranslations('evaluationPage');
  // The "Assess -> Understand -> Act -> Evolve" loop is shared with the home
  // page's HowItWorks section — reused here via the `landing.howItWorks`
  // namespace instead of duplicating the copy.
  const tLoop = useTranslations('landing.howItWorks');
  const tGet = useTranslations('landing.whatYouGet');
  const tCaps = useTranslations('landing.capabilities');
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
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('whatIsIt.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('whatIsIt.body')}</p>
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('whoFor.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80">{t('whoFor.body')}</p>
            <ul className="mt-8 space-y-4">
              {WHO_FOR_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ignio-purple" />
                  <span className="text-sm text-charcoal-slate">{t(`whoFor.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('howItWorks.eyebrow')}</Eyebrow>
            <SectionHeading>{t('howItWorks.title')}</SectionHeading>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_KEYS.map((key, index) => (
              <div key={key} className="rounded-xl bg-ice-blue-base/50 p-6">
                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ignio-purple text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-charcoal-slate">{tLoop(`steps.${key}.name`)}</h3>
                <p className="mt-2 text-sm text-charcoal-slate/80">{tLoop(`steps.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="ice">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('whatItMeasures.eyebrow')}</Eyebrow>
            <SectionHeading>{t('whatItMeasures.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80">{t('whatItMeasures.body')}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITY_KEYS.map((key) => (
              <div key={key} className="rounded-xl bg-white p-5 text-center shadow-sm">
                <p className="text-sm font-bold text-charcoal-slate">{tCaps(`items.${key}.name`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/capabilities`}
              className="inline-block rounded-full border border-ignio-purple/30 px-6 py-3 text-sm font-semibold text-ignio-purple transition hover:bg-ignio-purple/5"
            >
              {t('whatItMeasures.cta')}
            </Link>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('exampleResult.eyebrow')}</Eyebrow>
            <SectionHeading>{t('exampleResult.title')}</SectionHeading>
          </div>
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-ice-blue-base/40 p-6 shadow-lg sm:p-10">
            <p className="mb-5 text-sm font-semibold text-charcoal-slate">{tGet('profileLabel')}</p>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {CAPABILITY_KEYS.map((key) => (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs text-charcoal-slate/70">
                    <span>{tCaps(`items.${key}.name`)}</span>
                    <span className="font-semibold text-charcoal-slate">{SAMPLE_SCORES[key]}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-ignio-purple"
                      style={{ width: `${SAMPLE_SCORES[key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 border-t border-charcoal-slate/10 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ignio-purple">
                  {tGet('strongest.label')}
                </p>
                <p className="mt-1 text-lg font-bold text-charcoal-slate">
                  {tCaps(`items.${STRONGEST_CAPABILITY}.name`)}
                </p>
                <p className="mt-1 text-sm text-charcoal-slate/70">{tGet('strongest.note')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ignio-amber">
                  {tGet('opportunity.label')}
                </p>
                <p className="mt-1 text-lg font-bold text-charcoal-slate">
                  {tCaps(`items.${DEVELOPMENT_OPPORTUNITY}.name`)}
                </p>
                <p className="mt-1 text-sm text-charcoal-slate/70">{tGet('opportunity.note')}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-charcoal-slate/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-slate/60">
                {tGet('nextStep.label')}
              </p>
              <p className="mt-1 text-base text-charcoal-slate">{tGet('nextStep.value')}</p>
            </div>

            <p className="mt-6 text-xs italic text-charcoal-slate/60">{tGet('disclaimer')}</p>
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
            <div>
              <SectionHeading className="text-2xl sm:text-2xl">{t('whatYouReceive.title')}</SectionHeading>
              <p className="mt-3 text-sm text-charcoal-slate/80">{t('whatYouReceive.body')}</p>
            </div>
            <div>
              <SectionHeading className="text-2xl sm:text-2xl">{t('duration.title')}</SectionHeading>
              <p className="mt-3 text-sm text-charcoal-slate/80">{t('duration.body')}</p>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-4xl border-t border-charcoal-slate/10 pt-8">
            <SectionHeading className="text-2xl sm:text-2xl">{t('afterCompletion.title')}</SectionHeading>
            <p className="mt-3 text-sm text-charcoal-slate/80">{t('afterCompletion.body')}</p>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('faq.title')}</SectionHeading>
            <div className="mt-8 space-y-6">
              {FAQ_KEYS.map((key) => (
                <div key={key} className="border-b border-charcoal-slate/10 pb-6">
                  <p className="text-base font-semibold text-charcoal-slate">{t(`faq.items.${key}.q`)}</p>
                  <p className="mt-2 text-sm text-charcoal-slate/80">{t(`faq.items.${key}.a`)}</p>
                </div>
              ))}
            </div>
            {/*
              TODO: confirm real answers before launch for cost and whether
              registration is required — deliberately omitted here rather than
              guessed. See report for details.
            */}
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
