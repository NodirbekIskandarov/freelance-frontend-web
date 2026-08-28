'use client';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import {
  offerStatusLabel,
  taskStatusLabel,
  type OfferStatus,
  type TaskStatus,
} from '@/shared/types/exchange';

const taskTones: Record<TaskStatus, string> = {
  open: 'bg-blue-500/12 text-blue-700 dark:text-blue-400',
  in_progress: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  delivered: 'bg-violet-500/12 text-violet-700 dark:text-violet-400',
  completed: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-destructive/12 text-destructive',
};

const offerTones: Record<OfferStatus, string> = {
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  accepted: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  declined: 'bg-destructive/12 text-destructive',
  withdrawn: 'bg-muted text-muted-foreground',
};

const base =
  'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap leading-none';

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const { m } = useT();

  return (
    <span className={cn(base, taskTones[status], className)}>{taskStatusLabel(status, m)}</span>
  );
}

export function OfferStatusBadge({
  status,
  className,
}: {
  status: OfferStatus;
  className?: string;
}) {
  const { m } = useT();

  return (
    <span className={cn(base, offerTones[status], className)}>{offerStatusLabel(status, m)}</span>
  );
}
