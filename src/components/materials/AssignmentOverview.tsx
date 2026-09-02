'use client';

import { useT } from '@/i18n/useT';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { assignmentTypeLabel } from '@/shared/types/assignmentTypes';
import type { PublicSolution } from '@/shared/types/catalogue';

import { AssignmentFile } from './AssignmentFile';
import type { VariantWithCount } from './variantStatus';

/**
 * Tanlangan topshiriqning bosh kartasi: nomi, turi va uchta sanoq.
 *
 * Sanoqlar variantlardan hisoblanadi, backenddan alohida so'ralmaydi:
 * butun daraxt sahifa bilan birga allaqachon kelgan.
 *
 * MAKETDAGI «Muallif» YO'Q: `Assignment` da bunday maydon yo'q (backend
 * topshiriqni kim qo'shganini ochiq katalogda qaytarmaydi) va uni chizish
 * o'ylab topish bo'lardi.
 */
export function AssignmentOverview({
  title,
  type,
  description,
  file,
  createdAt,
  course,
  variants,
  solutionsByVariant,
}: {
  title: string;
  type: string;
  description: string;
  file: string;
  createdAt: string;
  course: number | null;
  variants: VariantWithCount[];
  solutionsByVariant: Record<string, PublicSolution[]>;
}) {
  const { t, m } = useT();
  const dates = useDates();
  const money = useMoney();

  const solved = variants.filter((variant) => variant.solutionCount > 0).length;
  const demanded = variants.filter((variant) => variant.request_count > 0).length;

  const prices = variants
    .flatMap((variant) => solutionsByVariant[variant.id] ?? [])
    .map((solution) => Number(solution.price))
    .filter((price) => Number.isFinite(price));
  const cheapest = prices.length > 0 ? Math.min(...prices) : null;

  const tiles = [
    { value: `${solved} / ${variants.length}`, label: m.assignmentStats.solvedTile },
    { value: String(demanded), label: m.assignmentStats.demandTile },
    ...(cheapest === null
      ? []
      : [{ value: money.som(cheapest), label: m.assignmentStats.cheapestTile }]),
  ];

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-emerald-500/12 px-2 py-1 text-[10px] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          {assignmentTypeLabel(type, m.assignmentTypes)}
        </span>
        {variants.length > 0 && (
          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
            {t((x) => x.tasks.variantCount, { count: variants.length })}
          </span>
        )}
      </div>

      <h2 className="mt-2.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {title}
      </h2>

      <p className="mt-1 text-xs text-muted-foreground">
        {course ? `${t((x) => x.materials.course, { course })} · ` : ''}
        {t((x) => x.variants.addedOn, { date: dates.date(createdAt) })}
      </p>

      {description && (
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {description}
        </p>
      )}

      {/* Variantsiz topshiriqda sanoqlar chizilmaydi: «0 / 0 variantda
          yechim bor» hech nima aytmaydi. */}
      {variants.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-xl border border-border/60 bg-muted/25 p-3">
              <p className="text-base leading-tight font-bold text-foreground tabular-nums sm:text-lg">
                {tile.value}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Shart VARIANTLARDAN OLDIN: qaysi variantni tanlashni aynan shu
          fayl hal qiladi. */}
      <AssignmentFile url={file} />
    </section>
  );
}
