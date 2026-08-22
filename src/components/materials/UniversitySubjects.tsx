'use client';

import { ClipboardList, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

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

  return (
    <>
      <div className="mt-5 sm:mt-6">
        <CatalogueCtaBanner
          mode="subject-request"
          universityShortName={university.short_name || university.name}
          onAction={() => setRequestOpen(true)}
        />
      </div>

      <section className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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

          <label className="block">
            <span className="sr-only">Kurs</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className={field}
            >
              <option value="all">Barcha kurslar</option>
              {courseOptions.map((item) => (
                <option key={item} value={String(item)}>
                  {item}-kurs
                </option>
              ))}
            </select>
          </label>

          {/* Yo'nalish backendda ixtiyoriy — bo'lmasa tanlagich chizilmaydi. */}
          {directionOptions.length > 0 ? (
            <label className="block">
              <span className="sr-only">Yo&apos;nalish</span>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value)}
                className={field}
              >
                <option value="all">Barcha yo&apos;nalishlar</option>
                {directionOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="hidden lg:block" />
          )}

          <button
            type="button"
            onClick={() => setRequestOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-background px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            <ClipboardList className="size-4" />
            Ariza qoldirish
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
