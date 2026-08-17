import { Star, Users } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { formatSom } from '@/lib/format';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { toSlugId } from '@/lib/slug';
import type { PublicSolution, Variant } from '@/shared/types/catalogue';
import {
  getAllCataloguePaths,
  getAssignmentBySlugId,
  getSolutionsByVariant,
  getSubjectBySlugId,
  getUniversityBySlug,
  getVariantsByAssignment,
} from '@/server/catalogue';

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
      `${university.short_name} ${subject.name} fani bo'yicha "${assignment.title}" topshirig'i: variantlar va tayyor yechimlar.`,
    path: `/materials/${universitySlug}/${subjectSlug}/${assignmentSlug}`,
  });
}

function SolutionRow({ solution }: { solution: PublicSolution }) {
  const rating = Number(solution.average_rating);

  return (
    <article className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold text-foreground">{solution.title}</h4>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{solution.uploader.full_name}</span>

          {solution.review_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">
                {Number.isNaN(rating) ? solution.average_rating : rating.toFixed(1)}
              </span>
              ({solution.review_count})
            </span>
          )}

          {solution.sold_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {solution.sold_count} marta sotilgan
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Narxi</div>
          <div className="text-sm font-bold text-foreground">
            {formatSom(Number(solution.price))}
          </div>
        </div>

        {/* Fayl faqat sotib olingandan keyin beriladi — shuning uchun kirish. */}
        <ButtonLink href="/login" variant="emerald" size="sm">
          Sotib olish
        </ButtonLink>
      </div>
    </article>
  );
}

function VariantBlock({ variant, solutions }: { variant: Variant; solutions: PublicSolution[] }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-muted/20 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-foreground">{variant.label}</h3>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {solutions.length} ta yechim
        </span>
      </div>

      {solutions.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Bu variant uchun hali yechim e&apos;lon qilinmagan.
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {solutions.map((solution) => (
            <SolutionRow key={solution.id} solution={solution} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AssignmentPage(props: Params) {
  const { universitySlug, subjectSlug, assignmentSlug } = await props.params;
  const data = await loadAssignment(universitySlug, subjectSlug, assignmentSlug);

  if (!data) notFound();

  const { university, subject, assignment } = data;

  const variants = await getVariantsByAssignment(assignment.id);

  // Har variant uchun yechimlar — variantlar kam, parallel yetarli.
  const solutionsByVariant = await Promise.all(
    variants.map((variant) => getSolutionsByVariant(variant.id)),
  );

  const totalSolutions = solutionsByVariant.reduce((sum, list) => sum + list.length, 0);

  const crumbs = [
    { name: 'Bosh sahifa', path: '/' },
    { name: 'Tayyor materiallar', path: '/materials' },
    { name: university.short_name, path: `/materials/${universitySlug}` },
    { name: subject.name, path: `/materials/${universitySlug}/${subjectSlug}` },
    {
      name: assignment.title,
      path: `/materials/${universitySlug}/${subjectSlug}/${toSlugId(assignment.title, assignment.id)}`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {assignment.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {university.short_name} &middot; {subject.name} &middot; {variants.length} ta variant
            &middot; {totalSolutions} ta yechim
          </p>

          {assignment.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {assignment.description}
            </p>
          )}
        </header>

        {variants.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Bu topshiriq uchun variantlar hozircha qo&apos;shilmagan.
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {variants.map((variant, index) => (
              <VariantBlock
                key={variant.id}
                variant={variant}
                solutions={solutionsByVariant[index] ?? []}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
