import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow } from './Section';
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
            <a
              href="#organisations"
              className="rounded-full border border-charcoal-slate/30 px-6 py-3 text-sm font-semibold text-charcoal-slate transition hover:bg-white"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <p className="mb-5 text-sm font-semibold text-charcoal-slate">{t('hero.sampleCard.title')}</p>
          <div className="space-y-3">
            {CAPABILITY_KEYS.map((key) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs text-charcoal-slate/70">
                  <span>{t(`capabilities.items.${key}.name`)}</span>
                  <span className="font-semibold text-charcoal-slate">{SAMPLE_SCORES[key]}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ice-blue-base">
                  <div
                    className="h-full rounded-full bg-ignio-purple"
                    style={{ width: `${SAMPLE_SCORES[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs italic text-charcoal-slate/60">{t('hero.sampleCard.note')}</p>
        </div>
      </div>
    </Section>
  );
}
