'use client';

import { useT } from '@/i18n/useT';
import { formatCount } from '@/lib/format';
import type { CatalogueStats } from '@/shared/types/catalogue';

/**
 * Sahifa boshidagi to'rtta sanoq.
 *
 * Ular katalogning holatini bir qarashda aytadi: qancha material bor,
 * qanchasi sotuvda, qanchasi hali javobsiz va oxirgi oyda qancha xarid
 * bo'ldi. Uchinchisi ayni paytda TAKLIF ham — yechim yozadigan odam
 * aynan shu raqamni qidiradi.
 *
 * Nol qiymatlar ham chiziladi: kartani yashirish ro'yxatni har safar
 * boshqa uzunlikda ko'rsatardi va «nol» ham javob.
 */
export function CatalogueStatsRow({ stats }: { stats: CatalogueStats }) {
  const { t, m } = useT();

  const cards = [
    {
      value: stats.subjects,
      label: `${m.materials.statSubjects} · ${t((x) => x.materials.statSubjectsIn, {
        count: formatCount(stats.universities),
      })}`,
    },
    { value: stats.solutions, label: m.materials.statSolutions },
    { value: stats.awaiting_variants, label: m.materials.statAwaiting },
    { value: stats.downloads_this_month, label: m.materials.statDownloads },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border/70 bg-card px-3.5 py-3 sm:px-4 sm:py-3.5"
        >
          {/* Chapdagi yashil chiziq — kartani sanoq sifatida o'qitadi va
              to'rttasini bitta blok bo'lib ko'rinishga bog'laydi. */}
          <div className="border-l-2 border-emerald-500 pl-3">
            <p className="text-xl font-bold tracking-tight text-foreground tabular-nums sm:text-2xl">
              {formatCount(card.value)}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
