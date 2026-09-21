import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const assessmentHref = `/${locale}/assessment`;

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/evaluation`, label: t('evaluation') },
    { href: `/${locale}/capabilities`, label: t('capabilities') },
    { href: `/${locale}/organizations`, label: t('organisations') },
    { href: `/${locale}/methodology`, label: t('methodology') },
    { href: `/${locale}/about`, label: t('about') },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-charcoal-slate/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex shrink-0 items-center">
          <Image
            src="/brand/logo-full.png"
            alt={t('logoAlt')}
            width={663}
            height={310}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:gap-6 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-charcoal-slate transition hover:text-ignio-purple"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={assessmentHref}
            className="rounded-full bg-ignio-purple px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('startAssessment')}
          </Link>
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-3 xl:hidden">
          <LanguageSwitcher />
          <MobileNav
            links={links}
            assessmentHref={assessmentHref}
            assessmentLabel={t('startAssessment')}
            toggleLabel={t('toggleMenu')}
          />
        </div>
      </div>
    </header>
  );
}
