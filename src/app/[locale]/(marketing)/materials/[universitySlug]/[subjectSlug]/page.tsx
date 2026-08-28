import { notFound } from 'next/navigation';

import { SubjectTasks, type TaskNode } from '@/components/materials/SubjectTasks';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { toSlugId } from '@/lib/slug';
import {
  getAllCataloguePaths,
  getAssignmentTree,
  getSolutionsByVariant,
  getSubjectBySlugId,
  getUniversityBySlug,
} from '@/server/catalogue';
import type { PublicSolution } from '@/shared/types/catalogue';
import { assignmentTypeLabel, isVisibleAssignmentType } from '@/shared/types/assignmentTypes';

export async function generateStaticParams() {
  const { subjects } = await getAllCataloguePaths();
  return subjects;
}

/**
 * Saytda ko'rsatiladigan topshiriqlar.
 *
 * Backend `course_work` va `other` turlarini ham qaytaradi, dizaynda esa
 * uchta bo'lim bor. Filtrlash SERVER tomonda: shunda sarlavhadagi son,
 * metadata va JSON-LD ro'yxati ekranda ko'rinadigan narsa bilan bir xil
 * bo'ladi. Mijoz tomonda filtrlansa, «1 ta topshiriq» yozuvi ostida bo'sh
 * ro'yxat qolib ketardi.
 */
async function visibleAssignments(subjectId: string) {
  const tree = await getAssignmentTree(subjectId);
  return tree.filter((node) => isVisibleAssignmentType(node.assignment.type));
}

async function loadSubject(universitySlug: string, subjectSlug: string) {
  const university = await getUniversityBySlug(universitySlug);
  if (!university) return null;

  const subject = await getSubjectBySlugId(university.id, subjectSlug);
  if (!subject) return null;

  return { university, subject };
}

export async function generateMetadata(
  props: PageProps<'/[locale]/materials/[universitySlug]/[subjectSlug]'>,
) {
  const { locale: raw, universitySlug, subjectSlug } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const seo = (await getMessages(locale)).seo;
  const data = await loadSubject(universitySlug, subjectSlug);

  if (!data) {
    return buildMetadata({
      title: seo.subjectNotFound.title,
      description: seo.subjectNotFound.description,
      path: `/materials/${universitySlug}/${subjectSlug}`,
      locale,
      noIndex: true,
    });
  }

  const { university, subject } = data;
  const tasks = await visibleAssignments(subject.id);

  const course =
    subject.course === null ? '' : interpolate(seo.courseSuffix, { course: subject.course });

  return buildMetadata({
    title: interpolate(seo.subjectTitle, {
      subject: subject.name,
      university: university.short_name,
    }),
    description: interpolate(seo.subjectDescription, {
      university: university.name,
      subject: subject.name,
      course,
      count: tasks.length,
    }),
    path: `/materials/${universitySlug}/${subjectSlug}`,
    locale,
  });
}

export default async function SubjectPage(
  props: PageProps<'/[locale]/materials/[universitySlug]/[subjectSlug]'>,
) {
  const { locale: raw, universitySlug, subjectSlug } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const messages = await getMessages(locale);
  const m = messages.materials;
  const data = await loadSubject(universitySlug, subjectSlug);

  if (!data) notFound();

  const { university, subject } = data;
  const tree = await visibleAssignments(subject.id);

  /*
   * Yechimlar variant bo'yicha oldindan yig'iladi: mijoz panelida ular
   * darhol ko'rinishi kerak, sahifa esa ISR bilan statik — narx faqat
   * qayta chizishda to'lanadi.
   */
  const variantIds = tree.flatMap((node) =>
    node.variants.filter((variant) => variant.solutionCount > 0).map((variant) => variant.id),
  );

  const solutionEntries = await Promise.all(
    variantIds.map(async (id) => [id, await getSolutionsByVariant(id)] as const),
  );
  const solutionsByVariant: Record<string, PublicSolution[]> = Object.fromEntries(solutionEntries);

  const tasks: TaskNode[] = tree.map((node) => ({
    id: node.assignment.id,
    slug: node.slug,
    title: node.assignment.title,
    type: node.assignment.type,
    description: node.assignment.description,
    file: node.assignment.file ?? '',
    createdAt: node.assignment.created_at,
    variants: node.variants,
  }));

  const uniSlug = universitySlug;
  const subjSlug = toSlugId(subject.name, subject.id);

  const crumbs = [
    { name: m.breadcrumbHome, path: '/' },
    { name: m.breadcrumbMaterials, path: '/materials' },
    { name: university.short_name, path: `/materials/${uniSlug}` },
    { name: subject.name, path: `/materials/${uniSlug}/${subjSlug}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: interpolate(m.assignmentsOf, { name: subject.name }),
    numberOfItems: tasks.length,
    itemListElement: tasks.map((task, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: task.title,
        genre: assignmentTypeLabel(task.type, messages.assignmentTypes),
        url: absoluteUrl(`/materials/${uniSlug}/${subjSlug}/${task.slug}`),
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd} />

      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={crumbs} />

        <header className="mt-5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {subject.name}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {university.short_name}
            {subject.course ? ` · ${interpolate(m.course, { course: subject.course })}` : ''} ·{' '}
            {interpolate(m.taskCount, { count: tasks.length })}
          </p>
        </header>

        <SubjectTasks
          subject={subject}
          universitySlug={uniSlug}
          universityShortName={university.short_name || university.name}
          tasks={tasks}
          solutionsByVariant={solutionsByVariant}
        />
      </Container>
    </>
  );
}
