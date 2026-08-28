import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS, localizeHref, type Locale } from '@/i18n/config';

/** Nisbiy yo'lni saytning to'liq manziliga aylantiradi. */
export function absoluteUrl(path = ''): string {
  return `${siteConfig.url.replace(/\/$/, '')}${path}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /**
   * TILSIZ nisbiy yo'l, masalan `/materials/tatu`.
   *
   * Til bo'lagini bu yerda YOZMANG — u `locale` dan qo'shiladi va
   * hreflang variantlari ham shundan hisoblanadi.
   */
  path: string;
  /** Sahifa qaysi tilda chizilmoqda. Berilmasa sayt asosiy tili. */
  locale?: Locale;
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
  locale = DEFAULT_LOCALE,
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localizeHref(path, locale));
  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/og-image.png');

  /*
   * hreflang — bir sahifaning tillar bo'yicha variantlari.
   *
   * Usiz Google `/uz/materials` va `/ru/materials` ni IKKI ALOHIDA
   * sahifa deb qabul qiladi va ularni bir-biriga raqobatchi sifatida
   * ko'radi. Bu ro'yxat ularni bitta sahifaning tarjimalari deb
   * bog'laydi.
   */
  const languages = Object.fromEntries(
    LOCALES.map((item) => [LOCALE_TAGS[item], absoluteUrl(localizeHref(path, item))]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        // Til aniqlanmagan bot uchun — asosiy til.
        'x-default': absoluteUrl(localizeHref(path, DEFAULT_LOCALE)),
      },
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: LOCALE_TAGS[locale].replace('-', '_'),
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
