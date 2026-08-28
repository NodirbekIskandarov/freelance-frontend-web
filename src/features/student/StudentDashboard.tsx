'use client';

import { BookMarked, CircleCheck, Download, ShoppingBag, Wallet } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { StatCard } from '@/components/ui/StatCard';
import { orderStatusLabel } from '@/shared/types/account';

import { useGetMyDashboardQuery } from '../account/accountApi';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

const statusTones: Record<string, string> = {
  paid: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  failed: 'bg-destructive/12 text-destructive',
  refunded: 'bg-blue-500/12 text-blue-700 dark:text-blue-400',
};

export function StudentDashboard() {
  const money = useMoney();
  const { m } = useT();
  const { data, isLoading, error } = useGetMyDashboardQuery();

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

  const { buying } = data;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={m.student.orders}
          value={String(buying.orders)}
          icon={ShoppingBag}
          tone="bg-blue-500/12 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label={m.student.paid}
          value={String(buying.paid)}
          icon={CircleCheck}
          tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label={m.student.library}
          value={String(buying.library_items)}
          icon={Download}
          tone="bg-violet-500/12 text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label={m.student.spentTotal}
          value={money.decimalSom(buying.spent_total)}
          icon={Wallet}
          tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
        />
      </section>

      {/* Sotuvchi ko'rsatkichlari faqat yechim yuklagan odamga ma'noli. */}
      {data.selling.total > 0 && (
        <section className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard
            label={m.student.uploadedSolutions}
            value={String(data.selling.total)}
            icon={BookMarked}
            tone="bg-cyan-500/12 text-cyan-600 dark:text-cyan-400"
          />
          <StatCard
            label={m.student.sales}
            value={String(data.selling.sales)}
            icon={ShoppingBag}
            tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label={m.student.earned}
            value={money.decimalSom(data.selling.earned_total)}
            icon={Wallet}
            tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
          />
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-foreground">{m.ui.recentOrders}</h2>
          <Link
            href="/student/orders"
            className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            {m.common.all}
          </Link>
        </div>

        {data.recent_orders.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            {m.student.noOrders}
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.recent_orders.map((order) => (
              <article
                key={order.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">{order.solution_title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.university_short_name} &middot; {order.subject_name} &middot;{' '}
                    {order.reference}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusTones[order.status] ?? 'bg-muted text-muted-foreground'}`}
                >
                  {orderStatusLabel(order.status, m)}
                </span>

                <div className="text-sm font-semibold whitespace-nowrap text-foreground">
                  {money.decimalSom(order.unit_price)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
