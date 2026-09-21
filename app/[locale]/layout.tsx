import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../globals.css';

// Brand fonts per the Ignio brand manual: "Reigo Black" (display) and "Satoshi" (body).
// Neither is available on Google Fonts.
// TODO: Satoshi is licensed separately and needs self-hosted WOFF2 files added under
// public/fonts/ (and wired up via next/font/local) before it can replace this fallback.
// Reigo Black is not loaded at all — the "Ignio" wordmark must use the logo image assets
// in public/brand/ rather than being rendered as live text in an unavailable font.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ignio Hub',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={jakarta.variable}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
