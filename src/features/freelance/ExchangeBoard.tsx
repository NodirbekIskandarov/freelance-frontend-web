'use client';

import {
  ArrowLeft,
  ClipboardList,
  Download,
  Inbox,
  Plus,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useState } from 'react';

import { OfferStatusBadge, TaskStatusBadge } from '@/components/freelance/TaskStatusBadge';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Modal } from '@/components/ui/Modal';
import { TextAreaField } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { ExchangeOffer, ExchangeTask } from '@/shared/types/exchange';
import { workDirectionLabel } from '@/shared/types/publicFreelance';

import { CreateTaskDialog } from './CreateTaskDialog';
import { ReviewTaskModal } from './ReviewTaskModal';
import {
  useAcceptOfferMutation,
  useCancelTaskMutation,
  useCompleteTaskMutation,
  useGetMyTasksQuery,
  useGetTaskOffersQuery,
  useGetTaskQuery,
} from './exchangeApi';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';
import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';

export function ExchangeBoard() {
  const { m } = useT();
  const { data, isLoading, error } = useGetMyTasksQuery({
    page_size: 50,
    ordering: '-created_at',
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const tasks = data?.results;

  /*
   * Tanlangan topshiriq ro'yxatdan qidiriladi, alohida state'da
   * saqlanmaydi: aks holda topshiriq yangilangach panel eski nusxani
   * ko'rsatib turardi.
   */
  const selected = tasks?.find((task) => task.id === selectedId) ?? null;
  const totalOffers = tasks?.reduce((sum, task) => sum + task.offer_count, 0) ?? 0;

  if (error) return <ErrorNotice error={error} />;

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
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{m.exchange.lead}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatPill
              icon={<ClipboardList className="size-3.5" />}
              value={data?.count ?? 0}
              label="Topshiriq"
            />
            <StatPill
              icon={<Sparkles className="size-3.5" />}
              value={totalOffers}
              label={m.exchange.offer}
              accent
            />
            <Button variant="emerald" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              {m.exchange.createTask}
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Mening topshiriqlarim</h2>
            <p className="text-[11px] text-muted-foreground lg:hidden">{m.exchange.clickTask}</p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {data?.count ?? 0} ta
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
              className={cn('border-border p-3 sm:p-4 lg:border-r', selected && 'hidden lg:block')}
            >
              <ul className="space-y-2">
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
                <TaskPanel task={selected} onBack={() => setSelectedId(null)} />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-5 py-10 text-center">
                  <Search className="size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">Topshiriqni tanlang</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.exchange.pickFromList}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-12 text-center">
            <Inbox className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Hali topshiriq yo&apos;q</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.exchange.firstTaskHint}</p>
            <Button variant="emerald" onClick={() => setDialogOpen(true)} className="mt-4">
              <Plus className="size-4" />
              {m.exchange.createTask}
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

/*
 * Faqat `offer_count`ga qarab yozuv chiqarish yetarli emas edi: taklifsiz
 * yakunlangan topshiriq ham "Taklif kutilmoqda" deb turardi. Yozuv
 * topshiriq holatidan kelib chiqadi.
 */
function footnoteFor(
  task: ExchangeTask,
  money: ReturnType<typeof useMoney>,
  messages: Messages,
): string {
  if (task.agreed_price !== null) {
    return interpolate(messages.exchange.agreedPrice, {
      price: money.decimalSom(task.agreed_price),
    });
  }
  if (task.status === 'open') {
    return task.offer_count > 0
      ? interpolate(messages.exchange.offerCount, { count: task.offer_count })
      : messages.exchange.waitingOffers;
  }
  return task.budget !== null
    ? interpolate(messages.exchange.budget, { price: money.decimalSom(task.budget) })
    : '';
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
  const { m } = useT();
  const money = useMoney();

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
        <TaskStatusBadge status={task.status} className="shrink-0 scale-90" />
      </div>

      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {workDirectionLabel(task.direction, m)} &middot; {task.deadline_days} kun &middot;{' '}
        {task.reference}
      </p>

      <p className="mt-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
        {footnoteFor(task, money, m)}
      </p>
    </button>
  );
}

function TaskPanel({ task, onBack }: { task: ExchangeTask; onBack: () => void }) {
  const { t, m } = useT();
  const money = useMoney();
  // Tafsilot alohida so'raladi: ro'yxat javobida fayl va komissiya yo'q.
  const { data: detail } = useGetTaskQuery(task.id);
  const { data: offers, isLoading } = useGetTaskOffersQuery(task.id, {
    // Taklif faqat topshiriq ochiq turganda kelishi mumkin.
    skip: task.status !== 'open',
  });

  const [completeTask, complete] = useCompleteTaskMutation();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
      <header className="border-b border-border px-4 py-3.5">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 lg:hidden">
          <ArrowLeft className="size-4" />
          {m.exchange.tasks}
        </Button>

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">{task.title}</h3>
          <TaskStatusBadge status={task.status} className="shrink-0" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {workDirectionLabel(task.direction, m)} &middot; {task.deadline_days} kun &middot;{' '}
          <span className="font-mono">{task.reference}</span>
        </p>

        {task.description && (
          <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
            {task.description}
          </p>
        )}

        {detail?.task_file && (
          <a
            href={detail.task_file}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted/70"
          >
            <Download className="size-3.5" />
            Topshiriq fayli
          </a>
        )}

        {task.freelancer && (
          <p className="mt-2 text-xs text-muted-foreground">
            Bajaruvchi:{' '}
            <span className="font-medium text-foreground">{task.freelancer.full_name}</span>
            {task.agreed_price && <> &middot; {money.decimalSom(task.agreed_price)}</>}
          </p>
        )}

        {(task.status === 'open' ||
          task.status === 'in_progress' ||
          task.status === 'delivered') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {task.status === 'delivered' && (
              <Button
                variant="emerald"
                size="sm"
                disabled={complete.isLoading}
                onClick={() => void completeTask(task.id)}
              >
                {complete.isLoading ? m.exchange.completing : m.exchange.acceptAndComplete}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setCancelOpen(true)}>
              Bekor qilish
            </Button>
          </div>
        )}

        {/* Sharh faqat ish yakunlangach — baho bajarilgan ishga beriladi. */}
        {task.status === 'completed' && task.freelancer && (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
              <Star className="size-3.5" />
              Bajaruvchini baholash
            </Button>
          </div>
        )}

        {complete.error && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {getApiErrorMessage(complete.error)}
          </p>
        )}
      </header>

      {detail?.delivery_note && (
        <div className="border-b border-border bg-violet-500/5 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {m.exchange.deliveryNote}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-foreground">{detail.delivery_note}</p>
          {detail.delivery_file && (
            <a
              href={detail.delivery_file}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              <Download className="size-3.5" />
              {m.exchange.downloadDelivery}
            </a>
          )}
        </div>
      )}

      {task.status === 'open' && (
        <div className="flex-1 px-4 py-4">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((index) => (
                <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : offers && offers.results.length > 0 ? (
            <>
              <p className="mb-2.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                {t((x) => x.exchange.offersWithCount, { count: offers.count })}
              </p>
              <ul className="space-y-3">
                {offers.results.map((offer) => (
                  <li key={offer.id}>
                    <OfferCard offer={offer} taskId={task.id} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-5 py-10 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">Hali taklif yo&apos;q</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.exchange.freelancersSoon}</p>
            </div>
          )}
        </div>
      )}

      <CancelTaskModal taskId={task.id} open={cancelOpen} onClose={() => setCancelOpen(false)} />
      <ReviewTaskModal task={reviewOpen ? task : null} onClose={() => setReviewOpen(false)} />
    </div>
  );
}

function OfferCard({ offer, taskId }: { offer: ExchangeOffer; taskId: string }) {
  const { m } = useT();
  const money = useMoney();
  const [acceptOffer, { isLoading, error }] = useAcceptOfferMutation();

  return (
    <article className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {offer.freelancer.full_name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{offer.freelancer_rating}</span>
            &middot; {offer.freelancer_completed_jobs} ta ish
          </p>
        </div>
        <p className="shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          {money.decimalSom(offer.price)}
        </p>
      </div>

      {offer.message && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{offer.message}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">Muddat: {offer.deadline_days} kun</span>
        {offer.status === 'pending' ? (
          <Button
            variant="emerald"
            size="sm"
            disabled={isLoading}
            onClick={() => void acceptOffer({ id: offer.id, taskId })}
          >
            {isLoading ? m.exchange.accepting : m.exchange.accept}
          </Button>
        ) : (
          <OfferStatusBadge status={offer.status} />
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {getApiErrorMessage(error)}
        </p>
      )}
    </article>
  );
}

function CancelTaskModal({
  taskId,
  open,
  onClose,
}: {
  taskId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { m } = useT();
  const [cancelTask, { isLoading, error, reset }] = useCancelTaskMutation();
  const [reason, setReason] = useState('');

  function close() {
    reset();
    onClose();
  }

  async function submit() {
    try {
      await cancelTask({
        id: taskId,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      }).unwrap();
    } catch {
      return;
    }
    setReason('');
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={m.exchange.cancelTitle}
      description={m.exchange.cancelDesc}
      footer={
        <>
          <Button variant="outline" onClick={close}>
            {m.common.close}
          </Button>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            disabled={isLoading}
            onClick={() => void submit()}
          >
            {isLoading ? m.exchange.cancelling : m.common.cancel}
          </Button>
        </>
      }
    >
      <TextAreaField
        label="Sabab"
        rows={3}
        maxLength={500}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={m.exchange.cancelReasonPlaceholder}
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      )}
    </Modal>
  );
}
