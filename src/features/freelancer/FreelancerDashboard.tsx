'use client';

import { Briefcase, CircleCheck, Star, Wallet } from 'lucide-react';
import Link from 'next/link';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { StatCard } from '@/components/ui/StatCard';
import { OrderStatusBadge } from '@/components/ui/StatusBadge';
import { formatSom } from '@/lib/format';

import { useGetFreelancerDashboardQuery } from './freelancerApi';

export function FreelancerDashboard() {
  const { data, isLoading, error } = useGetFreelancerDashboardQuery();

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-[116px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Faol ishlar"
          value={String(data.stats.activeOrders)}
          icon={Briefcase}
          tone="bg-blue-500/12 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Yakunlangan"
          value={String(data.stats.completedOrders)}
          icon={CircleCheck}
          tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Reyting"
          value={data.stats.rating.toFixed(1)}
          icon={Star}
          tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Kutilayotgan to'lov"
          value={formatSom(data.stats.pendingPayout)}
          icon={Wallet}
          tone="bg-violet-500/12 text-violet-600 dark:text-violet-400"
        />
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-foreground">So&apos;nggi ishlar</h2>
          <Link
            href="/freelancer/orders"
            className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Barchasi
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {data.recentOrders.map((order) => (
            <article
              key={order.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-foreground">{order.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.clientName} &middot; {order.directionLabel} &middot; {order.reference}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
              <div className="text-sm font-semibold whitespace-nowrap text-foreground">
                {formatSom(order.payout)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
