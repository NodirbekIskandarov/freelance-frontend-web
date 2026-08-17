import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
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

  const subjects = await getSubjectsByUniversity(university.id);

  return buildMetadata({
    title: `${university.short_name} topshiriqlari — ${subjects.length} ta fan`,
    description: `${university.name} uchun tayyor topshiriqlar: ${subjects.length} ta fan bo'yicha mustaqil, amaliy va laboratoriya ishlari.`,
    path: `/materials/${universitySlug}`,
  });
}

export default async function UniversityPage(props: PageProps<'/materials/[universitySlug]'>) {
  const { universitySlug } = await props.params;
  const university = await getUniversityBySlug(universitySlug);

  if (!university) notFound();

  const subjects = await getSubjectsByUniversity(university.id);
  const uniSlug = slugOf(university);

  const crumbs = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
    { name: university.short_name, path: `/materials/${uniSlug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 flex flex-wrap items-start gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-sm">
            {university.short_name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {university.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {university.short_name}
              {university.city && <> &middot; {university.city}</>} &middot; {subjects.length} ta
              fan
            </p>
          </div>
        </header>

        {subjects.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Bu universitet uchun fanlar hozircha qo&apos;shilmagan.
          </p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/materials/${uniSlug}/${toSlugId(subject.name, subject.id)}`}
                className="group flex flex-col rounded-xl border border-border/60 bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <h2 className="text-[15px] font-bold text-foreground">{subject.name}</h2>

                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  {subject.course !== null && <span>{subject.course}-kurs</span>}
                  {subject.direction_name && (
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="size-3.5" />
                      {subject.direction_name}
                    </span>
                  )}
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2 dark:text-emerald-400">
                  Ochish
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
