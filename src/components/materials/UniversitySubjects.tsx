'use client';

import { RotateCcw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { SubjectRequestModal } from '@/features/requests/SubjectRequestModal';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import type { University } from '@/shared/types/catalogue';

import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import { SubjectMiniCard, type SubjectWithCount } from './CatalogueCards';

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
  const { t, m } = useT();
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [semester, setSemester] = useState('all');
  const [direction, setDirection] = useState('all');
  const [page, setPage] = useState(1);
  const [requestOpen, setRequestOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  /* Tugmadagi son — yig'ilgan holatda nima yoqilganini ko'rsatadi.
     Qidiruv sanalmaydi: u maydonning o'zida ko'rinib turibdi. */
  const activeFilterCount =
    (course !== 'all' ? 1 : 0) + (semester !== 'all' ? 1 : 0) + (direction !== 'all' ? 1 : 0);

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

      {/*
        Qidiruv YOPISHADI.

        Fanlar ro'yxati uzun (bitta institutda yigirma ikkitagacha) va
        qidirmoqchi bo'lgan odam har safar tepaga qaytishi kerak edi.
        `top-16` — sayt sarlavhasi ham yopishgan va 64px balandlikda.

        Tanlagichlar esa telefonda tugma ortida: uchtasi ustma-ust
        ~150px egallardi va yopishgan holatda ekranning choragini
        yeb qo'yardi.
      */}
      <section className="sticky top-16 z-20 -mx-4 mt-5 border-b border-border/60 bg-background px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:border-border/70 sm:bg-card/80 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <label className="sr-only" htmlFor="subject-search">
              {m.materials.subjectName}
            </label>
            <input
              id="subject-search"
              /* `text`, `search` emas: brauzerning o'z tozalash xochi
                 qorong'i mavzuda ko'rinmasdi. */
              type="text"
              placeholder={m.materials.subjectSearch}
              value={search}
              onChange={(event) => applyFilter(() => setSearch(event.target.value))}
              className={cn(field, 'pl-10', search && 'pr-10')}
            />
            {search && (
              <button
                type="button"
                aria-label={m.filters.clearSearch}
                onClick={() => applyFilter(() => setSearch(''))}
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Telefonda tanlagichlarni ochadigan tugma. `sm` dan boshlab
              ular doim ko'rinadi va tugma kerak emas. */}
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            aria-label={m.filters.toggleShow}
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          >
            <SlidersHorizontal className="size-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-emerald-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div
          className={cn(
            'gap-2 sm:mt-3 sm:flex sm:flex-wrap',
            filtersOpen ? 'mt-3 grid grid-cols-2' : 'hidden',
          )}
        >
          <Select
            aria-label={m.materials.courseLabel}
            value={course}
            onChange={(value) => applyFilter(() => setCourse(value))}
            triggerClassName="h-10"
            options={[
              { value: 'all', label: m.materials.allCourses },
              ...courseOptions.map((item) => ({
                value: String(item),
                label: t((x) => x.materials.course, { course: item }),
              })),
            ]}
          />

          {/* Semestr ham, yo'nalish ham backendda ixtiyoriy — ma'lumot
              bo'lmasa tanlagich chizilmaydi, aks holda hech nimani
              o'zgartirmaydigan bo'sh ro'yxat qolardi. */}
          {semesterOptions.length > 0 ? (
            <Select
              aria-label={m.materials.semester}
              value={semester}
              onChange={(value) => applyFilter(() => setSemester(value))}
              triggerClassName="h-10"
              options={[
                { value: 'all', label: m.materials.allSemesters },
                ...semesterOptions.map((item) => ({
                  value: String(item),
                  label: t((x) => x.materials.semesterValue, { value: item }),
                })),
              ]}
            />
          ) : null}

          {directionOptions.length > 0 ? (
            <Select
              aria-label={m.materials.direction}
              value={direction}
              onChange={(value) => applyFilter(() => setDirection(value))}
              triggerClassName="h-10"
              /* Uzun ro'yxatda aylantirib topishdan ko'ra yozib topish tezroq. */
              searchable={directionOptions.length > 8}
              searchPlaceholder={m.materials.directionPlaceholder}
              options={[
                { value: 'all', label: m.materials.allDirections },
                ...directionOptions.map((item) => ({ value: item, label: item })),
              ]}
            />
          ) : null}

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="col-span-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:col-span-1"
            >
              <RotateCcw className="size-4" />
              {m.materials.clear}
            </button>
          ) : null}
        </div>
      </section>

      {/* Izoh yopishgan paneldan TASHQARIDA: u har aylantirishda ko'rinib
          turishi shart emas va panelni balandlashtirardi. */}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {m.materials.findOrRequest}
      </p>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              {m.materials.subjectNotFound}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {subjects.length === 0 ? m.materials.noSubjectsYet : m.materials.changeFilter}
            </p>
          </div>
        ) : (
          <>
            {/*
              Telefonda ham IKKI ustun.

              Ilgari bitta ustun edi va baland kartalar bilan ekranga
              ikkitasi zo'rg'a sig'ardi — yigirma ikkita fanni ko'rish
              uchun uzoq aylantirish kerak bo'lardi. Ikki ustunda bir
              ekranda to'rt-oltitasi ko'rinadi.
            */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((subject, index) => (
                <SubjectMiniCard
                  key={subject.id}
                  subject={subject}
                  universitySlug={slug}
                  index={index}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                <p className="text-xs text-muted-foreground tabular-nums">
                  {t((x) => x.materials.showingRange, {
                    total: filtered.length,
                    from: (currentPage - 1) * PAGE_SIZE + 1,
                    to: Math.min(currentPage * PAGE_SIZE, filtered.length),
                  })}
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
