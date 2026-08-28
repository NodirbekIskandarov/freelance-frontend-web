'use client';

import { useState } from 'react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { cn } from '@/lib/cn';
import { ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from '@/shared/types/account';

import { useGetMyOrdersQuery } from '../account/accountApi';
import { useMoney } from '@/lib/useMoney';

const statusTones: Record<OrderStatus, string> = {
  paid: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  failed: 'bg-destructive/12 text-destructive',
  refunded: 'bg-blue-500/12 text-blue-700 dark:text-blue-400',
};

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU').slice(0, 16);
}

export function StudentOrders() {
  const money = useMoney();
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');

  const { data, isLoading, error } = useGetMyOrdersQuery({
    page_size: 50,
    ordering: '-created_at',
    ...(status !== 'all' ? { status } : {}),
  });

  if (error) return <ErrorNotice error={error} />;

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', ...ORDER_STATUSES] as const).map((item) => (
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
            {item === 'all' ? 'Barchasi' : ORDER_STATUS_LABELS[item]}
          </button>
        ))}
      </div>

      {isLoading || !data ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Buyurtma topilmadi</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Katalogdan yechim tanlang va birinchi buyurtmangizni bering.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.results.map((order) => (
            <article
              key={order.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-foreground">{order.solution_title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.university_short_name} &middot; {order.subject_name} &middot;{' '}
                  {order.assignment_title} &middot; {order.variant_label}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground/80">
                  {order.reference} &middot; {formatDate(order.paid_at ?? order.created_at)}
                </p>
              </div>

              <span
                className={cn(
                  'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                  statusTones[order.status],
                )}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>

              <div className="text-sm font-semibold whitespace-nowrap text-foreground">
                {money.decimalSom(order.unit_price)}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
