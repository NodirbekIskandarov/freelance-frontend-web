import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Hozircha statik yo'llar. Materiallar katalogi (universitet/fan sahifalari)
 * qurilgach, shu funksiya `getUniversities()`/`getSubjects()` server
 * data-layer'idan dinamik yo'llarni qo'shadi — sahifa componentlari
 * o'zgarmaydi, faqat shu ro'yxat kengayadi.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/materials`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/freelance`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteConfig.url}/freelance/apply`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/register`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return staticRoutes;
}
