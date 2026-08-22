'use client';

import { SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/cn';
import { DirectionIcon } from '@/lib/catalogueVisuals';

import {
  DEFAULT_MATERIALS_FILTERS,
  MaterialsFilters,
  type MaterialsFilterState,
} from './MaterialsFilters';
import { UniversityRow, type SubjectWithCount } from './UniversityRow';
import type { University } from '@/shared/types/catalogue';

export interface CatalogueGroup {
  university: University;
  slug: string;
  subjects: SubjectWithCount[];
}

/**
 * Filtrlash MIJOZDA bajariladi.
 *
 * Katalog Server Component'da to'liq olinadi (bot to'ldirilgan HTML
 * ko'rishi uchun), shuning uchun har filtr o'zgarishida serverga qaytish
 * shart emas — bu darhol javob beradi va so'rovlarni tejaydi. Katalog
 * o'sib ketsa bu yerni server-side qidiruvga ko'chirish kerak bo'ladi.
 */
export function MaterialsBrowser({ groups }: { groups: CatalogueGroup[] }) {
  const [filters, setFilters] = useState<MaterialsFilterState>(DEFAULT_MATERIALS_FILTERS);

  const universityOptions = useMemo(
    () =>
      groups.map((group) => ({
        value: group.university.id,
        label: group.university.short_name || group.university.name,
      })),
    [groups],
  );

  const courseOptions = useMemo(() => {
    const courses = new Set<number>();
    for (const group of groups) {
      for (const subject of group.subjects) {
        if (subject.course) courses.add(subject.course);
      }
    }

    return [...courses]
      .sort((a, b) => a - b)
      .map((course) => ({
        value: String(course),
        label: `${course}-kurs`,
      }));
  }, [groups]);

  const directionOptions = useMemo(() => {
    const names = new Set<string>();
    for (const group of groups) {
      for (const subject of group.subjects) {
        if (subject.direction_name) names.add(subject.direction_name);
      }
    }

    return [...names]
      .sort((a, b) => a.localeCompare(b, 'uz'))
      .map((name) => ({ value: name, label: name }));
  }, [groups]);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return (
      groups
        .filter(
          (group) => filters.universityId === 'all' || group.university.id === filters.universityId,
        )
        .map((group) => ({
          ...group,
          subjects: group.subjects.filter((subject) => {
            if (search && !subject.name.toLowerCase().includes(search)) return false;
            if (filters.course !== 'all' && String(subject.course ?? '') !== filters.course) {
              return false;
            }
            if (filters.direction !== 'all' && subject.direction_name !== filters.direction) {
              return false;
            }
            return true;
          }),
        }))
        /*
         * Qidiruv yoki yo'nalish tanlanganda fansiz institut ko'rsatilmaydi:
         * "hech narsa topilmadi" degan bo'sh kartalar ro'yxati foydasiz.
         * Filtrsiz holatda esa institut ko'rinib turishi kerak — u haqiqatan
         * ham bo'sh bo'lishi mumkin.
         */
        .filter((group) => {
          const narrowed = search !== '' || filters.course !== 'all' || filters.direction !== 'all';
          return !narrowed || group.subjects.length > 0;
        })
    );
  }, [filters, groups]);

  const chips = useMemo(
    () => [{ value: 'all', label: 'Barchasi' }, ...directionOptions],
    [directionOptions],
  );

  return (
    <>
      <MaterialsFilters
        filters={filters}
        universities={universityOptions}
        courses={courseOptions}
        directions={directionOptions}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
        onReset={() => setFilters(DEFAULT_MATERIALS_FILTERS)}
      />

      {/* Yo'nalish chiplari — backend yo'nalish bermasa umuman chizilmaydi. */}
      {directionOptions.length > 0 && (
        <div className="mt-4 [scrollbar-width:none] overflow-x-auto pb-1 [-ms-overflow-style:none] sm:mt-5 [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {chips.map((chip) => {
              const active = filters.direction === chip.value;

              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setFilters((current) => ({ ...current, direction: chip.value }))}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <DirectionIcon name={chip.value === 'all' ? '' : chip.label} className="size-4" />
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Hech narsa topilmadi</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Filtrni o&apos;zgartirib ko&apos;ring yoki kerakli fan bo&apos;lmasa institut
              sahifasidan ariza qoldiring.
            </p>
          </div>
        ) : (
          filtered.map((group) => (
            <UniversityRow
              key={group.university.id}
              university={group.university}
              subjects={group.subjects}
              slug={group.slug}
            />
          ))
        )}
      </div>
    </>
  );
}
