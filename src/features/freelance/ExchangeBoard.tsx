'use client';

import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Inbox,
  Plus,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useState } from 'react';

import { ExchangeStatusBadge } from '@/components/freelance/ExchangeStatusBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { formatSom } from '@/lib/format';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  EXCHANGE_STATUS_LABELS,
  formatDeadlineDays,
  type ExchangeTask,
} from '@/shared/types/freelance';

import { CreateTaskDialog } from './CreateTaskDialog';
import { useGetExchangeOffersQuery, useGetExchangeTasksQuery } from './exchangeApi';

export function ExchangeBoard() {
  const { data: tasks, isLoading, error } = useGetExchangeTasksQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /*
   * Tanlangan topshiriq ro'yxatdan qidiriladi, alohida state'da
   * saqlanmaydi: aks holda topshiriq yangilangach panel eski nusxani
   * ko'rsatib turardi.
   */
  const selected = tasks?.find((task) => task.id === selectedId) ?? null;
  const totalOffers = tasks?.reduce((sum, task) => sum + task.offersCount, 0) ?? 0;

  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {getApiErrorMessage(error)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
              <ClipboardList className="size-4" />
            </span>
            <div>
              <h1 className="text-sm font-semibold text-foreground sm:text-[15px]">
                Topshiriqni birjaga joylang
              </h1>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Fayl, muddat va izoh — freelancerlar taklif yuboradi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatPill
              icon={<ClipboardList className="size-3.5" />}
              value={tasks?.length ?? 0}
              label="Topshiriq"
            />
            <StatPill
              icon={<Sparkles className="size-3.5" />}
              value={totalOffers}
              label="Taklif"
              accent
            />
            <Button variant="emerald" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Topshiriq yaratish
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Mening topshiriqlarim</h2>
            <p className="text-[11px] text-muted-foreground lg:hidden">
              Topshiriqni bosing — batafsil ochiladi
            </p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {tasks?.length ?? 0} ta
          </span>
        </header>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="lg:grid lg:min-h-[480px] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div
              className={cn(
                'border-border p-3 sm:p-4 lg:border-r',
                selected && 'hidden lg:block',
              )}
            >
              <p className="px-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Mening topshiriqlarim
              </p>
              <ul className="mt-2 space-y-2">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <TaskListItem
                      task={task}
                      active={task.id === selectedId}
                      onSelect={() => setSelectedId(task.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn('min-w-0 p-3 sm:p-4', !selected && 'hidden lg:block')}>
              {selected ? (
                <OffersPanel task={selected} onBack={() => setSelectedId(null)} />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-5 py-10 text-center">
                  <Search className="size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Topshiriqni tanlang</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Chapdagi ro&apos;yxatdan birini bosing.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-12 text-center">
            <Inbox className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Hali topshiriq yo&apos;q</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Birinchi topshiriqni joylang va takliflarni kuting.
            </p>
            <Button variant="emerald" onClick={() => setDialogOpen(true)} className="mt-4">
              <Plus className="size-4" />
              Topshiriq yaratish
            </Button>
          </div>
        )}
      </section>

      <CreateTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
  accent = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'hidden items-center gap-2 rounded-xl border px-2.5 py-2 sm:flex',
        accent
          ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400'
          : 'border-border bg-muted/40 text-muted-foreground',
      )}
    >
      {icon}
      <span className="text-base leading-none font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

/** Topshiriq hali ochiq — freelancerlar taklif yuborishi mumkin. */
const OPEN_STATUSES = new Set<ExchangeTask['status']>(['yangi', 'takliflar_kelyapti']);

/*
 * Faqat `offersCount`ga qarab yozuv chiqarish yetarli emas edi: taklifsiz
 * yakunlangan topshiriq ham "Taklif kutilmoqda" deb turardi. Yozuv
 * topshiriq holatidan kelib chiqadi.
 */
function footnoteFor(task: ExchangeTask): string {
  if (task.offersCount > 0) return `${task.offersCount} ta taklif`;
  if (OPEN_STATUSES.has(task.status)) return 'Taklif kutilmoqda';
  if (task.agreedPrice !== null) return `Kelishilgan: ${formatSom(task.agreedPrice)}`;
  return EXCHANGE_STATUS_LABELS[task.status];
}

function TaskListItem({
  task,
  active,
  onSelect,
}: {
  task: ExchangeTask;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active}
      className={cn(
        'w-full rounded-xl border p-3 text-left transition-colors',
        active
          ? 'border-emerald-500/40 bg-emerald-500/8'
          : 'border-border bg-background hover:border-emerald-500/30 hover:bg-muted/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
          {task.title}
        </h3>
        <ExchangeStatusBadge status={task.status} className="shrink-0 scale-90" />
      </div>

      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {task.directionLabel} &middot; {formatDeadlineDays(task.deadline)} &middot;{' '}
        {task.referenceCode}
      </p>

      <p className="mt-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
        {footnoteFor(task)}
      </p>
    </button>
  );
}

function OffersPanel({ task, onBack }: { task: ExchangeTask; onBack: () => void }) {
  const { data: offers, isLoading } = useGetExchangeOffersQuery(task.id);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
      <header className="border-b border-border px-4 py-3.5">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-2 lg:hidden">
          <ArrowLeft className="size-4" />
          Topshiriqlar
        </Button>

        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          <Sparkles className="size-3" />
          Takliflar
        </p>
        <h3 className="mt-1 text-sm font-semibold text-foreground sm:text-base">{task.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {task.directionLabel} &middot; {formatDeadlineDays(task.deadline)}
        </p>

        {task.taskFile && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <FileText className="size-3.5" />
            {task.taskFile.fileName}
          </p>
        )}

        {task.comment && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{task.comment}</p>
        )}
      </header>

      <div className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <>
            <p className="mb-2.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              So&apos;rov yuborganlar ({offers.length})
            </p>
            <ul className="space-y-3">
              {offers.map((offer) => (
                <li
                  key={offer.id}
                  className="rounded-xl border border-border bg-card p-3.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {offer.freelancerName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">
                          {offer.freelancerRating.toFixed(1)}
                        </span>
                        &middot; {offer.freelancerCompletedWorks} ta ish
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {formatSom(offer.proposedPrice)}
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {offer.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Muddat: {formatDeadlineDays(offer.proposedDeadline)}
                    </span>
                    <Button variant="emerald" size="sm">
                      Kelishish
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-5 py-10 text-center">
            <Inbox className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Hali taklif yo&apos;q</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Freelancerlar tez orada javob beradi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
