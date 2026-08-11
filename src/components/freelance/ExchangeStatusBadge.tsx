import { cn } from '@/lib/cn';
import { EXCHANGE_STATUS_LABELS, type ExchangeTaskStatus } from '@/shared/types/freelance';

const tones: Record<ExchangeTaskStatus, string> = {
  yangi: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  takliflar_kelyapti: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
  kelishuvda: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  shartnoma_yaratildi: 'bg-violet-500/12 text-violet-700 dark:text-violet-400',
  tolov_kutilmoqda: 'bg-orange-500/12 text-orange-700 dark:text-orange-400',
  jarayonda: 'bg-blue-500/12 text-blue-700 dark:text-blue-400',
  yakunlandi: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  bekor_qilindi: 'bg-destructive/12 text-destructive',
};

export function ExchangeStatusBadge({
  status,
  className,
}: {
  status: ExchangeTaskStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        tones[status],
        className,
      )}
    >
      {EXCHANGE_STATUS_LABELS[status]}
    </span>
  );
}
