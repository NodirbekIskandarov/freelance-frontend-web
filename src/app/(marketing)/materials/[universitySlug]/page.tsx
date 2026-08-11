import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import {
  getAllCatalogPaths,
  getSubjectsByUniversity,
  getUniversityBySlug,
} from '@/server/materials/catalog';

/**
 * Barcha universitet sahifalari build vaqtida oldindan chiziladi.
 * Bu bot uchun ham, foydalanuvchi uchun ham eng tez variant — sahifa
 * statik HTML sifatida CDN'dan keladi.
 */
export async function generateStaticParams() {
  const { universities } = await getAllCatalogPaths();
  return universities.map((item) => ({ universitySlug: item.slug }));
}

export async function generateMetadata(props: PageProps<'/materials/[universitySlug]'>) {
  const { universitySlug } = await props.params;
  const university = await getUniversityBySlug(universitySlug);

  if (!university) {
    return buildMetadata({
      title: 'Universitet topilmadi',
      description: 'So‘ralgan universitet katalogda mavjud emas.',
      path: `/materials/${universitySlug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${university.shortName} topshiriqlari — ${university.subjectCount} ta fan`,
    description: `${university.fullName} uchun tayyor topshiriqlar: ${university.subjectCount} ta fan, ${university.taskCount} dan ortiq mustaqil, amaliy va laboratoriya ishlari.`,
    path: `/materials/${university.slug}`,
  });
}

export default async function UniversityPage(props: PageProps<'/materials/[universitySlug]'>) {
  const { universitySlug } = await props.params;
  const university = await getUniversityBySlug(universitySlug);

  if (!university) notFound();

  const subjects = await getSubjectsByUniversity(university.id);

  const crumbs = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
    { name: university.shortName, path: `/materials/${university.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 flex flex-wrap items-start gap-4">
          <div
            className={cn(
              'grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-sm',
              university.logoGradient,
            )}
          >
            {university.logoInitials}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {university.fullName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {university.shortName} &middot; {university.region} &middot; {subjects.length} ta fan
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/materials/${university.slug}/${subject.slug}`}
              className="group flex flex-col rounded-xl border border-border/60 bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <h2 className="text-[15px] font-bold text-foreground">{subject.name}</h2>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {subject.course}-kurs &middot; {subject.semester}-semestr &middot;{' '}
                {subject.taskCount} topshiriq
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2 dark:text-emerald-400">
                Ochish
                <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
