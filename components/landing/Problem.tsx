import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

export function Problem() {
  const t = useTranslations('landing.problem');

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-6 text-base text-charcoal-slate/80 sm:text-lg">{t('body1')}</p>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('body2')}</p>
        <p className="mt-6 text-xl font-semibold text-ignio-purple">{t('highlight')}</p>
      </div>
    </Section>
  );
}
