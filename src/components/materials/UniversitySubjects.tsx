'use client';

import { RotateCcw, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { SubjectRequestModal } from '@/features/requests/SubjectRequestModal';
import { cn } from '@/lib/cn';
import type { University } from '@/shared/types/catalogue';

import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import { SubjectMiniCard, type SubjectWithCount } from './UniversityRow';

const field =
  'h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

/**
 * Bir sahifadagi fanlar soni.
 *
 * 12 ataylab: to'r 2, 3 va 4 ustunga bo'linadi (`sm`, `lg`, `xl`), 12 esa
 * uchalasiga ham qoldiqsiz bo'linadi — oxirgi qator hech qachon yarim
 * bo'sh qolmaydi.
 */
const PAGE_SIZE = 12;

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
  const [semester, setSemester] = useState('all');
  const [direction, setDirection] = useState('all');
  const [page, setPage] = useState(1);
  const [requestOpen, setRequestOpen] = useState(false);

  const courseOptions = useMemo(() => {
    const courses = new Set<number>();
    for (const subject of subjects) {
      if (subject.course) courses.add(subject.course);
    }
    return [...courses].sort((a, b) => a - b);
  }, [subjects]);

  /*
   * Semestr backend javobida HOZIRCHA yo'q — ro'yxat bo'sh chiqadi va
   * tanlagich chizilmaydi. Maydon qo'shilishi bilan filtr o'zi paydo
   * bo'ladi. Yo'nalish tanlagichi ham xuddi shu qoida bo'yicha ishlaydi.
   */
  const semesterOptions = useMemo(() => {
    const semesters = new Set<number>();
    for (const subject of subjects) {
      if (subject.semester) semesters.add(subject.semester);
    }
    return [...semesters].sort((a, b) => a - b);
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
      if (semester !== 'all' && String(subject.semester ?? '') !== semester) return false;
      if (direction !== 'all' && subject.direction_name !== direction) return false;
      return true;
    });
  }, [course, direction, search, semester, subjects]);

  const hasActiveFilters =
    search.trim() !== '' || course !== 'all' || semester !== 'all' || direction !== 'all';

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  /*
   * Joriy sahifa oxirgisidan oshib ketishi mumkin: filtr toraysa,
   * 5-sahifada turgan foydalanuvchi uchun ro'yxat bo'sh ko'rinardi.
   * Effekt bilan tuzatilsa bir kadr davomida bo'sh to'r chizilardi,
   * shuning uchun render paytida chegaralanadi.
   */
  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /** Filtr o'zgarsa doim birinchi sahifadan boshlanadi. */
  function applyFilter(change: () => void) {
    change();
    setPage(1);
  }

  function resetFilters() {
    setSearch('');
    setCourse('all');
    setSemester('all');
    setDirection('all');
    setPage(1);
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
              onChange={(event) => applyFilter(() => setSearch(event.target.value))}
              className={cn(field, 'pl-10')}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Select
              aria-label="Kurs"
              value={course}
              onChange={(value) => applyFilter(() => setCourse(value))}
              triggerClassName="h-10"
              options={[
                { value: 'all', label: 'Barcha kurslar' },
                ...courseOptions.map((item) => ({ value: String(item), label: `${item}-kurs` })),
              ]}
            />

            {/* Semestr ham, yo'nalish ham backendda ixtiyoriy — ma'lumot
                bo'lmasa tanlagich chizilmaydi, aks holda hech nimani
                o'zgartirmaydigan bo'sh ro'yxat qolardi. */}
            {semesterOptions.length > 0 ? (
              <Select
                aria-label="Semestr"
                value={semester}
                onChange={(value) => applyFilter(() => setSemester(value))}
                triggerClassName="h-10"
                options={[
                  { value: 'all', label: 'Barcha semestrlar' },
                  ...semesterOptions.map((item) => ({
                    value: String(item),
                    label: `${item}-semestr`,
                  })),
                ]}
              />
            ) : null}

            {directionOptions.length > 0 ? (
              <Select
                aria-label="Yo'nalish"
                value={direction}
                onChange={(value) => applyFilter(() => setDirection(value))}
                triggerClassName="h-10"
                options={[
                  { value: 'all', label: "Barcha yo'nalishlar" },
                  ...directionOptions.map((item) => ({ value: item, label: item })),
                ]}
              />
            ) : null}
          </div>

          {/* «Ariza qoldirish» bu qatordan olib tashlandi — u yuqoridagi
              bannerda turibdi va u yerda ko'rinarliroq. Bu qator endi
              faqat filtrlar uchun. */}
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:shrink-0"
            >
              <RotateCcw className="size-4" />
              Tozalash
            </button>
          ) : null}
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
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((subject) => (
                <SubjectMiniCard key={subject.id} subject={subject} universitySlug={slug} />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                <p className="text-xs text-muted-foreground tabular-nums">
                  {filtered.length} ta fandan {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)} ko&apos;rsatilmoqda
                </p>
              </div>
            ) : null}
          </>
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
