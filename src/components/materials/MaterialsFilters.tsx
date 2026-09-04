'use client';

import { RotateCcw, Search, X } from 'lucide-react';

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

/**
 * Institut bu yerda YO'Q.
 *
 * U endi chapdagi ro'yxatdan tanlanadi — bitta narsani ikki joydan
 * tanlash mumkin bo'lganda ular albatta bir-biriga zid tushib qoladi
 * (tanlagichda «TATU», ro'yxatda esa boshqa institut yoritilgan).
 */
export interface MaterialsFilterState {
  search: string;
  course: string;
  semester: string;
  category: string;
  sort: MaterialsSort;
}

export const DEFAULT_MATERIALS_FILTERS: MaterialsFilterState = {
  search: '',
  course: 'all',
  semester: 'all',
  category: 'all',
  sort: 'material',
};

const field =
  'h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Qidiruv qatori: fan yoki institut nomi, kurs, semestr va tartib.
 *
 * Hammasi BITTA qatorda va yig'ilmaydi. Ilgari tanlagichlar telefonda
 * tugma ortida turardi — institut tanlagichi ro'yxatga ko'chgach ular
 * uchtaga tushdi va ikki ustunda o'zi sig'adi, ya'ni yashirish endi
 * faqat qo'shimcha bosish bo'lib qolardi.
 */
export function MaterialsFilters({
  filters,
  courses,
  semesters,
  onChange,
  onReset,
}: {
  filters: MaterialsFilterState;
  courses: FilterOption[];
  /** Bo'sh bo'lsa semestr tanlagichi umuman chizilmaydi. */
  semesters: FilterOption[];
  onChange: (patch: Partial<MaterialsFilterState>) => void;
  onReset: () => void;
}) {
  const { m } = useT();

  const isDirty =
    filters.search !== '' ||
    filters.course !== 'all' ||
    filters.semester !== 'all' ||
    filters.category !== 'all' ||
    filters.sort !== DEFAULT_MATERIALS_FILTERS.sort;

  return (
    <section className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-3">
      <div className="relative min-w-0 lg:flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <label className="sr-only" htmlFor="materials-search">
          {m.filters.searchLabel}
        </label>
        <input
          id="materials-search"
          /*
            `type="text"`, `search` emas: brauzerning o'z tozalash xochi
            faqat ba'zilarida chiziladi va uslubga bo'ysunmaydi — qorong'i
            mavzuda u umuman ko'rinmasdi.
          */
          type="text"
          placeholder={m.filters.searchPlaceholder}
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className={cn(field, 'pl-10', filters.search && 'pr-10')}
        />
        {filters.search && (
          <button
            type="button"
            aria-label={m.filters.clearSearch}
            onClick={() => onChange({ search: '' })}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:shrink-0 lg:items-center">
        <Select
          aria-label={m.materials.courseLabel}
          value={filters.course}
          onChange={(course) => onChange({ course })}
          triggerClassName={cn(field, 'lg:w-40')}
          options={[{ value: 'all', label: m.materials.allCourses }, ...courses]}
        />

        {/* Semestr backendda ixtiyoriy — hech bir fanda ko'rsatilmagan
            bo'lsa tanlagich chizilmaydi, aks holda hech nimani
            o'zgartirmaydigan bo'sh ro'yxat qolardi. */}
        {semesters.length > 0 && (
          <Select
            aria-label={m.materials.semester}
            value={filters.semester}
            onChange={(semester) => onChange({ semester })}
            triggerClassName={cn(field, 'lg:w-44')}
            options={[{ value: 'all', label: m.materials.allSemesters }, ...semesters]}
          />
        )}

        {/* Saralash oxirida: u natijalarni toraytirmaydi, faqat
            institutlar tartibini o'zgartiradi. */}
        <Select
          aria-label={m.filters.sortLabel}
          value={filters.sort}
          onChange={(sort) => onChange({ sort: sort as MaterialsSort })}
          triggerClassName={cn(field, 'lg:w-44')}
          options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label(m) }))}
        />

        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <RotateCcw className="size-4" />
          {m.materials.clear}
        </button>
      </div>
    </section>
  );
}
