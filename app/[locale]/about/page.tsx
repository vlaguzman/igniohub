import type { Metadata } from 'next';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Section, Eyebrow, SectionHeading } from '@/components/landing/Section';

const MEMBER_KEYS = ['diana', 'andres', 'vladimir'] as const;
const INSTITUTION_KEYS = ['cancilleria', 'consulado', 'colombiaNosUne', 'procolombia'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const locale = useLocale();

  return (
    <>
      <Header />
      <main>
        <Section tone="ice" className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center">{t('hero.eyebrow')}</Eyebrow>
            <h1 className="text-4xl font-bold text-charcoal-slate sm:text-5xl">{t('hero.title')}</h1>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('origin.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('origin.body1')}</p>
            <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('origin.body2')}</p>
            <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('origin.body3')}</p>
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading>{t('mission.title')}</SectionHeading>
            <p className="mt-4 text-lg font-medium text-charcoal-slate">{t('mission.body')}</p>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading>{t('team.title')}</SectionHeading>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {MEMBER_KEYS.map((key) => (
              <div key={key} className="rounded-xl border border-charcoal-slate/10 bg-ice-blue-base/40 p-6">
                <h3 className="text-lg font-bold text-charcoal-slate">{t(`team.members.${key}.name`)}</h3>
                <p className="mt-1 text-sm font-semibold text-ignio-purple">
                  {t(`team.members.${key}.role`)}
                </p>
                <p className="mt-3 text-sm text-charcoal-slate/80">{t(`team.members.${key}.bio`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="forest">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="text-center" tone="amber">
              {t('institutions.title')}
            </Eyebrow>
            <p className="text-base text-warm-sand/80">{t('institutions.body')}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSTITUTION_KEYS.map((key) => (
              <div
                key={key}
                className="flex min-h-[88px] items-center justify-center rounded-xl border border-warm-sand/15 p-5 text-center"
              >
                <p className="text-sm font-semibold text-warm-sand">{t(`institutions.items.${key}`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold text-charcoal-slate">{t('closing.body')}</p>
            <Link
              href={`/${locale}/assessment`}
              className="mt-8 inline-block rounded-full bg-ignio-purple px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
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
