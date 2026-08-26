import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import { gradientFor, initialsOf, SubjectIcon } from '@/lib/catalogueVisuals';
import type { Subject, University } from '@/shared/types/catalogue';

/** Qatorda ko'rinadigan fan soni — qolgani institut sahifasida. */
const VISIBLE_SUBJECTS = 4;

export interface SubjectWithCount extends Subject {
  /** Fandagi topshiriqlar soni — kartadagi rozetka. */
  assignmentCount: number;
  /** Manzil segmenti (`nom-qisqaID`). */
  slug: string;
}

export function UniversityLogo({
  university,
  className,
}: {
  university: Pick<University, 'id' | 'short_name' | 'name'>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-base font-bold text-white shadow-sm ring-4 ring-card',
        gradientFor(university.id),
        className,
      )}
    >
      {initialsOf(university.short_name || university.name)}
    </div>
  );
}

export function SubjectMiniCard({
  subject,
  universitySlug,
  className,
}: {
  subject: SubjectWithCount;
  universitySlug: string;
  className?: string;
}) {
  return (
    <Link
      href={`/materials/${universitySlug}/${subject.slug}`}
      className={cn(
        'group flex h-full min-h-[152px] min-w-0 flex-col rounded-xl border border-border/80 bg-card p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-colors hover:border-emerald-500/45 hover:bg-emerald-500/[0.04] sm:p-4 dark:border-zinc-700/80 dark:bg-zinc-900 dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/10 transition-colors group-hover:bg-emerald-500/15 dark:text-emerald-400">
          <SubjectIcon name={subject.name} className="size-[18px]" />
        </span>
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums dark:bg-zinc-800">
          {subject.assignmentCount}
        </span>
      </div>

      <h3 className="mt-2.5 line-clamp-2 flex-1 text-[13px] leading-snug font-semibold text-foreground sm:text-sm">
        {subject.name}
      </h3>

      <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
        <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
          {subject.course ? `${subject.course}-kurs` : 'Kurs ko‘rsatilmagan'}
          {subject.direction_name ? ` · ${subject.direction_name}` : ''}
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 transition-all group-hover:gap-1.5 sm:text-xs dark:text-emerald-400">
          Ko&apos;rish
          <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Bitta institut va uning fanlari — materiallar sahifasidagi asosiy qator.
 *
 * Chapda institut kartasi, o'ngda birinchi to'rtta fan. Qolganlari
 * o'ngdagi strelka orqali institut sahifasida ochiladi.
 */
export function UniversityRow({
  university,
  subjects,
  slug,
}: {
  university: University;
  subjects: SubjectWithCount[];
  slug: string;
}) {
  const visible = subjects.slice(0, VISIBLE_SUBJECTS);
  const hasMore = subjects.length > VISIBLE_SUBJECTS;
  const href = `/materials/${slug}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="border-b border-border/60 bg-muted/20 p-5 sm:p-6 lg:w-[220px] lg:shrink-0 lg:border-r lg:border-b-0 xl:w-[232px]">
          <UniversityLogo university={university} />

          <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground">
            {university.short_name || university.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {university.name}
          </p>

          <span className="mt-3 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {subjects.length} ta fan
          </span>

          <Link
            href={href}
            className="mt-4 flex h-9 w-full items-center justify-center rounded-lg border border-emerald-500/30 bg-background text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/5 dark:text-emerald-300"
          >
            Barcha fanlar
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-stretch gap-2.5 p-4 sm:gap-3 sm:p-5">
          {visible.length === 0 ? (
            <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
              Hozircha fanlar mavjud emas.
            </p>
          ) : (
            <>
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                {visible.map((subject) => (
                  <SubjectMiniCard key={subject.id} subject={subject} universitySlug={slug} />
                ))}
              </div>

              {hasMore && (
                <Link
                  href={href}
                  aria-label={`${university.short_name} — barcha fanlar`}
                  className="grid size-9 shrink-0 place-items-center self-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-300"
                >
                  <ChevronRight className="size-5" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
