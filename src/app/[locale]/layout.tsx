import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { siteConfig } from '@/config/site';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { DEFAULT_LOCALE, isLocale, LOCALES, LOCALE_TAGS, type Locale } from '@/i18n/config';
import { absoluteUrl, JsonLd } from '@/lib/seo';

import { ThemeSync } from './ThemeSync';

import { StoreProvider } from '../providers';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl('/og-image.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

/**
 * Tungi rejimni sahifa chizilishidan OLDIN qo'llaydi.
 *
 * React `.dark` klassini o'zi qo'ysa, foydalanuvchi bir lahza yorug' fonni
 * ko'rib, keyin qorong'iga o'tadi (FOUC). Shu skript `<head>` chizilgach
 * darhol ishlaydi — eski ilovadagi bilan bir xil: soat bo'yicha avtomatik
 * (20:00–08:00 qorong'i) yoki foydalanuvchi tanlovi (localStorage).
 *
 * `__applyTheme` tashqariga chiqariladi: til almashganda React `<html>`
 * atributlarini server qiymatiga qaytaradi va `dark` klassi o'chib
 * ketadi, bu skript esa qayta ishga tushmaydi (`window` o'sha-o'sha).
 * Uni qayta chaqirish `ThemeSync` ning ishi.
 */
const themeInitScript = `(function(){
  var KEY="theme-mode",root=document.documentElement;
  function isNightByHour(){var h=new Date().getHours();return h>=20||h<8}
  function apply(mode){
    var resolved=mode==="auto"?(isNightByHour()?"dark":"light"):mode;
    root.classList.toggle("dark",resolved==="dark");
    root.dataset.themeMode=mode;
  }
  function current(){return localStorage.getItem(KEY)||"auto"}
  apply(current());
  setInterval(function(){if(current()==="auto")apply("auto")},60000);
  window.__setThemeMode=function(next){localStorage.setItem(KEY,next);apply(next)};
  window.__getThemeMode=current;
  window.__applyTheme=function(){apply(current())};
})();`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: absoluteUrl('/logo.png'),
  description: siteConfig.description,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactType: 'customer support',
    areaServed: 'UZ',
    availableLanguage: ['uz', 'ru'],
  },
  sameAs: [siteConfig.social.telegram],
};

/**
 * Ikkala til ham build paytida chiziladi.
 *
 * Usiz `/ru/...` birinchi so'rovda serverda hisoblanardi va katalog
 * sahifalari uchun bu ISR ning butun ma'nosini yo'qqa chiqarardi.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);
  const messages = await getMessages(locale);

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={organizationJsonLd} />
        <ThemeSync />
        <I18nProvider locale={locale} messages={messages}>
          <StoreProvider>{children}</StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
