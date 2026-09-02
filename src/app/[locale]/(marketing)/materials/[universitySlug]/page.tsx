import { notFound } from 'next/navigation';

import { UniversityLogo } from '@/components/materials/CatalogueCards';
import { UniversitySubjects } from '@/components/materials/UniversitySubjects';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { toSlugId } from '@/lib/slug';
import {
  getAllCataloguePaths,
  getSubjectsByUniversity,
  getUniversityBySlug,
  universitySlug as slugOf,
} from '@/server/catalogue';

/**
 * Barcha universitet sahifalari build vaqtida oldindan chiziladi.
 * Bu bot uchun ham, foydalanuvchi uchun ham eng tez variant — sahifa
 * statik HTML sifatida CDN'dan keladi.
 */
export async function generateStaticParams() {
  const { universities } = await getAllCataloguePaths();
  return universities;
}

export async function generateMetadata(props: PageProps<'/[locale]/materials/[universitySlug]'>) {
  const { locale: raw, universitySlug } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const seo = (await getMessages(locale)).seo;
  const university = await getUniversityBySlug(universitySlug);

  if (!university) {
    return buildMetadata({
      title: seo.universityNotFound.title,
      description: seo.universityNotFound.description,
      path: `/materials/${universitySlug}`,
      locale,
      noIndex: true,
    });
  }

  const subjects = await getSubjectsByUniversity(university.id);

  return buildMetadata({
    title: interpolate(seo.university.title, {
      name: university.short_name,
      count: subjects.length,
    }),
    description: interpolate(seo.university.description, {
      fullName: university.name,
      count: subjects.length,
    }),
    path: `/materials/${universitySlug}`,
    locale,
  });
}

export default async function UniversityPage(
  props: PageProps<'/[locale]/materials/[universitySlug]'>,
) {
  const { locale: raw, universitySlug } = await props.params;
  setRequestLocale(isLocale(raw) ? raw : DEFAULT_LOCALE);

  const m = (await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE)).materials;
  const university = await getUniversityBySlug(universitySlug);

  if (!university) notFound();

  const subjects = await getSubjectsByUniversity(university.id);
  const uniSlug = slugOf(university);

  // Topshiriqlar soni — kartadagi rozetka uchun. Backend uni fan
  // javobining o'zida beradi, shuning uchun qo'shimcha so'rov yo'q.
  const withCounts = subjects.map((subject) => ({
    ...subject,
    slug: toSlugId(subject.name, subject.id),
    assignmentCount: subject.assignment_count ?? 0,
  }));

  const crumbs = [
    { name: m.breadcrumbHome, path: '/' },
    { name: m.breadcrumbMaterials, path: '/materials' },
    { name: university.short_name, path: `/materials/${uniSlug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: interpolate(m.subjectsOf, { name: university.short_name }),
    numberOfItems: withCounts.length,
    itemListElement: withCounts.map((subject, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: subject.name,
        provider: { '@type': 'CollegeOrUniversity', name: university.name },
        url: `/materials/${uniSlug}/${subject.slug}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd} />

      <Container className="py-6 sm:py-10">
        <Breadcrumbs items={crumbs} />

        <header className="mt-5 flex flex-wrap items-start gap-4">
          <UniversityLogo university={university} />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              {university.short_name || university.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{university.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {interpolate(m.subjectCount, { count: withCounts.length })}
              </span>
              {university.city && (
                <span className="text-xs text-muted-foreground">{university.city}</span>
              )}
            </div>
          </div>
        </header>

        <UniversitySubjects university={university} slug={uniSlug} subjects={withCounts} />
      </Container>
    </>
  );
}
