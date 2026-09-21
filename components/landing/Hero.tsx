import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow } from './Section';
import { RadarChart } from '@/components/shared/RadarChart';
import { CAPABILITY_KEYS, SAMPLE_SCORES } from '@/lib/sample-profile';

export function Hero() {
  const t = useTranslations('landing');
  const locale = useLocale();

  return (
    <Section id="hero" tone="ice" className="pt-28 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
          <h1 className="text-4xl font-bold leading-tight text-charcoal-slate sm:text-5xl">
            {t('hero.headline')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-charcoal-slate/80">{t('hero.subhead')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/assessment`}
              className="rounded-full bg-ignio-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t('hero.ctaPrimary')}
            </Link>
            <Link
              href={`/${locale}/organizations`}
              className="rounded-full border border-charcoal-slate/30 px-6 py-3 text-sm font-semibold text-charcoal-slate transition hover:bg-white"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
          <p className="mt-4 text-sm text-charcoal-slate/60">{t('hero.microcopy')}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <p className="mb-2 text-sm font-semibold text-charcoal-slate">{t('hero.sampleCard.title')}</p>
          <RadarChart
            data={CAPABILITY_KEYS.map((key) => ({
              key,
              label: t(`capabilities.items.${key}.name`),
              score: SAMPLE_SCORES[key],
            }))}
          />
          <p className="mt-2 text-center text-xs italic text-charcoal-slate/60">{t('hero.sampleCard.note')}</p>
        </div>
      </div>
    </Section>
  );
}
