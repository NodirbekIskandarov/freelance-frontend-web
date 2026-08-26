'use client';

import { ClipboardList, RotateCcw, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Select } from '@/components/ui/Select';
import { SubjectRequestModal } from '@/features/requests/SubjectRequestModal';
import { cn } from '@/lib/cn';
import type { University } from '@/shared/types/catalogue';

import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import { SubjectMiniCard, type SubjectWithCount } from './UniversityRow';

const field =
  'h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

export function UniversitySubjects({
  university,
  slug,
  subjects,
}: {
  university: University;
  slug: string;
  subjects: SubjectWithCount[];
}) {
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [direction, setDirection] = useState('all');
  const [requestOpen, setRequestOpen] = useState(false);

  const courseOptions = useMemo(() => {
    const courses = new Set<number>();
    for (const subject of subjects) {
      if (subject.course) courses.add(subject.course);
    }
    return [...courses].sort((a, b) => a - b);
  }, [subjects]);

  const directionOptions = useMemo(() => {
    const names = new Set<string>();
    for (const subject of subjects) {
      if (subject.direction_name) names.add(subject.direction_name);
    }
    return [...names].sort((a, b) => a.localeCompare(b, 'uz'));
  }, [subjects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      if (query && !subject.name.toLowerCase().includes(query)) return false;
      if (course !== 'all' && String(subject.course ?? '') !== course) return false;
      if (direction !== 'all' && subject.direction_name !== direction) return false;
      return true;
    });
  }, [course, direction, search, subjects]);

  const hasActiveFilters = search.trim() !== '' || course !== 'all' || direction !== 'all';

  function resetFilters() {
    setSearch('');
    setCourse('all');
    setDirection('all');
  }

  return (
    <>
      <div className="mt-5 sm:mt-6">
        <CatalogueCtaBanner
          mode="subject-request"
          universityShortName={university.short_name || university.name}
          onAction={() => setRequestOpen(true)}
        />
      </div>

      <section className="mt-5 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <label className="sr-only" htmlFor="subject-search">
              Fan nomi
            </label>
            <input
              id="subject-search"
              type="search"
              placeholder="Fan nomini qidiring..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn(field, 'pl-10')}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Select
              aria-label="Kurs"
              value={course}
              onChange={setCourse}
              triggerClassName="h-10"
              options={[
                { value: 'all', label: 'Barcha kurslar' },
                ...courseOptions.map((item) => ({ value: String(item), label: `${item}-kurs` })),
              ]}
            />

            {/* Yo'nalish backendda ixtiyoriy — bo'lmasa tanlagich chizilmaydi. */}
            {directionOptions.length > 0 ? (
              <Select
                aria-label="Yo'nalish"
                value={direction}
                onChange={setDirection}
                triggerClassName="h-10"
                options={[
                  { value: 'all', label: "Barcha yo'nalishlar" },
                  ...directionOptions.map((item) => ({ value: item, label: item })),
                ]}
              />
            ) : null}
          </div>

          <div className="flex gap-2 sm:shrink-0">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:flex-none"
              >
                <RotateCcw className="size-4" />
                Tozalash
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className={cn(
                'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700',
                hasActiveFilters ? 'flex-1 sm:flex-none' : 'w-full sm:w-auto',
              )}
            >
              <ClipboardList className="size-4 shrink-0" />
              Ariza qoldirish
            </button>
          </div>
        </div>

        <p className="mt-4 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground">
          Ro&apos;yxatdan fan toping yoki yuqoridagi banner orqali ariza qoldiring.
        </p>
      </section>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Fan topilmadi</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {subjects.length === 0
                ? "Bu institutda hozircha fan yo'q — birinchi bo'lib ariza qoldiring."
                : "Filtrni o'zgartirib ko'ring yoki ariza qoldiring."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((subject) => (
              <SubjectMiniCard key={subject.id} subject={subject} universitySlug={slug} />
            ))}
          </div>
        )}
      </div>

      <SubjectRequestModal
        open={requestOpen}
        universityId={university.id}
        universityName={university.name}
        onClose={() => setRequestOpen(false)}
      />
    </>
  );
}
