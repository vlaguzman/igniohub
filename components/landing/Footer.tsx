import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-forest px-4 py-10 text-warm-sand sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/brand/isotype-white.png" alt="" width={182} height={296} className="h-8 w-auto" />
          <div>
            <p className="text-sm">{t('tagline')}</p>
            <p className="text-xs text-warm-sand/70">{t('location')}</p>
          </div>
        </div>
        <p className="text-xs text-warm-sand/70">{t('rights', { year })}</p>
      </div>
    </footer>
  );
}
