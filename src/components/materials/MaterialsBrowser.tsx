'use client';

import { LayoutGrid, Rows3, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Pagination } from '@/components/ui/Pagination';
import { SubjectRequestModal } from '@/features/requests/SubjectRequestModal';
import { UniversityRequestModal } from '@/features/requests/UniversityRequestModal';
import { useT } from '@/i18n/useT';
import { DirectionIcon } from '@/lib/catalogueVisuals';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import type { CatalogueStats, University } from '@/shared/types/catalogue';

import { UniversityBadge, type SubjectWithCount } from './CatalogueCards';
import { InstituteList, SubjectRequestCard } from './InstitutePanel';
import {
  DEFAULT_MATERIALS_FILTERS,
  MaterialsFilters,
  type MaterialsFilterState,
} from './MaterialsFilters';
import { SubjectCardGrid, SubjectTable } from './SubjectListViews';

export interface CatalogueGroup {
  university: University;
  slug: string;
  subjects: SubjectWithCount[];
}

/**
 * Bir sahifadagi fanlar soni.
 *
 * 12 ataylab: to'r 2, 3 va 4 ustunga bo'linadi (`sm`, `lg`, `xl`), 12 esa
 * uchalasiga ham qoldiqsiz bo'linadi — oxirgi qator hech qachon yarim
 * bo'sh qolmaydi.
 */
const PAGE_SIZE = 12;

type SubjectSort = 'solutions' | 'need' | 'name';
type View = 'table' | 'cards';

/** Institutning ro'yxatdagi "og'irligi" — sanoqlar javobning o'zida keladi. */
function weight(group: CatalogueGroup) {
  return {
    solutions: group.university.solution_count ?? 0,
    assignments: group.university.assignment_count ?? 0,
    subjects: group.university.subject_count ?? group.subjects.length,
  };
}

/**
 * Tanlangan tartib bo'yicha taqqoslagich.
 *
 * `material` uchalasini ketma-ket ko'radi: avval sotuvdagi yechim, keyin
 * topshiriq, keyin fan. Bitta sanoq bo'yicha saralash tenglikda tasodifiy
 * tartib berardi — ikkita institutda ham nol yechim bo'lsa, ulardan
 * topshirig'i ko'pi tepada turgani foydaliroq.
 */
function compareGroups(a: CatalogueGroup, b: CatalogueGroup, sort: MaterialsFilterState['sort']) {
  const left = weight(a);
  const right = weight(b);
  const byName = () =>
    (a.university.short_name || a.university.name).localeCompare(
      b.university.short_name || b.university.name,
      'uz',
    );

  switch (sort) {
    case 'name':
      return byName();
    case 'solutions':
      return right.solutions - left.solutions || byName();
    case 'assignments':
      return right.assignments - left.assignments || byName();
    case 'subjects':
      return right.subjects - left.subjects || byName();
    default:
      return (
        right.solutions - left.solutions ||
        right.assignments - left.assignments ||
        right.subjects - left.subjects ||
        byName()
      );
  }
}

/** Yechimi yo'q variantlar — «yechim kerak» tartibining o'lchovi. */
function openVariants(subject: SubjectWithCount) {
  return (subject.variant_count ?? 0) - (subject.solved_variant_count ?? 0);
}

function compareSubjects(a: SubjectWithCount, b: SubjectWithCount, sort: SubjectSort) {
  const byName = () => a.name.localeCompare(b.name, 'uz');

  switch (sort) {
    case 'name':
      return byName();
    case 'need':
      return openVariants(b) - openVariants(a) || byName();
    default:
      return (
        (b.solution_count ?? 0) - (a.solution_count ?? 0) ||
        b.assignmentCount - a.assignmentCount ||
        byName()
      );
  }
}

/**
 * Filtrlash MIJOZDA bajariladi.
 *
 * Katalog Server Component'da to'liq olinadi (bot to'ldirilgan HTML
 * ko'rishi uchun), shuning uchun har filtr o'zgarishida serverga qaytish
 * shart emas — bu darhol javob beradi va so'rovlarni tejaydi. Katalog
 * o'sib ketsa bu yerni server-side qidiruvga ko'chirish kerak bo'ladi.
 */
export function MaterialsBrowser({
  groups,
  stats,
}: {
  groups: CatalogueGroup[];
  stats: CatalogueStats;
}) {
  const { t, m } = useT();
  const [filters, setFilters] = useState<MaterialsFilterState>(DEFAULT_MATERIALS_FILTERS);
  const [subjectSort, setSubjectSort] = useState<SubjectSort>('solutions');
  const [view, setView] = useState<View>('table');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [universityModal, setUniversityModal] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);

  const courseOptions = useMemo(() => {
    const courses = new Set<number>();
    for (const group of groups) {
      for (const subject of group.subjects) {
        if (subject.course) courses.add(subject.course);
      }
    }

    return [...courses]
      .sort((a, b) => a - b)
      .map((course) => ({ value: String(course), label: `${course}-kurs` }));
  }, [groups]);

  const semesterOptions = useMemo(() => {
    const semesters = new Set<number>();
    for (const group of groups) {
      for (const subject of group.subjects) {
        if (subject.semester) semesters.add(subject.semester);
      }
    }

    return [...semesters]
      .sort((a, b) => a - b)
      .map((semester) => ({ value: String(semester), label: `${semester}-semestr` }));
  }, [groups]);

  /*
   * IKKI bosqichli filtr.
   *
   * `narrowed` — yo'nalishdan TASHQARI hamma filtr qo'llangan holat.
   * Chiplar ustidagi sonlar aynan shundan olinadi: agar ular yo'nalish
   * tanlangandan keyingi ro'yxatdan hisoblansa, tanlanmagan har bir chip
   * doim «0» ko'rsatib turardi va ularni bosishning ma'nosi qolmasdi.
   */
  const narrowed = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return groups.map((group) => {
      /* Institut nomi qidiruvga mos kelsa, uning BARCHA fanlari qoladi:
         «TATU» deb yozgan odam TATU fanlarini emas, nomida «tatu» bor
         fanlarni izlamayapti. */
      const universityMatches =
        search !== '' &&
        (group.university.name.toLowerCase().includes(search) ||
          group.university.short_name.toLowerCase().includes(search));

      return {
        ...group,
        subjects: group.subjects.filter((subject) => {
          if (search && !universityMatches && !subject.name.toLowerCase().includes(search)) {
            return false;
          }
          if (filters.course !== 'all' && String(subject.course ?? '') !== filters.course) {
            return false;
          }
          if (filters.semester !== 'all' && String(subject.semester ?? '') !== filters.semester) {
            return false;
          }
          return true;
        }),
      };
    });
  }, [filters.course, filters.search, filters.semester, groups]);

  const chips = useMemo(() => {
    const counts = new Map<string, number>();
    let total = 0;

    for (const group of narrowed) {
      for (const subject of group.subjects) {
        total += 1;
        if (subject.direction_name) {
          counts.set(subject.direction_name, (counts.get(subject.direction_name) ?? 0) + 1);
        }
      }
    }

    return [
      { value: 'all', label: m.common.all, count: total },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'uz'))
        .map(([label, count]) => ({ value: label, label, count })),
    ];
  }, [m.common.all, narrowed]);

  const institutes = useMemo(() => {
    const isNarrowed =
      filters.search.trim() !== '' ||
      filters.course !== 'all' ||
      filters.semester !== 'all' ||
      filters.direction !== 'all';

    return (
      narrowed
        .map((group) => ({
          ...group,
          subjects:
            filters.direction === 'all'
              ? group.subjects
              : group.subjects.filter((subject) => subject.direction_name === filters.direction),
        }))
        /*
         * Filtr qo'llanganda fansiz institut ko'rsatilmaydi: uni tanlagan
         * odam bo'sh ro'yxatga tushardi. Filtrsiz holatda esa institut
         * ro'yxatda qoladi — u haqiqatan ham bo'sh bo'lishi mumkin.
         */
        .filter((group) => !isNarrowed || group.subjects.length > 0)
        .sort((a, b) => compareGroups(a, b, filters.sort))
    );
  }, [filters.course, filters.direction, filters.search, filters.semester, filters.sort, narrowed]);

  /*
   * Tanlangan institut render paytida aniqlanadi.
   *
   * Effekt bilan tuzatilsa, filtr toraygan lahzada bir kadr davomida
   * ro'yxatda umuman yo'q institut ochilib turardi.
   */
  const selected = institutes.find((group) => group.university.id === pickedId) ?? institutes[0];

  const subjects = useMemo(() => {
    if (!selected) return [];
    return [...selected.subjects].sort((a, b) => compareSubjects(a, b, subjectSort));
  }, [selected, subjectSort]);

  const totalPages = Math.max(1, Math.ceil(subjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = subjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function applyFilters(patch: Partial<MaterialsFilterState>) {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }

  function selectInstitute(universityId: string) {
    setPickedId(universityId);
    setPage(1);
  }

  const sortTabs: { value: SubjectSort; label: string }[] = [
    { value: 'solutions', label: m.materials.sortBySolutions },
    { value: 'need', label: m.materials.sortByNeed },
    { value: 'name', label: m.materials.alphabetical },
  ];

  const views: { value: View; label: string; icon: typeof LayoutGrid }[] = [
    { value: 'cards', label: m.materials.viewCards, icon: LayoutGrid },
    { value: 'table', label: m.materials.viewTable, icon: Rows3 },
  ];

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {m.materials.heading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {m.materials.lead}
          </p>
        </div>

        {/* Ko'rinish almashtirgichi sarlavha bilan BIR QATORDA: u butun
            ro'yxatga tegishli, ya'ni ro'yxatning o'z ichida turgani uni
            faqat tanlangan institutga tegishlidek ko'rsatardi. */}
        <div className="inline-flex shrink-0 rounded-xl border border-border/70 bg-card p-0.5">
          {views.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setView(item.value)}
              aria-pressed={view === item.value}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors',
                view === item.value
                  ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-5 sm:mt-6">
        <MaterialsFilters
          filters={filters}
          courses={courseOptions}
          semesters={semesterOptions}
          onChange={applyFilters}
          onReset={() => {
            setFilters(DEFAULT_MATERIALS_FILTERS);
            setPage(1);
          }}
        />
      </div>

      {/*
        Yo'nalish chiplari — backend yo'nalish bermasa umuman chizilmaydi.
        Yonidagi son «bu yo'nalishda nechta fan bor» degan savolga
        bosishdan OLDIN javob beradi.
      */}
      {chips.length > 1 && (
        <div className="-mx-4 mt-3 [scrollbar-width:none] overflow-x-auto px-4 py-1 [-ms-overflow-style:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {chips.map((chip) => {
              const active = filters.direction === chip.value;

              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => applyFilters({ direction: chip.value })}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                    active
                      ? // Qora yorliq: oq matn `emerald-500` ustida 2.54:1
                        // beradi, ya'ni o'qish chegarasidan past.
                        'bg-emerald-500 text-emerald-950'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <DirectionIcon name={chip.value === 'all' ? '' : chip.label} className="size-4" />
                  {chip.label}
                  <span className="text-xs tabular-nums opacity-70">{formatCount(chip.count)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/*
        Uchta bola, ikkita ustun.

        Telefonda ular DOM tartibida chiqadi: institutlar → fanlar →
        «Fan topilmadimi?». Ariza kartasi ataylab oxirida — ilgari u
        ro'yxat bilan fanlar orasida turib, har bir tashrifchini kerakli
        narsagacha yana bir ekran aylantirishga majbur qilardi, holbuki u
        kerak bo'ladigan payt ro'yxatda hech nima topilmagandan KEYIN.

        `lg` dan boshlab esa kartaning o'rni aniq ko'rsatiladi: chap
        ustunning ikkinchi qatori, ya'ni institutlar ro'yxati ostida.
        Fanlar ustuni ikkala qatorni egallaydi.
      */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start">
        <InstituteList
          className="lg:sticky lg:top-20 lg:col-start-1 lg:row-start-1"
          institutes={institutes.map((group) => ({
            university: group.university,
            slug: group.slug,
            subjectCount: group.subjects.length,
          }))}
          selectedId={selected?.university.id ?? null}
          onSelect={selectInstitute}
          alphabetical={filters.sort === 'name'}
          onToggleAlphabetical={() =>
            applyFilters({ sort: filters.sort === 'name' ? 'material' : 'name' })
          }
          onRequestUniversity={() => setUniversityModal(true)}
        />

        {selected ? (
          <section className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <UniversityHeader group={selected} />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4">
              <p className="text-sm font-semibold text-foreground">
                {m.materials.subjectsHeading}{' '}
                <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                  {formatCount(subjects.length)}
                </span>
              </p>

              <div className="inline-flex rounded-xl border border-border/70 bg-card p-0.5">
                {sortTabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setSubjectSort(tab.value);
                      setPage(1);
                    }}
                    aria-pressed={subjectSort === tab.value}
                    className={cn(
                      'h-8 rounded-lg px-2.5 text-xs font-medium transition-colors',
                      subjectSort === tab.value
                        ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              {visible.length === 0 ? (
                <EmptyState title={m.materials.subjectNotFound} text={m.materials.changeFilter} />
              ) : view === 'table' ? (
                <SubjectTable subjects={visible} universitySlug={selected.slug} />
              ) : (
                <SubjectCardGrid subjects={visible} universitySlug={selected.slug} />
              )}
            </div>

            {subjects.length > 0 && (
              <div className="mt-5 flex flex-col items-center gap-3">
                {totalPages > 1 && (
                  <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
                )}
                <p className="text-xs text-muted-foreground tabular-nums">
                  {t((x) => x.materials.showingRange, {
                    total: subjects.length,
                    from: (currentPage - 1) * PAGE_SIZE + 1,
                    to: Math.min(currentPage * PAGE_SIZE, subjects.length),
                  })}
                </p>
              </div>
            )}
          </section>
        ) : (
          <EmptyState
            title={m.materials.nothingFound}
            text={m.filters.noResults}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
          />
        )}

        <SubjectRequestCard
          className="lg:col-start-1 lg:row-start-2"
          onRequestSubject={() => setSubjectModal(true)}
          canRequestSubject={Boolean(selected)}
          subjectRequestReward={stats.subject_request_reward}
        />
      </div>

      <UniversityRequestModal open={universityModal} onClose={() => setUniversityModal(false)} />

      {selected && (
        <SubjectRequestModal
          open={subjectModal}
          universityId={selected.university.id}
          universityName={selected.university.name}
          onClose={() => setSubjectModal(false)}
        />
      )}
    </>
  );
}

function EmptyState({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center',
        className,
      )}
    >
      <SearchX className="size-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/** Tanlangan institut sarlavhasi: nomi, shahri va to'rtta sanoq. */
function UniversityHeader({ group }: { group: CatalogueGroup }) {
  const { t, m } = useT();
  const { university } = group;

  const variants = university.variant_count ?? 0;
  const solved = university.solved_variant_count ?? 0;

  const stats = [
    { value: university.assignment_count ?? 0, label: m.materials.statAssignments },
    { value: variants, label: m.materials.statVariants },
    { value: university.solution_count ?? 0, label: m.materials.statReady, tone: 'emerald' },
    /* Bo'sh variantlar AYIRMA sifatida: backend ikkita sonni beradi va
       uchinchisini o'ylab topishdan ko'ra shu yerda ayirgan aniqroq —
       ular hech qachon bir-biriga zid bo'lmaydi. */
    { value: Math.max(0, variants - solved), label: m.materials.statOpen, tone: 'amber' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 sm:gap-4 sm:p-4">
      <UniversityBadge university={university} className="size-11 text-[11px] sm:size-12" />

      <div className="min-w-0 flex-1">
        {/* `line-clamp`, `truncate` EMAS: to'liq nom uzun («Toshkent Axborot
            Texnologiyalari universiteti») va bir qatorga sig'maganda uni
            kesib tashlashdan ko'ra ikkinchi qatorga o'tkazgan yaxshiroq —
            yonidagi sanoqlar baribir shuncha joy egallaydi. */}
        <h2 className="line-clamp-2 text-base font-bold tracking-tight text-foreground sm:text-lg">
          {university.name}
        </h2>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {university.city ? `${university.city} · ` : ''}
          {t((x) => x.materials.instituteSubjects, { count: group.subjects.length })}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
        {stats.map((stat) => (
          <p
            key={stat.label}
            className="rounded-xl bg-muted/50 px-2.5 py-1.5 text-center sm:min-w-[4.75rem]"
          >
            <span
              className={cn(
                'block text-base font-bold tabular-nums sm:text-lg',
                stat.tone === 'emerald'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : stat.tone === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-foreground',
              )}
            >
              {formatCount(stat.value)}
            </span>
            <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
              {stat.label}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
