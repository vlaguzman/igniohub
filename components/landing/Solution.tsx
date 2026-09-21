import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const STEP_KEYS = ['assess', 'analyse', 'develop', 'measure'] as const;

export function Solution() {
  const t = useTranslations('landing.solution');

  return (
    <Section id="approach" tone="sand">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEP_KEYS.map((key, index) => (
          <div key={key} className="rounded-xl bg-white p-6 shadow-sm">
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ignio-purple text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="text-lg font-bold text-charcoal-slate">{t(`steps.${key}.name`)}</h3>
            <p className="mt-2 text-sm text-charcoal-slate/80">{t(`steps.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
