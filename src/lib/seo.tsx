import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

/** Nisbiy yo'lni saytning to'liq manziliga aylantiradi. */
export function absoluteUrl(path = ''): string {
  return `${siteConfig.url.replace(/\/$/, '')}${path}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Nisbiy yo'l, masalan `/materials/tatu`. Kanonik URL va OG uchun. */
  path: string;
  /** Ijtimoiy tarmoqda ko'rinadigan rasm. Berilmasa standart OG rasm ishlatiladi. */
  image?: string;
  /** Autentifikatsiyadan keyingi shaxsiy sahifalar uchun `true`. */
  noIndex?: boolean;
}

/**
 * Har bir sahifa uchun `generateMetadata`ni qisqartiradi.
 *
 * Kanonik URL, Open Graph va Twitter Card'ni har safar qo'lda yozish
 * o'rniga — bitta chaqiruv. Xato qilib `canonical`ni unutib qo'yish yoki
 * OG rasmni faqat bitta tarmoq uchun sozlash kabi holatlar shu yerda
 * oldindan yopiladi.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/og-image.png');

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** `application/ld+json` skriptini chiqaradi — Google Rich Results uchun. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify — foydalanuvchi kiritmaydigan, kod ichida
      // shakllangan ma'lumot, shuning uchun XSS xavfi yo'q.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Har sahifada takrorlanadigan "Bosh sahifa > ... " ko'rinishi uchun JSON-LD. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
