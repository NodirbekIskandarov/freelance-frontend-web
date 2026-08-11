'use client';

import { Clock, PiggyBank, Wallet } from 'lucide-react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { StatCard } from '@/components/ui/StatCard';
import { formatSom } from '@/lib/format';

import { useGetFreelancerEarningsQuery } from './freelancerApi';

export function FreelancerEarnings() {
  const { data, isLoading, error } = useGetFreelancerEarningsQuery();

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-[116px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Yechib olish mumkin"
          value={formatSom(data.availableBalance)}
          icon={Wallet}
          tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Ish yakunlanishini kutmoqda"
          value={formatSom(data.pendingBalance)}
          icon={Clock}
          tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Jami ishlangan"
          value={formatSom(data.totalEarned)}
          icon={PiggyBank}
          tone="bg-violet-500/12 text-violet-600 dark:text-violet-400"
        />
      </section>

      <p className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        Platforma komissiyasi — {Math.round(data.commissionRate * 100)}%. Yuqoridagi summalar
        komissiya ayrilgandan keyingi, ya&apos;ni qo&apos;lingizga tegadigan miqdor.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Tranzaksiyalar</h2>

        {data.entries.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Hali daromad yo&apos;q.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.entries.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">{entry.orderTitle}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground/80">
                    {entry.orderReference}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">
                    {formatSom(entry.amount)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    komissiya {formatSom(entry.commission)}
                  </div>
                </div>

                <span
                  className={
                    entry.paidAt
                      ? 'inline-flex rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400'
                      : 'inline-flex rounded-full bg-amber-500/12 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400'
                  }
                >
                  {entry.paidAt ? `To'landi ${entry.paidAt}` : 'Kutilmoqda'}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
