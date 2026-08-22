import { MaterialsBrowser } from '@/components/materials/MaterialsBrowser';
import { MaterialsPromo } from '@/components/materials/MaterialsPromo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getCatalogueTree } from '@/server/catalogue';

export const metadata = buildMetadata({
  title: 'Tayyor materiallar — universitetlar bo‘yicha topshiriqlar',
  description:
    "O'zbekiston universitetlari bo'yicha tayyor topshiriqlar, mustaqil va laboratoriya ishlari. Fan va kurs bo'yicha qidiring, darhol yuklab oling.",
  path: '/materials',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Tayyor materiallar', path: '/materials' },
];

export default async function MaterialsPage() {
  const groups = await getCatalogueTree();

  const totalSubjects = groups.reduce((sum, group) => sum + group.subjects.length, 0);

  /*
   * ItemList — botga katalogning to'liq ro'yxati. Sahifada fanlar
   * filtrlanadi va institut qatorida faqat to'rttasi ko'rinadi, qidiruv
   * tizimi esa tugma bosmaydi.
   */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Yopamiz.uz tayyor materiallari',
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
          <MaterialsPromo />
        </div>

        <header className="mt-8 max-w-2xl sm:mt-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Tayyor materiallar
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
            {groups.length} ta institut va {totalSubjects} ta fan. Kerakli institut, fan va
            topshiriqni tanlang va tayyor yechimlarni oling.
          </p>
        </header>

        <div className="mt-8 sm:mt-10">
          <MaterialsBrowser groups={groups} />
        </div>
      </Container>
    </>
  );
}
