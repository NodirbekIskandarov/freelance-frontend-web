import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { toSlugId } from '@/lib/slug';
import {
  getAllCataloguePaths,
  getAssignmentsBySubject,
  getSubjectBySlugId,
  getUniversityBySlug,
} from '@/server/catalogue';

export async function generateStaticParams() {
  const { subjects } = await getAllCataloguePaths();
  return subjects;
}

async function loadSubject(universitySlug: string, subjectSlug: string) {
  const university = await getUniversityBySlug(universitySlug);
  if (!university) return null;

  const subject = await getSubjectBySlugId(university.id, subjectSlug);
  if (!subject) return null;

  return { university, subject };
}

export async function generateMetadata(
  props: PageProps<'/materials/[universitySlug]/[subjectSlug]'>,
) {
  const { universitySlug, subjectSlug } = await props.params;
  const data = await loadSubject(universitySlug, subjectSlug);

  if (!data) {
    return buildMetadata({
      title: 'Fan topilmadi',
      description: "So'ralgan fan katalogda mavjud emas.",
      path: `/materials/${universitySlug}/${subjectSlug}`,
      noIndex: true,
    });
  }

  const { university, subject } = data;
  const assignments = await getAssignmentsBySubject(subject.id);

  const course = subject.course === null ? '' : ` ${subject.course}-kurs.`;

  return buildMetadata({
    title: `${subject.name} — ${university.short_name} topshiriqlari`,
    description: `${university.short_name} ${subject.name} fani bo'yicha ${assignments.length} ta tayyor topshiriq: mustaqil ish, amaliy ish va laboratoriya ishlari.${course}`,
    path: `/materials/${universitySlug}/${subjectSlug}`,
  });
}

export default async function SubjectPage(
  props: PageProps<'/materials/[universitySlug]/[subjectSlug]'>,
) {
  const { universitySlug, subjectSlug } = await props.params;
  const data = await loadSubject(universitySlug, subjectSlug);

  if (!data) notFound();

  const { university, subject } = data;
  const assignments = await getAssignmentsBySubject(subject.id);

  const crumbs = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
    { name: university.short_name, path: `/materials/${universitySlug}` },
    { name: subject.name, path: `/materials/${universitySlug}/${subjectSlug}` },
  ];

  /**
   * `ItemList` — Google topshiriqlar ro'yxatini tuzilgan ma'lumot sifatida
   * o'qiydi, bu qidiruv natijasida boyroq ko'rinish beradi.
   */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${university.short_name} — ${subject.name} topshiriqlari`,
    numberOfItems: assignments.length,
    itemListElement: assignments.map((assignment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: assignment.title,
      url: absoluteUrl(
        `/materials/${universitySlug}/${subjectSlug}/${toSlugId(assignment.title, assignment.id)}`,
      ),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {subject.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {university.name}
            {subject.course !== null && <> &middot; {subject.course}-kurs</>}
            {subject.direction_name && <> &middot; {subject.direction_name}</>} &middot;{' '}
            {assignments.length} ta topshiriq
          </p>
        </header>

        {assignments.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Bu fan uchun topshiriqlar hozircha qo&apos;shilmagan.
          </p>
        ) : (
          <div className="mt-8 grid gap-3">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/materials/${universitySlug}/${subjectSlug}/${toSlugId(assignment.title, assignment.id)}`}
                className="group flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-emerald-500/40 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-bold text-foreground">{assignment.title}</h2>
                  {assignment.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {assignment.description}
                    </p>
                  )}
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2 dark:text-emerald-400">
                  Variantlar
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
