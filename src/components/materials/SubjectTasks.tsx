'use client';

import { FileText, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AssignmentRequestModal } from '@/features/requests/AssignmentRequestModal';
import { cn } from '@/lib/cn';
import type { PublicSolution, Subject } from '@/shared/types/catalogue';
import {
  ASSIGNMENT_TAB_ORDER,
  assignmentTypeLabel,
  type AssignmentType,
} from '@/shared/types/assignmentTypes';

import { CatalogueCtaBanner } from './CatalogueCtaBanner';
import { VariantGrid, type VariantWithCount } from './VariantGrid';

export interface TaskNode {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string;
  variants: VariantWithCount[];
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
  const initial = tasks.find((task) => task.id === initialTaskId) ?? tasks[0];

  const [type, setType] = useState<AssignmentType>(
    (initial?.type as AssignmentType) ?? 'practical',
  );
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(initial?.id ?? '');
  const [requestOpen, setRequestOpen] = useState(false);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const task of tasks) result[task.type] = (result[task.type] ?? 0) + 1;
    return result;
  }, [tasks]);

  /* Bo'sh turdagi tab chizilmaydi — nol yozuvli tab faqat joy egallaydi. */
  const visibleTabs = useMemo(
    () => ASSIGNMENT_TAB_ORDER.filter((item) => (counts[item] ?? 0) > 0),
    [counts],
  );

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return tasks.filter((task) => {
      if (task.type !== type) return false;
      if (search && !task.title.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [query, tasks, type]);

  /*
   * Tanlov ro'yxatdan chiqib ketsa (tab yoki qidiruv o'zgargach)
   * birinchisiga tushadi. `useEffect` emas, RENDER paytida hisoblanadi:
   * effect bilan bir kadr davomida bo'sh panel ko'rinardi.
   */
  const active = filtered.find((task) => task.id === activeId) ?? filtered[0] ?? null;

  function selectType(next: AssignmentType) {
    setType(next);
    setQuery('');
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

      <div className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-sm sm:p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 [scrollbar-width:none] overflow-x-auto pb-0.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Topshiriq turi"
              className="inline-flex min-w-max gap-1 rounded-xl bg-muted/40 p-1"
            >
              {visibleTabs.map((item) => {
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
                        ? 'bg-background text-emerald-700 shadow-sm dark:text-emerald-300'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="whitespace-nowrap">{assignmentTypeLabel(item)}</span>
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

          <div className="relative min-w-0 lg:w-[240px] lg:shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <label className="sr-only" htmlFor="task-search">
              Topshiriq qidirish
            </label>
            <input
              id="task-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Qidirish..."
              className="h-9 w-full rounded-lg border border-border/60 bg-background/80 pr-8 pl-8 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Qidiruvni tozalash"
                className="absolute top-1/2 right-2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="mt-3 grid gap-3 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-4">
        <aside className="flex w-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card">
          <div className="border-b border-border/60 px-3 py-2.5 sm:px-4">
            <p className="text-[13px] font-medium text-foreground">{assignmentTypeLabel(type)}</p>
            <p className="text-[11px] text-muted-foreground">{filtered.length} ta topshiriq</p>
          </div>

          <div className="max-h-[420px] min-h-0 flex-1 space-y-1 overflow-y-auto p-2 sm:p-2.5">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">Topshiriq topilmadi</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Qidiruvni o&apos;zgartiring yoki topshiriq yuklang.
                </p>
              </div>
            ) : (
              filtered.map((task, index) => {
                const isActive = task.id === active?.id;
                const hasSolution = task.variants.some((variant) => variant.solutionCount > 0);
                const hasDemand = task.variants.some((variant) => variant.request_count > 0);

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
                        {subject.course ? `${subject.course}-kurs · ` : ''}
                        {task.variants.length > 0
                          ? `${task.variants.length} ta variant`
                          : 'Variantsiz'}
                      </span>
                    </span>

                    <span
                      title={
                        hasSolution ? 'Yechim bor' : hasDemand ? 'Talab mavjud' : "Yechim yo'q"
                      }
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        hasSolution ? 'bg-emerald-500' : hasDemand ? 'bg-amber-500' : 'bg-zinc-400',
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
                  {assignmentTypeLabel(active.type)}
                  {subject.course ? ` · ${subject.course}-kurs` : ''} · {active.variants.length} ta
                  variant
                </p>

                {active.description && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {active.description}
                  </p>
                )}
              </header>

              <div className="mt-4">
                <VariantGrid
                  key={active.id}
                  variants={active.variants}
                  solutionsByVariant={solutionsByVariant}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">Topshiriq tanlanmagan</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Chapdagi ro&apos;yxatdan tanlang yoki yangi topshiriq yuklang.
              </p>
            </div>
          )}
        </div>
      </section>

      <AssignmentRequestModal
        open={requestOpen}
        subjectId={subject.id}
        subjectName={subject.name}
        onClose={() => setRequestOpen(false)}
      />
    </>
  );
}
