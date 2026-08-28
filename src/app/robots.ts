import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { LOCALES } from '@/i18n/config';

/** Shaxsiy bo'limlar — indekslanmasligi kerak. */
const PRIVATE_PATHS = [
  '/student/',
  '/freelancer/',
  '/freelance/exchange',
  '/wallet',
  '/saved',
  '/appeals',
];

/**
 * Eski ilovada bu fayl umuman yo'q edi — qidiruv botlari `/student`,
 * `/freelancer` kabi shaxsiy kabinet yo'llarini ham indekslashi mumkin
 * bo'lgan. Bu yerda ular ochiq taqiqlanadi.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /*
         * Yo'llar til bo'lagi bilan yoziladi: manzillar endi
         * `/uz/student/…` ko'rinishida va tilsiz naqsh ularning
         * hech biriga to'g'ri kelmasdi.
         */
        disallow: [
          // `/api/` til bo'lagisiz — u sahifa emas.
          '/api/',
          ...LOCALES.flatMap((locale) => PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
