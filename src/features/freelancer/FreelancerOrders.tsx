'use client';

import { CalendarDays, Download, Upload } from 'lucide-react';
import { useState } from 'react';

import { TaskStatusBadge } from '@/components/freelance/TaskStatusBadge';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextAreaField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import {
  useDeliverTaskMutation,
  useGetMyJobsQuery,
  useGetTaskQuery,
} from '@/features/freelance/exchangeApi';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { taskStatusLabel, TASK_STATUSES, type TaskStatus } from '@/shared/types/exchange';
import type { ExchangeTask } from '@/shared/types/exchange';
import { workDirectionLabel } from '@/shared/types/publicFreelance';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

export function FreelancerOrders() {
  const { m } = useT();
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [deliverTask, setDeliverTask] = useState<ExchangeTask | null>(null);

  const { data, isLoading, error } = useGetMyJobsQuery({
    page_size: 50,
    ordering: '-created_at',
    ...(status !== 'all' ? { status } : {}),
  });

  if (error) return <ErrorNotice error={error} />;

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', ...TASK_STATUSES] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            aria-pressed={status === item}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              status === item
                ? 'bg-emerald-600 text-white'
                : 'border border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            {item === 'all' ? m.common.all : taskStatusLabel(item, m)}
          </button>
        ))}
      </div>

      {isLoading || !data ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">{m.ui.noAcceptedJobs}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.freelancerCabinet.noJobs}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.results.map((job) => (
            <JobCard key={job.id} job={job} onDeliver={() => setDeliverTask(job)} />
          ))}
        </div>
      )}

      <DeliverModal task={deliverTask} onClose={() => setDeliverTask(null)} />
    </>
  );
}

function JobCard({ job, onDeliver }: { job: ExchangeTask; onDeliver: () => void }) {
  const { m } = useT();
  const money = useMoney();
  // Fayl va daromad hisobi faqat tafsilotda keladi.
  const { data: detail } = useGetTaskQuery(job.id);

  return (
    <article className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-foreground">{job.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {job.client?.full_name ?? 'Mijoz'} &middot; {workDirectionLabel(job.direction, m)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <CalendarDays className="size-3.5" />
            {job.agreed_deadline_days ?? job.deadline_days} kun
            <span className="font-mono">&middot; {job.reference}</span>
          </p>
        </div>

        <TaskStatusBadge status={job.status} />

        <div className="text-right">
          <div className="text-sm font-semibold whitespace-nowrap text-foreground">
            {money.decimalSom(detail?.freelancer_earning ?? job.agreed_price)}
          </div>
          <div className="text-[11px] text-muted-foreground">{m.ui.youReceive}</div>
        </div>
      </div>

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

        {/* Topshirish faqat ish boshlangandan keyin; qayta topshirish ham
            mumkin, chunki mijoz uni qaytarib yuborishi mumkin. */}
        {(job.status === 'in_progress' || job.status === 'delivered') && (
          <Button variant="emerald" size="sm" onClick={onDeliver}>
            <Upload className="size-3.5" />
            {job.status === 'delivered'
              ? m.freelancerCabinet.deliverAgain
              : m.freelancerCabinet.deliver}
          </Button>
        )}
      </div>
    </article>
  );
}

function DeliverModal({ task, onClose }: { task: ExchangeTask | null; onClose: () => void }) {
  const { m } = useT();
  const [deliver, { isLoading, error, reset }] = useDeliverTaskMutation();
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);

  function close() {
    reset();
    onClose();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!task) return;

    try {
      await deliver({
        id: task.id,
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(file ? { file } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setNote('');
    setFile(null);
    close();
  }

  return (
    <Modal
      open={task !== null}
      onClose={close}
      title={m.freelancerCabinet.deliver}
      description={task?.title}
    >
      <form id="deliver-form" onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            {m.ui.deliveredFile}
          </span>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
          />
        </label>

        <TextAreaField
          label="Izoh"
          rows={4}
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={m.freelancerCabinet.deliverNotePlaceholder}
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
          form="deliver-form"
          variant="emerald"
          disabled={isLoading || (!file && !note.trim())}
        >
          {isLoading ? m.freelancerCabinet.delivering : m.freelancerCabinet.deliverSubmit}
        </Button>
      </div>
    </Modal>
  );
}
