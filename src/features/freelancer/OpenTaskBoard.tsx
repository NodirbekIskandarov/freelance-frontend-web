'use client';

import { Download, Inbox, Search, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useGetTaskQuery, useSubmitOfferMutation } from '@/features/freelance/exchangeApi';
import { useGetOpenTasksQuery } from '@/features/freelance/exchangeApi';
import { DEADLINE_OPTIONS, type DeadlineDays, type ExchangeTask } from '@/shared/types/exchange';
import {
  workDirectionLabel,
  WORK_DIRECTIONS,
  type WorkDirection,
} from '@/shared/types/publicFreelance';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

export function OpenTaskBoard() {
  const { m } = useT();

  /* Ro'yxatlar komponent ICHIDA: yorliqlar tilga bog'liq. */
  const directionOptions = [
    { value: '', label: m.freelance.allDirections },
    ...WORK_DIRECTIONS.map((value) => ({ value, label: workDirectionLabel(value, m) })),
  ];

  const [direction, setDirection] = useState('');
  const [search, setSearch] = useState('');
  const [offerTask, setOfferTask] = useState<ExchangeTask | null>(null);

  const { data, isLoading, error } = useGetOpenTasksQuery({
    page_size: 30,
    ordering: '-created_at',
    ...(direction ? { direction: direction as WorkDirection } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  if (error) return <ErrorNotice error={error} />;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="relative flex-1">
          <span className="sr-only">Qidiruv</span>
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={m.freelancerCabinet.searchTasks}
            className="h-11 w-full rounded-lg border border-border bg-background pr-3.5 pl-9 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-emerald-500/60"
          />
        </label>

        <SelectField
          label={m.freelancerCabinet.direction}
          className="sm:w-56"
          options={directionOptions}
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Ochiq topshiriq topilmadi</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.freelancerCabinet.noTasks}</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {data.results.map((task) => (
            <TaskCard key={task.id} task={task} onOffer={() => setOfferTask(task)} />
          ))}
        </div>
      )}

      <OfferModal task={offerTask} onClose={() => setOfferTask(null)} />
    </>
  );
}

function TaskCard({ task, onOffer }: { task: ExchangeTask; onOffer: () => void }) {
  const { m } = useT();
  const money = useMoney();
  // Fayl faqat tafsilotda keladi — kartani ochmasdan ham ko'rsatish uchun
  // yengil so'rov yuboriladi; RTK Query uni kesh orqali bir marta oladi.
  const { data: detail } = useGetTaskQuery(task.id);

  return (
    <article className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-foreground">{task.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {workDirectionLabel(task.direction, m)} &middot; {task.deadline_days} kun &middot;{' '}
            <span className="font-mono">{task.reference}</span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {task.budget !== null ? money.decimalSom(task.budget) : m.freelance.negotiable}
          </div>
          <div className="text-[11px] text-muted-foreground">{task.offer_count} ta taklif</div>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {detail?.task_file ? (
          <a
            href={detail.task_file}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Download className="size-3.5" />
            Topshiriq fayli
          </a>
        ) : (
          <span />
        )}

        <Button variant="emerald" size="sm" onClick={onOffer}>
          <Send className="size-3.5" />
          {m.freelancerCabinet.sendOffer}
        </Button>
      </div>
    </article>
  );
}

function OfferModal({ task, onClose }: { task: ExchangeTask | null; onClose: () => void }) {
  const { t, m } = useT();

  const deadlineOptions = DEADLINE_OPTIONS.map((days) => ({
    value: String(days),
    label: t((x) => x.freelance.days, { count: days }),
  }));

  const money = useMoney();
  const [submitOffer, { isLoading, error, reset }] = useSubmitOfferMutation();
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('7');
  const [message, setMessage] = useState('');

  function close() {
    reset();
    onClose();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!task) return;

    try {
      await submitOffer({
        taskId: task.id,
        price: price.trim(),
        deadline_days: Number(deadline) as DeadlineDays,
        message: message.trim(),
      }).unwrap();
    } catch {
      return;
    }

    setPrice('');
    setMessage('');
    close();
  }

  return (
    <Modal
      open={task !== null}
      onClose={close}
      title={m.freelancerCabinet.sendOffer}
      description={task?.title}
    >
      <form id="offer-form" onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={m.freelancerCabinet.offerPrice}
            type="number"
            required
            min={1000}
            step={1000}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="250000"
            hint={
              task?.budget !== null && task?.budget !== undefined
                ? `Mijoz budjeti: ${money.decimalSom(task.budget)}`
                : undefined
            }
          />
          <SelectField
            label={m.exchange.deadline}
            required
            options={deadlineOptions}
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </div>

        <TextAreaField
          label="Xabar"
          required
          rows={4}
          maxLength={1000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={m.freelancerCabinet.offerMessagePlaceholder}
          hint={`${message.length}/1000`}
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}
      </form>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={close}>
          {m.common.cancel}
        </Button>
        <Button
          type="submit"
          form="offer-form"
          variant="emerald"
          disabled={isLoading || !price.trim() || !message.trim()}
        >
          {isLoading ? m.freelancerCabinet.sending : m.freelancerCabinet.send}
        </Button>
      </div>
    </Modal>
  );
}
