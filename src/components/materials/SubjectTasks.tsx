'use client';

import { FileText, Plus, Search, SlidersHorizontal, Upload, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { AssignmentComments } from '@/features/comments/AssignmentComments';
import { AssignmentRequestModal } from '@/features/requests/AssignmentRequestModal';
import { SolutionUploadModal } from '@/features/solutions/SolutionUploadModal';
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

import { AssignmentOverview } from './AssignmentOverview';
import { AssignmentStatsCard } from './AssignmentStatsCard';
import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import {
  DEFAULT_TASK_FILTERS,
  hasActiveTaskFilters,
  TaskFilterModal,
  type TaskAvailability,
  type TaskFilters,
} from './TaskFilterModal';
import { VariantChips } from './VariantChips';
import { VariantPanel } from './VariantPanel';
import { VariantlessTask } from './VariantlessTask';
import { DOT, STATUS_LABELS, type VariantWithCount } from './variantStatus';

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
 * Yon ro'yxatdagi yorliq ham, filtr ham AYNAN shu funksiyaga tayanadi —
 * ikki joyda alohida hisoblansa, filtr «yechim bor» deb ko'rsatgan
 * topshiriq yonida kulrang yorliq turib qolishi mumkin edi.
 */
export function taskAvailability(task: TaskNode): TaskAvailability {
  if (task.variants.some((variant) => variant.solutionCount > 0)) return 'has_solution';
  if (task.variants.some((variant) => variant.request_count > 0)) return 'demand';
  return 'missing';
}

/**
 * «Barchasi» — bo'lim emas, bo'limlar ustidagi tanlov.
 *
 * Turlardan biri BO'LMASLIGI kerak: `VisibleAssignmentType` backend
 * qiymatlari va manzildagi `?tur=all` ularning hech biriga to'g'ri
 * kelmaydi.
 */
const TAB_ALL = 'all';
type TabValue = typeof TAB_ALL | VisibleAssignmentType;

function isTabValue(value: string): value is TabValue {
  return value === TAB_ALL || isVisibleAssignmentType(value);
}

/** Topshiriqdagi yechim va so'rovlarning umumiy soni. */
function totals(task: TaskNode) {
  return task.variants.reduce(
    (acc, variant) => ({
      solutions: acc.solutions + variant.solutionCount,
      requests: acc.requests + variant.request_count,
    }),
    { solutions: 0, requests: 0 },
  );
}

/**
 * Fan sahifasidagi topshiriq brauzeri.
 *
 * Uchta ustun: chapda topshiriqlar ro'yxati, o'rtada tanlanganining
 * tafsiloti va variantlar to'ri, o'ngda tanlangan variant paneli. Butun
 * daraxt serverdan bir marta keladi, shuning uchun tab, topshiriq va
 * variant almashishi qo'shimcha so'rovsiz darhol ishlaydi.
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
  const [activeId, setActiveId] = useUrlState(
    'topshiriq',
    initial?.id ?? '',
    // Manzildagi identifikator shu fanning topshirig'i bo'lishi kerak:
    // boshqa fandan ko'chirilgan qiymat bilan panel bo'sh qolardi.
    { isValid: (value) => tasks.some((task) => task.id === value) },
  );

  /*
   * Standart bo'lim — «Barchasi».
   *
   * Ilgari sahifa birinchi topshiriqning TURI bilan ochilardi va besh
   * topshiriqli fanda ulardan faqat bittasi ko'rinardi: qolganini
   * ko'rish uchun tabma-tab yurish kerak edi.
   */
  const [type, setType] = useUrlState('tur', TAB_ALL, { isValid: isTabValue }) as [
    TabValue,
    (next: TabValue) => void,
  ];

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  /*
   * Tanlangan variant va shu seansda so'rov yuborilganlari — SAHIFA
   * darajasida.
   *
   * Ilgari ikkalasi ham variantlar to'ri ichida edi, chunki to'r va panel
   * bitta komponent edi. Endi ular sahifaning ikki turli ustunida turadi
   * va umumiy holat yuqorida bo'lishi kerak.
   */
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const result: Record<string, number> = { [TAB_ALL]: tasks.length };
    for (const task of tasks) result[task.type] = (result[task.type] ?? 0) + 1;
    return result;
  }, [tasks]);

  const tabLabel = (item: TabValue) =>
    item === TAB_ALL ? m.common.all : assignmentTypeLabel(item, m.assignmentTypes);

  /*
   * Uchala bo'lim ham doim chiziladi, bo'shi ham.
   *
   * Oldin nol yozuvli tab yashirilardi va fanda umuman qanday bo'limlar
   * borligi ko'rinmasdi. Bo'sh tab — bu ham ma'lumot: bo'lim bor, lekin
   * hozircha to'ldirilmagan.
   */
  const tabs: TabValue[] = [TAB_ALL, ...ASSIGNMENT_TAB_ORDER];

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    /*
     * Raqam kiritilsa u VARIANT raqami sifatida ham qaraladi.
     *
     * Talaba o'z variantining raqamini biladi, topshiriq nomini esa
     * ko'pincha yo'q: «7» deb yozib, o'n beshta variantli to'rni
     * ko'zdan kechirmasdan kerakligini topadi.
     */
    const asNumber = Number(search);
    const byNumber = search !== '' && Number.isInteger(asNumber) && asNumber > 0;

    return tasks.filter((task) => {
      if (type !== TAB_ALL && task.type !== type) return false;

      if (search) {
        const titleHit = task.title.toLowerCase().includes(search);
        const variantHit = byNumber && task.variants.some((item) => item.number === asNumber);
        if (!titleHit && !variantHit) return false;
      }

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
  const filterCount = (filters.availability !== 'all' ? 1 : 0) + (filters.format !== 'all' ? 1 : 0);

  /*
   * Tanlov ro'yxatdan chiqib ketsa (tab yoki qidiruv o'zgargach)
   * birinchisiga tushadi. `useEffect` emas, RENDER paytida hisoblanadi:
   * effect bilan bir kadr davomida bo'sh panel ko'rinardi.
   */
  const active = filtered.find((task) => task.id === activeId) ?? filtered[0] ?? null;

  /*
   * Tanlangan variant ham shu tarzda hisoblanadi: topshiriq almashganda
   * eski identifikator yangi ro'yxatda topilmaydi va tanlov o'z-o'zidan
   * birinchi variantga tushadi.
   */
  const variants = active?.variants ?? [];
  const selectedVariant = variants.find((item) => item.id === selectedVariantId) ?? variants[0];

  const totalVariants = useMemo(
    () => tasks.reduce((sum, task) => sum + task.variants.length, 0),
    [tasks],
  );

  function selectType(next: TabValue) {
    setType(next);
    setQuery('');
    // Manzil doim ekranda turgan narsani nomlashi kerak: eski tanlov
    // boshqa bo'limning topshirig'i bo'lib qolardi va havolani ochgan
    // odam boshqa joyga tushardi.
    setActiveId(tasks.find((task) => next === TAB_ALL || task.type === next)?.id ?? '');
  }

  /*
   * Variant tanlanganda panel ko'rinadigan joyga suriladi — FAQAT tor
   * ekranda.
   *
   * Keng ekranda panel to'rning yonida turadi va tanlov darhol ko'rinadi.
   * Tor ekranda esa u to'r ostida qoladi: odam variantni bosadi, hech
   * nima o'zgarmagandek tuyuladi va boshqasini bosaveradi.
   *
   * `lg` chegarasi (1024px) Tailwind'dagi joylashuv o'zgarishi bilan bir
   * xil — ikkalasi bir vaqtda o'zgarishi kerak.
   */
  function selectVariant(id: string) {
    setSelectedVariantId(id);
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const subjectMeta = [
    subject.direction_name,
    subject.course ? t((x) => x.materials.course, { course: subject.course! }) : '',
    subject.semester ? t((x) => x.materials.semesterValue, { value: subject.semester }) : '',
    t((x) => x.materials.taskCount, { count: tasks.length }),
    totalVariants > 0 ? t((x) => x.tasks.variantCount, { count: totalVariants }) : '',
  ].filter(Boolean);

  /* O'ng ustun faqat variantli topshiriqda bor — variantsizida tanlash
     bosqichi yo'q va panel ham bo'lmaydi. */
  const sidePanel = active && selectedVariant ? selectedVariant : null;

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {subject.name}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subjectMeta.join(' · ')}</p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => setRequestOpen(true)}
          >
            <Plus className="size-4" />
            {m.cta.actionAssignment}
          </Button>

          {/*
            Yechim yuborish TANLANGAN variantga ketadi — shuning uchun
            faqat variantli topshiriqda ko'rinadi. Variantsizida o'z
            paneli va o'z tugmasi bor.

            Qabul yopilgan bo'lsa tugma o'chiriladi: bosib, serverdan xato
            olishdan ko'ra sababni oldindan aytish yaxshiroq.
          */}
          {sidePanel && (
            <Button
              variant="emerald"
              className="flex-1 sm:flex-none"
              disabled={!sidePanel.submissions_open}
              title={sidePanel.submissions_open ? undefined : m.variants.uploadsClosed}
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="size-4" />
              {m.variants.upload}
            </Button>
          )}
        </div>
      </header>

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
                    <span className="whitespace-nowrap">{tabLabel(item)}</span>
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
            <div className="relative min-w-0 flex-1 lg:w-[260px] lg:flex-none">
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
                'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 text-xs font-medium transition-colors hover:bg-muted sm:px-3',
                filtersActive && 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
              )}
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">{m.tasks.filter}</span>
              {/* Nuqta emas, SON: ikkita filtr yoqilganini nuqta aytmasdi
                  va oynani ochmasdan bilib bo'lmasdi. */}
              {filterCount > 0 && (
                <span className="inline-flex min-w-[1.125rem] items-center justify-center rounded-md bg-emerald-500/15 px-1 text-[11px] font-bold text-emerald-700 tabular-nums dark:text-emerald-300">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <section
        className={cn(
          'mt-3 grid gap-3 lg:items-start lg:gap-4',
          sidePanel
            ? 'lg:grid-cols-[250px_minmax(0,1fr)_320px]'
            : 'lg:grid-cols-[250px_minmax(0,1fr)]',
        )}
      >
        {/* ——— Chap ustun: ro'yxat va belgilar izohi ——— */}
        <div className="min-w-0 space-y-3 lg:col-start-1 lg:row-start-1">
          <div className="flex w-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card">
            {/* Telefonda YASHIRIN: faol tab allaqachon «Barchasi 5» deb
                turibdi va bu sarlavha o'sha ikki so'zni qaytarib, birinchi
                ekrandan 60px yeb qo'yardi. */}
            <div className="hidden border-b border-border/60 px-3 py-2.5 sm:px-4 lg:block">
              <p className="text-[13px] font-medium text-foreground">{tabLabel(type)}</p>
              <p className="text-[11px] text-muted-foreground">
                {t((x) => x.materials.taskCount, { count: filtered.length })}
              </p>
            </div>

            <div className="max-h-[420px] min-h-0 flex-1 space-y-1 overflow-y-auto p-2 sm:p-2.5">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    {counts[type]
                      ? m.tasks.notFound
                      : type === TAB_ALL
                        ? m.tasks.subjectEmpty
                        : m.tasks.sectionEmpty}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {counts[type] ? m.tasks.changeSearch : m.tasks.beFirst}
                  </p>
                </div>
              ) : (
                filtered.map((task, index) => {
                  const isActive = task.id === active?.id;
                  const availability = taskAvailability(task);
                  const counted = totals(task);

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

                        {/*
                          Ikkinchi qator: tur, variantlar soni va holat.

                          KURS OLIB TASHLANDI — u sahifa sarlavhasida
                          allaqachon bor va fan ichidagi HAR topshiriqda
                          bir xil. Tur esa faqat «Barchasi» tabida ma'noli:
                          bo'lim tanlangan bo'lsa uni tabning o'zi aytib
                          turibdi.
                        */}
                        <span className="mt-1 flex min-w-0 items-center gap-1.5">
                          {/*
                            TUR yoki VARIANTLAR SONI — ikkalasi emas.
                            Ustun 250px va ikkalasi birga sig'masdi: nomi
                            ham, sanog'i ham yarmidan kesilardi. «Barchasi»
                            tabida qatorlarni tur ajratadi, bo'lim
                            tanlanganda esa turni tabning o'zi aytib
                            turibdi va farqni variantlar soni ko'rsatadi.
                          */}
                          <span className="truncate text-[11px] text-muted-foreground">
                            {type === TAB_ALL
                              ? assignmentTypeLabel(task.type, m.assignmentTypes)
                              : task.variants.length > 0
                                ? t((x) => x.tasks.variantCount, { count: task.variants.length })
                                : m.tasks.noVariants}
                          </span>

                          {/*
                            Rangli NUQTA o'rniga sonli yorliq. Nuqta 8px
                            edi va ma'nosi faqat `title` da — telefonda
                            hover yo'q, ya'ni u hech nima aytmasdi.
                          */}
                          <span
                            className={cn(
                              'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap',
                              availability === 'has_solution'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : availability === 'demand'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                  : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {availability === 'has_solution'
                              ? t((x) => x.variants.solutionCount, { count: counted.solutions })
                              : availability === 'demand'
                                ? t((x) => x.variants.requestCount, { count: counted.requests })
                                : m.tasks.noSolution}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/*
            Belgilar izohi — ro'yxat OSTIDA, variantlar to'ri ichida emas.
            Bir xil uchta rang ikkala joyda ishlatiladi va izoh ikki marta
            takrorlanardi.
          */}
          <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
            <ul className="space-y-1.5">
              {(['available', 'requested', 'empty'] as const).map((status) => (
                <li
                  key={status}
                  className="flex items-center gap-2 text-[11px] text-muted-foreground"
                >
                  <span className={cn('size-2 shrink-0 rounded-full', DOT[status])} />
                  {STATUS_LABELS(m)[status]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ——— Markaz: topshiriq va variantlar ——— */}
        <div className="min-w-0 space-y-3 lg:col-start-2 lg:row-start-1">
          {active ? (
            <>
              <AssignmentOverview
                title={active.title}
                type={active.type}
                description={active.description}
                file={active.file}
                createdAt={active.createdAt}
                course={subject.course}
                variants={active.variants}
                solutionsByVariant={solutionsByVariant}
              />

              {/*
                Variantsiz topshiriqda variantlar to'ri chizilmaydi, lekin
                amallar o'sha-o'sha: so'rov qoldirish, yechim yuborish.
                Faqat variant tanlash bosqichi yo'q.
              */}
              {active.variants.length === 0 ? (
                <VariantlessTask
                  key={active.id}
                  assignmentId={active.id}
                  assignmentTitle={active.title}
                />
              ) : (
                <VariantChips
                  variants={active.variants}
                  selectedId={selectedVariant?.id ?? ''}
                  onSelect={selectVariant}
                  requestedIds={requestedIds}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card px-4 py-16 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">{m.tasks.nothingSelected}</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">{m.tasks.pickFromList}</p>
            </div>
          )}
        </div>

        {/* ——— O'ng ustun: tanlangan variant va sanoqlar ——— */}
        {active && sidePanel && (
          <div ref={panelRef} className="min-w-0 space-y-3 lg:col-start-3 lg:row-start-1">
            <VariantPanel
              key={sidePanel.id}
              variant={sidePanel}
              solutions={solutionsByVariant[sidePanel.id] ?? []}
              assignmentId={active.id}
              assignmentTitle={active.title}
              subjectName={subject.name}
              universityShortName={universityShortName}
              requestedIds={requestedIds}
              onRequested={(id) => setRequestedIds((current) => [...current, id])}
            />

            <AssignmentStatsCard
              variants={active.variants}
              solutionsByVariant={solutionsByVariant}
            />
          </div>
        )}

        {/*
          Izohlar — markaziy ustun ostida, alohida qator.

          Ular uchinchi ustundan KEYIN chiziladi: telefonda ustunlar
          ustma-ust tushadi va variantlar paneli — sahifaga kelish sababi —
          izohlardan oldin turishi kerak.
        */}
        {active && (
          <div className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:col-start-2 lg:row-start-2">
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
        onReset={() => setFilters(DEFAULT_TASK_FILTERS)}
      />

      <AssignmentRequestModal
        open={requestOpen}
        subjectId={subject.id}
        subjectName={subject.name}
        subjectCourse={subject.course}
        subjectSemester={subject.semester}
        onClose={() => setRequestOpen(false)}
      />

      {active && sidePanel && (
        <SolutionUploadModal
          open={uploadOpen}
          variantId={sidePanel.id}
          variantNumber={sidePanel.number}
          assignmentTitle={active.title}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </>
  );
}
