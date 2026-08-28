import { MaterialsBrowser } from '@/components/materials/MaterialsBrowser';
import { MaterialsPromo } from '@/components/materials/MaterialsPromo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getCatalogueTree } from '@/server/catalogue';

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
          <MaterialsPromo />
        </div>

        <header className="mt-8 max-w-2xl sm:mt-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {m.heading}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
            {interpolate(m.lead, { institutes: groups.length, subjects: totalSubjects })}
          </p>
        </header>

        <div className="mt-8 sm:mt-10">
          <MaterialsBrowser groups={groups} />
        </div>
      </Container>
    </>
  );
}
