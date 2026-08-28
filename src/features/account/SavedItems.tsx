'use client';

import { BookmarkX, FileText, Star, UserRound } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useState } from 'react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { cn } from '@/lib/cn';

import {
  useGetSavedFreelancersQuery,
  useGetSavedSolutionsQuery,
  useUnsaveFreelancerMutation,
  useUnsaveSolutionMutation,
} from './accountApi';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

/**
 * Saqlanganlar ikki alohida ro'yxat — backendda ham shunday.
 * Ularni bitta ro'yxatga qo'shib yuborish o'chirish yo'lini
 * chalkashtirardi: har biriga o'z endpoint'i bor.
 */
type Tab = 'solutions' | 'freelancers';

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-emerald-600 text-white'
          : 'border border-border bg-background text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function Skeletons() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  const { m } = useT();

  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{m.ui.savedEmpty}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function SavedSolutions() {
  const money = useMoney();
  const { t, m } = useT();
  const { data, isLoading, error } = useGetSavedSolutionsQuery({ page_size: 50 });
  const [unsave] = useUnsaveSolutionMutation();

  if (error) return <ErrorNotice error={error} />;
  if (isLoading || !data) return <Skeletons />;
  if (data.results.length === 0) {
    return <Empty text={m.saved.emptySolutions} />;
  }

  return (
    <div className="grid gap-3">
      {data.results.map((item) => (
        <article
          key={item.id}
          className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <FileText className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground">{item.solution_title}</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {item.university_short_name} &middot; {item.subject_name} &middot;{' '}
              {item.variant_label}
            </p>
            {Number(item.average_rating) > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {Number(item.average_rating).toFixed(1)}
              </p>
            )}
          </div>

          <div className="text-right text-sm font-semibold whitespace-nowrap text-foreground">
            {money.som(Number(item.price))}
          </div>

          <button
            type="button"
            onClick={() => void unsave(item.solution)}
            aria-label={t((x) => x.saved.remove, { name: item.solution_title })}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <BookmarkX className="size-4" />
          </button>
        </article>
      ))}
    </div>
  );
}

function SavedFreelancers() {
  const { t, m } = useT();
  const { data, isLoading, error } = useGetSavedFreelancersQuery({ page_size: 50 });
  const [unsave] = useUnsaveFreelancerMutation();

  if (error) return <ErrorNotice error={error} />;
  if (isLoading || !data) return <Skeletons />;
  if (data.results.length === 0) {
    return <Empty text={m.saved.emptyFreelancers} />;
  }

  return (
    <div className="grid gap-3">
      {data.results.map((item) => (
        <article
          key={item.id}
          className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <UserRound className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground">
              <Link href="/freelance" className="hover:underline">
                {item.freelancer.full_name || 'Freelancer'}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {item.freelancer.city || m.common.none} &middot;{' '}
              {t((x) => x.saved.completedJobs, { count: item.freelancer.completed_jobs })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void unsave(item.freelancer.id)}
            aria-label={t((x) => x.saved.remove, { name: item.freelancer.full_name })}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <BookmarkX className="size-4" />
          </button>
        </article>
      ))}
    </div>
  );
}

export function SavedItems() {
  const { m } = useT();
  const [tab, setTab] = useState<Tab>('solutions');

  return (
    <>
      <div className="mb-4 flex gap-2">
        <TabButton active={tab === 'solutions'} onClick={() => setTab('solutions')}>
          {m.saved.solutions}
        </TabButton>
        <TabButton active={tab === 'freelancers'} onClick={() => setTab('freelancers')}>
          {m.saved.freelancers}
        </TabButton>
      </div>

      {tab === 'solutions' ? <SavedSolutions /> : <SavedFreelancers />}
    </>
  );
}
