import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { LOCALES, LOCALE_TAGS, localizeHref, type Locale } from '@/i18n/config';
import { setRequestLocale } from '@/i18n/requestLocale';
import { getAllCataloguePaths } from '@/server/catalogue';

/**
 * Katalog yo'llari bir joydan (`getAllCataloguePaths`) keladi — sitemap
 * ham, `generateStaticParams` ham. Yangi universitet qo'shilganda
 * ikkalasi birdan yangilanadi, biri esdan chiqib qolmaydi.
 *
 * Har yo'l HAR TIL uchun alohida yozuv bo'lib chiqadi va `alternates`
 * orqali bir-biriga bog'lanadi. Faqat bitta tilni ko'rsatish ikkinchisini
 * qidiruv tizimidan yashirardi.
 */
function entry(
  path: string,
  locale: Locale,
  options: Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'>,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.url}${localizeHref(path, locale)}`,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((item) => [LOCALE_TAGS[item], `${siteConfig.url}${localizeHref(path, item)}`]),
      ),
    },
    ...options,
  };
}

const STATIC_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/materials', changeFrequency: 'daily', priority: 0.9 },
  { path: '/freelance', changeFrequency: 'daily', priority: 0.8 },
  { path: '/freelance/apply', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/legal', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/login', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/register', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    /*
     * Slug'lar nomdan yasaladi, nom esa tarjima qilinadi — ya'ni har til
     * uchun yo'llar ALOHIDA olinishi kerak. Bitta tilning slug'larini
     * ikkalasiga ishlatish rus sahifalari uchun mavjud bo'lmagan
     * manzillarni ro'yxatga yozib qo'yardi.
     */
    setRequestLocale(locale);
    const { subjects, assignments } = await getAllCataloguePaths();

    for (const item of STATIC_PATHS) {
      routes.push(
        entry(item.path, locale, {
          changeFrequency: item.changeFrequency,
          priority: item.priority,
        }),
      );
    }

    /*
     * Institut sahifalari SITEMAPDA YO'Q — ular olib tashlandi.
     * Katalogdan to'g'ridan-to'g'ri fanga o'tiladi, ya'ni indekslanadigan
     * sahifalar `/materials` va fan sahifalari.
     */

    for (const item of subjects) {
      routes.push(
        entry(`/materials/${item.universitySlug}/${item.subjectSlug}`, locale, {
          changeFrequency: 'weekly',
          priority: 0.7,
        }),
      );
    }

    for (const item of assignments) {
      routes.push(
        entry(
          `/materials/${item.universitySlug}/${item.subjectSlug}/${item.assignmentSlug}`,
          locale,
          { changeFrequency: 'weekly', priority: 0.6 },
        ),
      );
    }
  }

  return routes;
}
