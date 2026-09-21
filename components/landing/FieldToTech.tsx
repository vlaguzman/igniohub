import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

export function FieldToTech() {
  const t = useTranslations('landing.fieldToTech');
  const locale = useLocale();

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-6 text-base text-charcoal-slate/80 sm:text-lg">{t('body1')}</p>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('body2')}</p>
        <Link
          href={`/${locale}/methodology`}
          className="mt-8 inline-block rounded-full border border-ignio-purple/30 px-6 py-3 text-sm font-semibold text-ignio-purple transition hover:bg-ignio-purple/5"
        >
          {t('cta')}
        </Link>
      </div>
    </Section>
  );
}
