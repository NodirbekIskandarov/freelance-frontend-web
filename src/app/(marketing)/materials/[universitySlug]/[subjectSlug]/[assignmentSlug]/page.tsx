import { notFound } from 'next/navigation';

import { SubjectTasks, type TaskNode } from '@/components/materials/SubjectTasks';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
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
import { assignmentTypeLabel } from '@/shared/types/assignmentTypes';
import type { PublicSolution } from '@/shared/types/catalogue';

type Params = PageProps<'/materials/[universitySlug]/[subjectSlug]/[assignmentSlug]'>;

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

  return { university, subject, assignment };
}

export async function generateMetadata(props: Params) {
  const { universitySlug, subjectSlug, assignmentSlug } = await props.params;
  const data = await loadAssignment(universitySlug, subjectSlug, assignmentSlug);

  if (!data) {
    return buildMetadata({
      title: 'Topshiriq topilmadi',
      description: "So'ralgan topshiriq katalogda mavjud emas.",
      path: `/materials/${universitySlug}/${subjectSlug}/${assignmentSlug}`,
      noIndex: true,
    });
  }

  const { university, subject, assignment } = data;

  return buildMetadata({
    title: `${assignment.title} — ${subject.name}`,
    description:
      assignment.description ||
      `${university.name}, ${subject.name} fani bo'yicha "${assignment.title}" topshirig'i uchun tayyor yechimlar.`,
    path: `/materials/${universitySlug}/${subjectSlug}/${assignmentSlug}`,
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
  const { universitySlug, subjectSlug, assignmentSlug } = await props.params;
  const data = await loadAssignment(universitySlug, subjectSlug, assignmentSlug);

  if (!data) notFound();

  const { university, subject, assignment } = data;
  const tree = await getAssignmentTree(subject.id);

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
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
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
            {university.short_name} · {subject.name} · {assignmentTypeLabel(assignment.type)}
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
