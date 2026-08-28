'use client';

import { BookOpen, ClipboardList, Landmark, Layers, ArrowRight, CircleCheck } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { Container } from '@/components/ui/Container';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { toSlug, toSlugId } from '@/lib/slug';
import type { LandingHighlights as Highlights } from '@/server/landing/highlights';

/** 1250 → "1 250". Bo'sh joy uzilmas emas — nusxalanganda toza qolsin. */
function formatCount(value: number): string {
  return value.toLocaleString('ru-RU').replace(/ /g, ' ');
}

const STAT_ITEMS = [
  { key: 'universities', label: (m: Messages) => m.home.statInstitutes, icon: Landmark },
  { key: 'subjects', label: (m: Messages) => m.home.statSubjects, icon: BookOpen },
  { key: 'assignments', label: (m: Messages) => m.home.statAssignments, icon: ClipboardList },
  { key: 'variants', label: (m: Messages) => m.home.statVariants, icon: Layers },
  { key: 'solutions', label: (m: Messages) => m.home.statSolutions, icon: CircleCheck },
] as const;

/**
 * Server Component — raqamlar botga ham ko'rinishi kerak.
 *
 * Katalog bo'sh bo'lsa bo'lim BUTUNLAY ko'rsatilmaydi: nollar bilan
 * to'la jadval saytni tirik emas, tashlab ketilgandek ko'rsatadi.
 */
export function LandingHighlights({ highlights }: { highlights: Highlights }) {
  const { t, m } = useT();
  const { stats, universities, subjects } = highlights;

  if (stats.universities === 0 && stats.subjects === 0) return null;

  return (
    <section className="border-t border-border/60 bg-muted/30 py-14 sm:py-16">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {m.home.catalogueNow}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          {m.home.catalogueLead}
        </p>

        <dl className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_ITEMS.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-border/60 bg-background p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <item.icon className="mx-auto size-5 text-emerald-600 dark:text-emerald-400" />
              <dd className="mt-2 text-xl font-bold text-foreground tabular-nums">
                {formatCount(stats[item.key])}
              </dd>
              <dt className="mt-0.5 text-xs text-muted-foreground">{item.label(m)}</dt>
            </div>
          ))}
        </dl>

        {universities.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-foreground">{m.home.popularInstitutes}</h3>
              <Link
                href="/materials"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {m.home.all}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {universities.map((university) => (
                <li key={university.id}>
                  <Link
                    href={`/materials/${toSlug(university.short_name || university.name)}`}
                    className="flex h-full flex-col rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-emerald-500/40 dark:border-zinc-800 dark:bg-zinc-900/70"
                  >
                    <span className="text-sm font-bold text-foreground">
                      {university.short_name || university.name}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {university.name}
                      {university.city ? ` · ${university.city}` : ''}
                    </span>
                    <span className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
                      {t((x) => x.home.subjectsAndSolutions, {
                        subjects: formatCount(university.subject_count),
                        solutions: formatCount(university.solution_count),
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {subjects.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-foreground">{m.home.subjectsSoldMost}</h3>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <li key={subject.id}>
                  <Link
                    href={`/materials/${toSlug(
                      subject.university_short_name || subject.university_name,
                    )}/${toSlugId(subject.name, subject.id)}`}
                    className="flex h-full flex-col rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-emerald-500/40 dark:border-zinc-800 dark:bg-zinc-900/70"
                  >
                    <span className="text-sm font-bold text-foreground">{subject.name}</span>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {subject.university_short_name || subject.university_name}
                      {subject.course
                        ? ` · ${t((x) => x.materials.course, { course: subject.course })}`
                        : ''}
                    </span>
                    <span className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
                      {t((x) => x.home.solutionsAndSales, {
                        solutions: formatCount(subject.solution_count),
                        sales: formatCount(subject.sale_count),
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
