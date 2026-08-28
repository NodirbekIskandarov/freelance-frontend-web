import { notFound } from 'next/navigation';

import { SubjectTasks, type TaskNode } from '@/components/materials/SubjectTasks';
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
  getAssignmentBySlugId,
  getAssignmentTree,
  getSolutionsByVariant,
  getSubjectBySlugId,
  getUniversityBySlug,
} from '@/server/catalogue';
import { assignmentTypeLabel, isVisibleAssignmentType } from '@/shared/types/assignmentTypes';
import type { PublicSolution } from '@/shared/types/catalogue';

type Params = PageProps<'/[locale]/materials/[universitySlug]/[subjectSlug]/[assignmentSlug]'>;

export async function generateStaticParams() {
  const { assignments } = await getAllCataloguePaths();
  return assignments;
}

async function loadAssignment(universitySlug: string, subjectSlug: string, assignmentSlug: string) {
  const university = await getUniversityBySlug(universitySlug);
  if (!university) return null;

  const subject = await getSubjectBySlugId(university.id, subjectSlug);
  if (!subject) return null;

  const assignment = await getAssignmentBySlugId(subject.id, assignmentSlug);
  if (!assignment) return null;

  /*
   * Saytda ko'rsatilmaydigan tur (`course_work`, `other`) — 404.
   *
   * Fan sahifasi bunday topshiriqni ro'yxatdan chiqarib tashlaydi;
   * shu yerda ochilishiga ruxsat berilsa, sahifa sarlavhani chizib,
   * ostidagi ro'yxatni bo'sh qoldirardi.
   */
  if (!isVisibleAssignmentType(assignment.type)) return null;

  return { university, subject, assignment };
}

export async function generateMetadata(props: Params) {
  const { locale: raw, universitySlug, subjectSlug, assignmentSlug } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const seo = (await getMessages(locale)).seo;
  const data = await loadAssignment(universitySlug, subjectSlug, assignmentSlug);

  if (!data) {
    return buildMetadata({
      title: seo.assignmentNotFound.title,
      description: seo.assignmentNotFound.description,
      path: `/materials/${universitySlug}/${subjectSlug}/${assignmentSlug}`,
      locale,
      noIndex: true,
    });
  }

  const { university, subject, assignment } = data;

  return buildMetadata({
    title: interpolate(seo.assignmentTitle, {
      title: assignment.title,
      subject: subject.name,
    }),
    description:
      assignment.description ||
      interpolate(seo.assignmentDescription, {
        university: university.name,
        subject: subject.name,
        title: assignment.title,
      }),
    path: `/materials/${universitySlug}/${subjectSlug}/${assignmentSlug}`,
    locale,
  });
}

/**
 * Topshiriqning o'z manzili.
 *
 * Fan sahifasi bilan BIR XIL brauzerni chizadi, faqat kerakli topshiriq
 * oldindan tanlangan holda. Alohida ko'rinish yasash o'rniga shunday
 * qilindi: manzil qidiruv tizimi uchun saqlanadi, foydalanuvchi esa
 * o'sha yerda qolgan topshiriqlarga ham o'ta oladi.
 */
export default async function AssignmentPage(props: Params) {
  const { locale: raw, universitySlug, subjectSlug, assignmentSlug } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const messages = await getMessages(locale);
  const m = messages.materials;
  const data = await loadAssignment(universitySlug, subjectSlug, assignmentSlug);

  if (!data) notFound();

  const { university, subject, assignment } = data;
  const tree = (await getAssignmentTree(subject.id)).filter((node) =>
    isVisibleAssignmentType(node.assignment.type),
  );

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
    variants: node.variants,
  }));

  const subjSlug = toSlugId(subject.name, subject.id);

  const crumbs = [
    { name: m.breadcrumbHome, path: '/' },
    { name: m.breadcrumbMaterials, path: '/materials' },
    { name: university.short_name, path: `/materials/${universitySlug}` },
    { name: subject.name, path: `/materials/${universitySlug}/${subjSlug}` },
    {
      name: assignment.title,
      path: `/materials/${universitySlug}/${subjSlug}/${assignmentSlug}`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={crumbs} />

        <header className="mt-5">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {assignment.title}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {university.short_name} · {subject.name} ·{' '}
            {assignmentTypeLabel(assignment.type, messages.assignmentTypes)}
          </p>
        </header>

        <SubjectTasks
          subject={subject}
          universitySlug={universitySlug}
          universityShortName={university.short_name || university.name}
          tasks={tasks}
          solutionsByVariant={solutionsByVariant}
          initialTaskId={assignment.id}
        />
      </Container>
    </>
  );
}
