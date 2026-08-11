import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { siteConfig } from '@/config/site';
import { absoluteUrl, JsonLd } from '@/lib/seo';

import { StoreProvider } from './providers';
import './globals.css';

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
 */
const themeInitScript = `(function(){
  var KEY="theme-mode",root=document.documentElement;
  function isNightByHour(){var h=new Date().getHours();return h>=20||h<8}
  function apply(mode){
    var resolved=mode==="auto"?(isNightByHour()?"dark":"light"):mode;
    root.classList.toggle("dark",resolved==="dark");
    root.dataset.themeMode=mode;
  }
  var mode=localStorage.getItem(KEY)||"auto";
  apply(mode);
  setInterval(function(){if((localStorage.getItem(KEY)||"auto")==="auto")apply("auto")},60000);
  window.__setThemeMode=function(next){localStorage.setItem(KEY,next);apply(next)};
  window.__getThemeMode=function(){return localStorage.getItem(KEY)||"auto"};
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- boshlang'ich renderdan oldin ishlashi shart */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={organizationJsonLd} />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
