import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const EXAMPLE_KEYS = ['exploring', 'validating', 'confidence', 'collaborating', 'strengthening'] as const;

export function ForIndividuals() {
  const t = useTranslations('landing.forIndividuals');
  const locale = useLocale();

  return (
    <Section id="individuals" tone="white">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionHeading>{t('title')}</SectionHeading>
          <Link
            href={`/${locale}/assessment`}
            className="mt-8 inline-block rounded-full bg-ignio-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('cta')}
          </Link>
        </div>

        <ul className="space-y-4">
          {EXAMPLE_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-3 rounded-xl bg-ice-blue-base/50 p-4">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ignio-purple" />
              <span className="text-sm text-charcoal-slate">{t(`examples.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
