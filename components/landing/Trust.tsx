import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const INSTITUTION_KEYS = ['cancilleria', 'consulado', 'colombiaNosUne', 'procolombia'] as const;

export function Trust() {
  const t = useTranslations('landing.trust');

  return (
    <Section tone="sand">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('framing')}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSTITUTION_KEYS.map((key) => (
          <div
            key={key}
            className="flex min-h-[96px] items-center justify-center rounded-xl border border-charcoal-slate/15 bg-white p-5 text-center"
          >
            <p className="text-sm font-semibold text-charcoal-slate">{t(`institutions.${key}`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
