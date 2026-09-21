import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const BENEFIT_KEYS = ['b1', 'b2', 'b3', 'b4'] as const;

export function ForIndividuals() {
  const t = useTranslations('landing.forIndividuals');
  const locale = useLocale();

  return (
    <Section id="individuals" tone="white">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <SectionHeading>{t('title')}</SectionHeading>
          <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('body')}</p>
          <Link
            href={`/${locale}/assessment`}
            className="mt-8 inline-block rounded-full bg-ignio-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('cta')}
          </Link>
        </div>

        <ul className="space-y-4">
          {BENEFIT_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-3 rounded-xl bg-ice-blue-base/50 p-4">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ignio-purple" />
              <span className="text-sm text-charcoal-slate">{t(`benefits.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
