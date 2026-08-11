import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

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
        disallow: [
          '/student/',
          '/freelancer/',
          '/freelance/exchange',
          '/api/',
          '/wallet',
          '/saved',
          '/appeals',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
