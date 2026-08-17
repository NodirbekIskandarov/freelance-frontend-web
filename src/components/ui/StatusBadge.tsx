import { cn } from '@/lib/cn';
import { ORDER_STATUS_LABELS, type OrderStatus } from '@/shared/types/orders';

const tones: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  in_progress: 'bg-blue-500/12 text-blue-700 dark:text-blue-400',
  completed: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-destructive/12 text-destructive',
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
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
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
