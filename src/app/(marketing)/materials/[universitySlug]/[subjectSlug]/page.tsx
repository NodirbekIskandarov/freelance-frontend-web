import { CircleCheck, CircleDashed, Layers } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { TASK_TYPE_LABELS } from '@/shared/types/materials';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import {
  getAllCatalogPaths,
  getSubjectBySlug,
  getTasksBySubject,
  getUniversityBySlug,
} from '@/server/materials/catalog';

export async function generateStaticParams() {
  const { subjects } = await getAllCatalogPaths();
  return subjects.map((item) => ({
    universitySlug: item.universitySlug,
    subjectSlug: item.subjectSlug,
  }));
}

async function loadSubject(universitySlug: string, subjectSlug: string) {
  const university = await getUniversityBySlug(universitySlug);
  if (!university) return null;

  const subject = await getSubjectBySlug(university.id, subjectSlug);
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

  return buildMetadata({
    title: `${subject.name} — ${university.shortName} topshiriqlari`,
    description: `${university.shortName} ${subject.name} fani bo'yicha ${subject.taskCount} ta tayyor topshiriq: mustaqil ish, amaliy ish va laboratoriya ishlari. ${subject.course}-kurs, ${subject.semester}-semestr.`,
    path: `/materials/${university.slug}/${subject.slug}`,
  });
}

export default async function SubjectPage(
  props: PageProps<'/materials/[universitySlug]/[subjectSlug]'>,
) {
  const { universitySlug, subjectSlug } = await props.params;
  const data = await loadSubject(universitySlug, subjectSlug);

  if (!data) notFound();

  const { university, subject } = data;
  const tasks = await getTasksBySubject(subject.id);

  const crumbs = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
    { name: university.shortName, path: `/materials/${university.slug}` },
    { name: subject.name, path: `/materials/${university.slug}/${subject.slug}` },
  ];

  /**
   * `ItemList` — Google topshiriqlar ro'yxatini tuzilgan ma'lumot sifatida
   * o'qiydi, bu qidiruv natijasida boyroq ko'rinish beradi.
   */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${university.shortName} — ${subject.name} topshiriqlari`,
    numberOfItems: tasks.length,
    itemListElement: tasks.map((task, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: task.title,
      url: absoluteUrl(`/materials/${university.slug}/${subject.slug}#${task.slug}`),
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
            {university.fullName} &middot; {subject.course}-kurs &middot; {subject.semester}-semestr
            &middot; {tasks.length} ta topshiriq
          </p>
        </header>

        <div className="mt-8 grid gap-3">
          {tasks.map((task) => (
            <article
              key={task.id}
              id={task.slug}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-emerald-500/40 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold text-foreground">{task.title}</h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    {TASK_TYPE_LABELS[task.taskType]}
                  </span>

                  {task.hasVariants ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CircleCheck className="size-3.5 text-emerald-500" />
                      {task.variantCount} ta variant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <CircleDashed className="size-3.5" />
                      Variantsiz
                    </span>
                  )}

                  {task.status === 'partial' && (
                    <span className="rounded-full bg-amber-500/12 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                      Qisman to&apos;ldirilgan
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Narxi</div>
                  <div className="text-sm font-bold text-foreground">
                    {task.priceFrom.toLocaleString('ru-RU').replace(/ /g, ' ')} so&apos;m
                  </div>
                </div>

                <ButtonLink href="/login" variant="emerald" size="sm">
                  Ochish
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
