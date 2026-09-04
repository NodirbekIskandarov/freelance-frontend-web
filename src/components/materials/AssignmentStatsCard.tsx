'use client';

import { useT } from '@/i18n/useT';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import type { PublicSolution } from '@/shared/types/catalogue';

import type { VariantWithCount } from './variantStatus';

/**
 * «Shu topshiriq bo'yicha» — o'ng ustundagi sanoqlar kartasi.
 *
 * Hammasi chop etilgan yechimlardan hisoblanadi. MAKETDAGI «Ko'rishlar
 * (30 kun)» YO'Q: backend sahifa ko'rishlarini umuman sanamaydi va
 * o'ylab topilgan raqam eng yomon turdagi yolg'on bo'lardi — ishonarli
 * ko'rinadigan.
 *
 * Yechimi yo'q topshiriqda karta umuman chizilmaydi: uchta nol qatori
 * hech nima aytmaydi.
 */
export function AssignmentStatsCard({
  variants,
  solutionsByVariant,
}: {
  variants: VariantWithCount[];
  solutionsByVariant: Record<string, PublicSolution[]>;
}) {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();

  const solutions = variants.flatMap((variant) => solutionsByVariant[variant.id] ?? []);
  if (solutions.length === 0) return null;

  const sold = solutions.reduce((sum, solution) => sum + solution.sold_count, 0);

  const prices = solutions
    .map((solution) => Number(solution.price))
    .filter((price) => Number.isFinite(price));
  const average =
    prices.length > 0 ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : null;

  const latest = solutions
    .map((solution) => solution.created_at)
    .sort()
    .at(-1);

  const rows = [
    { label: m.assignmentStats.publishedSolutions, value: String(solutions.length) },
    { label: m.assignmentStats.soldSolutions, value: String(sold) },
    ...(average === null
      ? []
      : [{ label: m.assignmentStats.averagePrice, value: money.som(average) }]),
    ...(latest ? [{ label: m.assignmentStats.lastUpload, value: dates.date(latest) }] : []),
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-sm font-bold text-foreground">{t((x) => x.assignmentStats.title)}</h3>

      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-xs font-semibold text-foreground tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
