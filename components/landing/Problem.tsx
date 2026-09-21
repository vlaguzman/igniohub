import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const SITUATION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;

export function Problem() {
  const t = useTranslations('landing.problem');

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SITUATION_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl bg-ice-blue-base/50 px-4 py-3 text-sm font-medium text-charcoal-slate"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-ignio-purple" />
            {t(`situations.${key}`)}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xl font-semibold text-ignio-purple">
        {t('highlight')}
      </p>
    </Section>
  );
}
