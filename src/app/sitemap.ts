import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getAllCatalogPaths } from '@/server/materials/catalog';

/**
 * Katalog yo'llari bir joydan (`getAllCatalogPaths`) keladi — sitemap ham,
 * `generateStaticParams` ham. Yangi universitet qo'shilganda ikkalasi
 * birdan yangilanadi, biri esdan chiqib qolmaydi.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { universities, subjects } = await getAllCatalogPaths();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/materials`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/freelance`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteConfig.url}/freelance/apply`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/register`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const universityRoutes: MetadataRoute.Sitemap = universities.map((item) => ({
    url: `${siteConfig.url}/materials/${item.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((item) => ({
    url: `${siteConfig.url}/materials/${item.universitySlug}/${item.subjectSlug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...universityRoutes, ...subjectRoutes];
}
