import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';
import { CAPABILITY_KEYS } from '@/lib/sample-profile';

export function Capabilities() {
  const t = useTranslations('landing.capabilities');

  return (
    <Section id="product" tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('intro')}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITY_KEYS.map((key) => (
          <div key={key} className="rounded-xl border border-charcoal-slate/10 bg-ice-blue-base/50 p-5">
            <h3 className="text-base font-bold text-charcoal-slate">{t(`items.${key}.name`)}</h3>
            <p className="mt-2 text-sm text-charcoal-slate/80">{t(`items.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
