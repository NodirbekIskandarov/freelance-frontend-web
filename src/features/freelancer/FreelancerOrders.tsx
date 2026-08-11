'use client';

import { CalendarDays } from 'lucide-react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { OrderStatusBadge } from '@/components/ui/StatusBadge';
import { formatSom } from '@/lib/format';

import { useGetFreelancerOrdersQuery } from './freelancerApi';

export function FreelancerOrders() {
  const { data, isLoading, error } = useGetFreelancerOrdersQuery();

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Hali qabul qilingan ish yo&apos;q</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Birjadagi ochiq topshiriqlarga taklif yuboring — qabul qilingan ishlar shu yerda
          ko&apos;rinadi.
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
              {order.clientName} &middot; {order.directionLabel}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <CalendarDays className="size-3.5" />
              Topshirish: {order.deadline}
              <span className="font-mono">&middot; {order.reference}</span>
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
          <div className="text-right">
            <div className="text-sm font-semibold whitespace-nowrap text-foreground">
              {formatSom(order.payout)}
            </div>
            <div className="text-[11px] text-muted-foreground">qo&apos;lga tegadi</div>
          </div>
        </article>
      ))}
    </div>
  );
}
