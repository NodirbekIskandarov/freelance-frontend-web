'use client';

import { Building2, RotateCcw, Search } from 'lucide-react';

import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';

/**
 * Institutlar qanday tartibda chiqadi.
 *
 * Standart — `material`: sotuvdagi yechimlar, keyin topshiriqlar, keyin
 * fanlar bo'yicha kamayish tartibida. Alifbo tartibi foydalanuvchiga hech
 * nima aytmaydi; u qidirayotgan narsa — qayerda material bor.
 */
export const SORT_OPTIONS = [
  { value: 'material', label: (m: Messages) => m.filters.sortMaterial },
  { value: 'solutions', label: (m: Messages) => m.filters.sortSolutions },
  { value: 'assignments', label: (m: Messages) => m.filters.sortAssignments },
  { value: 'subjects', label: (m: Messages) => m.filters.sortSubjects },
  { value: 'name', label: (m: Messages) => m.filters.sortName },
] as const;

export type MaterialsSort = (typeof SORT_OPTIONS)[number]['value'];

export interface MaterialsFilterState {
  universityId: string;
  search: string;
  course: string;
  direction: string;
  sort: MaterialsSort;
}

export const DEFAULT_MATERIALS_FILTERS: MaterialsFilterState = {
  universityId: 'all',
  search: '',
  course: 'all',
  direction: 'all',
  sort: 'material',
};

const field =
  'h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

export interface FilterOption {
  value: string;
  label: string;
}

export function MaterialsFilters({
  filters,
  universities,
  courses,
  directions,
  onChange,
  onReset,
}: {
  filters: MaterialsFilterState;
  universities: FilterOption[];
  courses: FilterOption[];
  /** Bo'sh bo'lsa yo'nalish tanlagichi umuman chizilmaydi. */
  directions: FilterOption[];
  onChange: (patch: Partial<MaterialsFilterState>) => void;
  onReset: () => void;
}) {
  const { m } = useT();
  const isDirty =
    filters.universityId !== 'all' ||
    filters.search !== '' ||
    filters.course !== 'all' ||
    filters.direction !== 'all' ||
    filters.sort !== DEFAULT_MATERIALS_FILTERS.sort;

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <Building2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-400">
              {m.filters.title}
            </p>
            <p className="text-sm text-muted-foreground">{m.filters.lead}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-500/35 bg-background px-3 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-500/10 disabled:opacity-40 dark:text-emerald-300"
        >
          <RotateCcw className="size-3.5" />
          Tozalash
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr_0.8fr_0.8fr_1fr] lg:items-center">
        {/*
          Institutlar ro'yxati uzun (21 ta va o'sib boradi), shuning uchun
          uning ichida qidiruv bor — aylantirib topishdan ko'ra yozib
          topish tezroq.
        */}
        <Select
          aria-label="Institut"
          value={filters.universityId}
          onChange={(universityId) => onChange({ universityId })}
          triggerClassName={field}
          searchable
          searchPlaceholder="Institut nomi..."
          options={[{ value: 'all', label: m.filters.pickInstitute }, ...universities]}
        />

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <label className="sr-only" htmlFor="materials-search">
            Fan nomi
          </label>
          <input
            id="materials-search"
            type="search"
            placeholder={m.filters.subjectSearch}
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            className={cn(field, 'pl-10')}
          />
        </div>

        <Select
          aria-label="Kurs"
          value={filters.course}
          onChange={(course) => onChange({ course })}
          triggerClassName={field}
          options={[{ value: 'all', label: m.materials.allCourses }, ...courses]}
        />

        {/* Yo'nalish backendda ixtiyoriy — bo'sh bo'lsa tanlagich chizilmaydi. */}
        {directions.length > 0 && (
          <Select
            aria-label={m.materials.direction}
            value={filters.direction}
            onChange={(direction) => onChange({ direction })}
            triggerClassName={field}
            searchable={directions.length > 8}
            searchPlaceholder={m.materials.directionPlaceholder}
            options={[{ value: 'all', label: m.materials.allDirections }, ...directions]}
          />
        )}

        {/* Saralash oxirida: u natijalarni toraytirmaydi, faqat tartibini
            o'zgartiradi — filtrlardan keyin turgani mantiqan to'g'ri. */}
        <Select
          aria-label="Saralash"
          value={filters.sort}
          onChange={(sort) => onChange({ sort: sort as MaterialsSort })}
          triggerClassName={field}
          options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label(m) }))}
        />
      </div>
    </section>
  );
}
