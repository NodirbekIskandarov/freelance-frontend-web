'use client';

import { OrderStatusBadge } from '@/components/ui/StatusBadge';
import { formatSom } from '@/lib/format';
import { getApiErrorMessage } from '@/shared/api';

import { useGetStudentOrdersQuery } from './studentApi';

export function StudentOrders() {
  const { data, isLoading, error } = useGetStudentOrdersQuery();

  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {getApiErrorMessage(error)}
      </p>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Hali buyurtma yo&apos;q</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Katalogdan topshiriq tanlang va birinchi buyurtmangizni bering.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {data.map((order) => (
        <article
          key={order.id}
          className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground">{order.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {order.universityShort} &middot; {order.subjectName}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground/80">
              {order.reference} &middot; {order.createdAt}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
          <div className="text-sm font-semibold whitespace-nowrap text-foreground">
            {formatSom(order.amount)}
          </div>
        </article>
      ))}
    </div>
  );
}
