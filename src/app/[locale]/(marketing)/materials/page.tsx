import { CatalogueStatsRow } from '@/components/materials/CatalogueStatsRow';
import { MaterialsBrowser } from '@/components/materials/MaterialsBrowser';
import { MaterialsPromo } from '@/components/materials/MaterialsPromo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getCatalogueStats, getCatalogueTree } from '@/server/catalogue';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = (await getMessages(locale)).seo.materials;

  return buildMetadata({ title: m.title, description: m.description, path: '/materials', locale });
}

export default async function MaterialsPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  /* Ma'lumot olishdan OLDIN: katalog so'rovi shu tilga qarab
     `Accept-Language` qo'yadi. */
  setRequestLocale(locale);

  const m = (await getMessages(locale)).materials;
  const crumbs = [
    { name: m.breadcrumbHome, path: '/' },
    { name: m.breadcrumbMaterials, path: '/materials' },
  ];

  /* Ikkalasi PARALLEL: sanoqlar katalogdan hisoblanmaydi (ular xarid va
     talab kabi katalogda umuman yo'q narsalarni ham qamraydi), ya'ni
     ketma-ket kutishning sababi yo'q. */
  const [groups, stats] = await Promise.all([getCatalogueTree(), getCatalogueStats()]);

  /*
   * ItemList — botga katalogning to'liq ro'yxati. Sahifada bir vaqtning
   * o'zida bitta institut ochiq turadi, qidiruv tizimi esa tugma
   * bosmaydi.
   */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: m.itemListName,
    numberOfItems: groups.length,
    itemListElement: groups.map((group, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CollegeOrUniversity',
        name: group.university.name,
        alternateName: group.university.short_name,
        address: group.university.city,
        url: `/materials/${group.slug}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd} />

      <Container className="py-6 sm:py-10 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-5 sm:mt-6">
          <MaterialsPromo awaitingVariants={stats.awaiting_variants} />
        </div>

        <div className="mt-4 sm:mt-5">
          <CatalogueStatsRow stats={stats} />
        </div>

        <div className="mt-8 sm:mt-10">
          <MaterialsBrowser groups={groups} stats={stats} />
        </div>
      </Container>
    </>
  );
}
