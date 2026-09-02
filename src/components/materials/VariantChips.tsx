'use client';

import { useState } from 'react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

import {
  DOT,
  requestCountOf,
  statusOf,
  type VariantStatus,
  type VariantWithCount,
} from './variantStatus';

type ChipFilter = 'all' | 'available' | 'requested';

/**
 * Variantlar to'ri.
 *
 * Rang variant HOLATIDAN kelib chiqadi: yechim bor (yashil), kimdir
 * so'ragan (sariq), hech kim so'ramagan (kulrang). Ma'nosi yon ustundagi
 * izohli ro'yxatda yozilgan — bu yerda takrorlanmaydi, aks holda har
 * kartada bir xil uchta so'z turardi.
 *
 * Tanlangan variantning paneli ALOHIDA komponentda (`VariantPanel`) va
 * sahifaning uchinchi ustunida turadi. Shuning uchun tanlov holati
 * yuqorida — `SubjectTasks` da: ikkala komponent ham unga qaraydi.
 */
export function VariantChips({
  variants,
  selectedId,
  onSelect,
  requestedIds,
}: {
  variants: VariantWithCount[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Shu seansda so'rov yuborilgan variantlar — holat darhol yangilansin. */
  requestedIds: string[];
}) {
  const { t, m } = useT();
  const [filter, setFilter] = useState<ChipFilter>('all');

  const matches = (status: VariantStatus) =>
    filter === 'all' || (filter === 'available' ? status === 'available' : status === 'requested');

  const shown = variants.filter((variant) =>
    matches(statusOf(variant, requestedIds.includes(variant.id))),
  );

  const filters: { value: ChipFilter; label: string }[] = [
    { value: 'all', label: m.common.all },
    { value: 'available', label: m.variants.filterSolved },
    { value: 'requested', label: m.variants.filterDemand },
  ];

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          {m.variants.title}{' '}
          <span className="font-normal text-muted-foreground tabular-nums">{variants.length}</span>
        </h3>

        {/* Uchta holatning ikkitasi bo'yicha tez saralash. Ro'yxat
            filtrida ham shu ikkitasi bor, lekin u BUTUN topshiriqlarni
            saralaydi — bu yerdagisi bitta topshiriq ichidagi variantlarni. */}
        <div
          role="tablist"
          aria-label={m.variants.title}
          className="inline-flex gap-0.5 rounded-lg bg-muted/50 p-0.5"
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                filter === item.value
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
          {m.variants.noneMatch}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((variant) => {
            const justRequested = requestedIds.includes(variant.id);
            const status = statusOf(variant, justRequested);
            const active = variant.id === selectedId;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelect(variant.id)}
                aria-pressed={active}
                className={cn(
                  'rounded-xl border px-2.5 py-2.5 text-left transition-colors',
                  active
                    ? 'border-emerald-500/70 bg-emerald-500/[0.07]'
                    : 'border-border/70 bg-background/40 hover:border-emerald-500/40 hover:bg-muted/50',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  {/*
                    Raqam HAR DOIM ko'rinadi — bo'sh variantda ham.
                    Ilgari uning o'rniga qulf chizilardi va odam qaysi
                    variant ekanini bilmasdi: to'rda faqat «Tayyor emas»
                    yozuvlari qatorlashib turardi.
                  */}
                  <span className="text-base leading-none font-bold text-foreground tabular-nums">
                    {variant.number}
                  </span>
                  <span className={cn('size-2 shrink-0 rounded-full', DOT[status])} />
                </span>

                <span
                  className={cn(
                    'mt-1.5 block text-[10px] leading-tight sm:text-[11px]',
                    status === 'requested'
                      ? 'font-medium text-amber-700 dark:text-amber-300'
                      : 'text-muted-foreground',
                  )}
                >
                  {/* Talab qancha ekani muhim: bitta so'rov bilan
                      o'ntasi bir xil ko'rinmasin. */}
                  {status === 'available'
                    ? t((x) => x.variants.solutionCount, { count: variant.solutionCount })
                    : status === 'requested'
                      ? t((x) => x.variants.requestCount, {
                          count: requestCountOf(variant, justRequested),
                        })
                      : m.variants.notReady}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
