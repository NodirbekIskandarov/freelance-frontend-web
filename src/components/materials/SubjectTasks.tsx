'use client';

import { FileText, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AssignmentComments } from '@/features/comments/AssignmentComments';
import { AssignmentRequestModal } from '@/features/requests/AssignmentRequestModal';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useUrlState } from '@/lib/useUrlState';
import type { PublicSolution, Subject } from '@/shared/types/catalogue';
import {
  ASSIGNMENT_TAB_ORDER,
  assignmentTypeLabel,
  isVisibleAssignmentType,
  type VisibleAssignmentType,
} from '@/shared/types/assignmentTypes';

import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import {
  DEFAULT_TASK_FILTERS,
  hasActiveTaskFilters,
  TaskFilterModal,
  type TaskAvailability,
  type TaskFilters,
} from './TaskFilterModal';
import { VariantGrid, type VariantWithCount } from './VariantGrid';
import { VariantlessTask } from './VariantlessTask';
import { AssignmentFile } from './AssignmentFile';
import { useDates } from '@/lib/useDates';

export interface TaskNode {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string;
  /** Topshiriq sharti — bo'sh bo'lishi mumkin. */
  file: string;
  /** Katalogga qachon qo'shilgani. */
  createdAt: string;
  variants: VariantWithCount[];
}

/**
 * Topshiriqning yechim holati.
 *
 * Yon ro'yxatdagi rangli nuqta ham, filtr ham AYNAN shu funksiyaga
 * tayanadi — ikki joyda alohida hisoblansa, filtr «yechim bor» deb
 * ko'rsatgan topshiriq yonida kulrang nuqta turib qolishi mumkin edi.
 */
export function taskAvailability(task: TaskNode): TaskAvailability {
  if (task.variants.some((variant) => variant.solutionCount > 0)) return 'has_solution';
  if (task.variants.some((variant) => variant.request_count > 0)) return 'demand';
  return 'missing';
}

/**
 * Fan sahifasidagi topshiriq brauzeri.
 *
 * Chapda topshiriqlar ro'yxati, o'ngda tanlanganining tafsiloti va
 * variantlar to'ri. Butun daraxt serverdan bir marta keladi, shuning
 * uchun tab va topshiriq almashishi darhol ishlaydi — qo'shimcha
 * so'rovsiz.
 */
export function SubjectTasks({
  subject,
  universitySlug,
  universityShortName,
  tasks,
  solutionsByVariant,
  initialTaskId,
}: {
  subject: Subject;
  universitySlug: string;
  universityShortName: string;
  tasks: TaskNode[];
  solutionsByVariant: Record<string, PublicSolution[]>;
  /** Chuqur havola bilan kelinganda oldindan tanlanadigan topshiriq. */
  initialTaskId?: string;
}) {
  const { t, m } = useT();
  const dates = useDates();
  const initial = tasks.find((task) => task.id === initialTaskId) ?? tasks[0];

  /*
   * Tanlangan bo'lim va topshiriq MANZILDA saqlanadi.
   *
   * Ilgari ular faqat komponent holatida edi: sahifani yangilagan yoki
   * havolani ulashgan odam birinchi tabning birinchi topshirig'iga
   * qaytardi va o'zi turgan joyni yo'qotardi.
   *
   * Manzil sahifani qayta yuklamasdan almashtiriladi (`replaceState`) —
   * tabdan tabga o'tish darhol ishlaydi, lekin havola doim joriy
   * ko'rinishni ko'rsatib turadi.
   */
  // Topshiriq AVVAL o'qiladi: bo'lim undan kelib chiqadi. Manzilda
  // topshiriq bo'lib, bo'lim bo'lmasligi mumkin (masalan `?topshiriq=…`
  // ko'rinishidagi havola) — u holda o'sha topshiriqning bo'limi ochiladi,
  // aks holda havola boshqa tabni ko'rsatib, topshiriq ko'rinmay qolardi.
  const [activeId, setActiveId] = useUrlState(
    'topshiriq',
    initial?.id ?? '',
    // Manzildagi identifikator shu fanning topshirig'i bo'lishi kerak:
    // boshqa fandan ko'chirilgan qiymat bilan panel bo'sh qolardi.
    { isValid: (value) => tasks.some((task) => task.id === value) },
  );

  const activeTask = tasks.find((task) => task.id === activeId) ?? initial;
  const defaultType =
    activeTask && isVisibleAssignmentType(activeTask.type)
      ? activeTask.type
      : ASSIGNMENT_TAB_ORDER[0];

  const [type, setType] = useUrlState('tur', defaultType, {
    isValid: isVisibleAssignmentType,
  }) as [VisibleAssignmentType, (next: VisibleAssignmentType) => void];

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const task of tasks) result[task.type] = (result[task.type] ?? 0) + 1;
    return result;
  }, [tasks]);

  /*
   * Uchala bo'lim ham doim chiziladi, bo'shi ham.
   *
   * Oldin nol yozuvli tab yashirilardi va fanda umuman qanday bo'limlar
   * borligi ko'rinmasdi. Bo'sh tab — bu ham ma'lumot: bo'lim bor, lekin
   * hozircha to'ldirilmagan.
   */
  const tabs = ASSIGNMENT_TAB_ORDER;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return tasks.filter((task) => {
      if (task.type !== type) return false;
      if (search && !task.title.toLowerCase().includes(search)) return false;

      if (filters.availability !== 'all' && taskAvailability(task) !== filters.availability) {
        return false;
      }

      if (filters.format !== 'all') {
        const hasVariants = task.variants.length > 0;
        if (filters.format === 'with_variants' && !hasVariants) return false;
        if (filters.format === 'without_variants' && hasVariants) return false;
      }

      return true;
    });
  }, [filters, query, tasks, type]);

  const filtersActive = hasActiveTaskFilters(filters);

  /*
   * Tanlov ro'yxatdan chiqib ketsa (tab yoki qidiruv o'zgargach)
   * birinchisiga tushadi. `useEffect` emas, RENDER paytida hisoblanadi:
   * effect bilan bir kadr davomida bo'sh panel ko'rinardi.
   */
  const active = filtered.find((task) => task.id === activeId) ?? filtered[0] ?? null;

  function selectType(next: VisibleAssignmentType) {
    setType(next);
    setQuery('');
    // Manzil doim ekranda turgan narsani nomlashi kerak: eski tanlov
    // boshqa bo'limning topshirig'i bo'lib qolardi va havolani ochgan
    // odam boshqa joyga tushardi.
    setActiveId(tasks.find((task) => task.type === next)?.id ?? '');
  }

  function resetFilters() {
    setFilters(DEFAULT_TASK_FILTERS);
  }

  return (
    <>
      <div className="mt-4 sm:mt-5">
        <CatalogueCtaBanner
          mode="assignment-request"
          universityShortName={universityShortName}
          universityHref={`/materials/${universitySlug}`}
          onAction={() => setRequestOpen(true)}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-2 sm:p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 [scrollbar-width:none] overflow-x-auto pb-0.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label={m.materials.assignmentTypeLabel}
              className="inline-flex min-w-max gap-1 rounded-xl bg-muted/40 p-1"
            >
              {tabs.map((item) => {
                const isActive = type === item;

                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectType(item)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-background text-emerald-700 dark:text-emerald-300'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="whitespace-nowrap">
                      {assignmentTypeLabel(item, m.assignmentTypes)}
                    </span>
                    <span
                      className={cn(
                        'inline-flex min-w-[1.25rem] items-center justify-center rounded-md px-1 text-[11px] tabular-nums',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'bg-background/60 text-muted-foreground',
                      )}
                    >
                      {counts[item] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:shrink-0">
            <div className="relative min-w-0 flex-1 lg:w-[240px] lg:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <label className="sr-only" htmlFor="task-search">
                {m.ui.searchTasks}
              </label>
              <input
                id="task-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={m.tasks.searchPlaceholder}
                className="h-9 w-full rounded-lg border border-border/60 bg-background/80 pr-8 pl-8 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={m.ui.clearSearch}
                  className="absolute top-1/2 right-2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              aria-label={m.ui.filters}
              className={cn(
                'relative inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/80 px-2.5 text-xs font-medium transition-colors hover:bg-muted sm:px-3',
                filtersActive && 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
              )}
            >
              <SlidersHorizontal className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">{m.tasks.filter}</span>
              {filtersActive ? (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              ) : null}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-3 grid gap-3 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-4">
        <aside className="flex w-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card">
          <div className="border-b border-border/60 px-3 py-2.5 sm:px-4">
            <p className="text-[13px] font-medium text-foreground">
              {assignmentTypeLabel(type, m.assignmentTypes)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t((x) => x.materials.taskCount, { count: filtered.length })}
            </p>
          </div>

          <div className="max-h-[420px] min-h-0 flex-1 space-y-1 overflow-y-auto p-2 sm:p-2.5">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  {counts[type] ? m.tasks.notFound : m.tasks.sectionEmpty}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {counts[type] ? m.tasks.changeSearch : m.tasks.beFirst}
                </p>
              </div>
            ) : (
              filtered.map((task, index) => {
                const isActive = task.id === active?.id;
                const availability = taskAvailability(task);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setActiveId(task.id)}
                    aria-current={isActive}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors',
                      isActive
                        ? 'border-emerald-500/60 bg-emerald-500/[0.07]'
                        : 'border-transparent hover:border-border/60 hover:bg-muted/35',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold tabular-nums',
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {index + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] leading-tight font-medium text-foreground">
                        {task.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {subject.course
                          ? `${t((x) => x.materials.course, { course: subject.course })} · `
                          : ''}
                        {task.variants.length > 0
                          ? t((x) => x.tasks.variantCount, { count: task.variants.length })
                          : m.tasks.noVariants}
                      </span>
                    </span>

                    <span
                      title={
                        availability === 'has_solution'
                          ? m.tasks.hasSolution
                          : availability === 'demand'
                            ? m.tasks.hasDemand
                            : m.tasks.noSolution
                      }
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        availability === 'has_solution'
                          ? 'bg-emerald-500'
                          : availability === 'demand'
                            ? 'bg-amber-500'
                            : 'bg-zinc-400',
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          {active ? (
            <>
              <header className="border-b border-border/60 pb-4">
                <h2 className="text-base font-bold text-foreground sm:text-lg">{active.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {assignmentTypeLabel(active.type, m.assignmentTypes)}
                  {subject.course
                    ? ` · ${t((x) => x.materials.course, { course: subject.course })}`
                    : ''}{' '}
                  · {t((x) => x.tasks.variantCount, { count: active.variants.length })} ·{' '}
                  {t((x) => x.variants.addedOn, { date: dates.date(active.createdAt) })}
                </p>

                {active.description && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {active.description}
                  </p>
                )}

                {/* Shart VARIANTLARDAN OLDIN: qaysi variantni tanlashni
                    aynan shu fayl hal qiladi. */}
                <AssignmentFile url={active.file} />
              </header>

              <div className="mt-4">
                {/*
                  Variantsiz topshiriqda variantlar to'ri chizilmaydi, lekin
                  amallar o'sha-o'sha: so'rov qoldirish, yechim yuborish,
                  sotib olish. Faqat variant tanlash bosqichi yo'q.
                */}
                {active.variants.length === 0 ? (
                  <VariantlessTask
                    key={active.id}
                    assignmentId={active.id}
                    assignmentTitle={active.title}
                  />
                ) : (
                  <VariantGrid
                    key={active.id}
                    variants={active.variants}
                    solutionsByVariant={solutionsByVariant}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">{m.tasks.nothingSelected}</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">{m.tasks.pickFromList}</p>
            </div>
          )}
        </div>

        {/*
          Izohlar — alohida karta, tanlangan topshiriq kartasi ostida.
          Chap ustunga emas, o'ng ustunga tushadi (`lg:col-start-2`): mavzu
          tanlangan topshiriqqa tegishli va uning tafsiloti bilan bir
          ustunda turgani mantiqan to'g'ri.

          Tanlanmagan holatda umuman chizilmaydi — qaysi topshiriq mavzusi
          ekani noma'lum bo'lardi.
        */}
        {active && (
          <div className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:col-start-2">
            <AssignmentComments
              key={active.id}
              assignmentId={active.id}
              assignmentTitle={active.title}
            />
          </div>
        )}
      </section>

      <TaskFilterModal
        open={filterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
        onReset={resetFilters}
      />

      <AssignmentRequestModal
        open={requestOpen}
        subjectId={subject.id}
        subjectName={subject.name}
        subjectCourse={subject.course}
        subjectSemester={subject.semester}
        onClose={() => setRequestOpen(false)}
      />
    </>
  );
}
