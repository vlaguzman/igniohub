import type { Metadata } from 'next';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Section, Eyebrow, SectionHeading } from '@/components/landing/Section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'methodologyPage.metadata' });
  return { title: t('title'), description: t('description') };
}

export default function MethodologyPage() {
  const t = useTranslations('methodologyPage');
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
            <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('origin.body')}</p>
            <Link
              href={`/${locale}/about`}
              className="mt-6 inline-block rounded-full border border-ignio-purple/30 px-6 py-3 text-sm font-semibold text-ignio-purple transition hover:bg-ignio-purple/5"
            >
              {t('origin.cta')}
            </Link>
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('builtFrom.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80">{t('builtFrom.body')}</p>
          </div>
        </Section>

        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('howItWorks.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80">{t('howItWorks.body')}</p>
          </div>
        </Section>

        <Section tone="sand">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('evolution.title')}</SectionHeading>
            <p className="mt-4 text-base text-charcoal-slate/80">{t('evolution.body')}</p>
          </div>
        </Section>

        {/*
          Limitations are stated plainly and not softened — per project
          instructions, this section must not be buried or diluted into
          meaninglessness.
        */}
        <Section tone="white">
          <div className="mx-auto max-w-3xl">
            <SectionHeading>{t('limitations.title')}</SectionHeading>
            <ul className="mt-6 space-y-4">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-ice-blue-base/40 p-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ignio-purple" />
                  <span className="text-sm text-charcoal-slate">{t(`limitations.items.${i}`)}</span>
                </li>
              ))}
            </ul>
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
