'use client';

import { Clock, PiggyBank, Wallet } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { StatCard } from '@/components/ui/StatCard';
import { useGetWalletQuery, useGetWalletTransactionsQuery } from '@/features/account/accountApi';
import { TRANSACTION_TYPE_LABELS } from '@/shared/types/account';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';
import { useDates } from '@/lib/useDates';

/**
 * Daromad sahifasi hamyon ustiga qurilgan — backendda alohida
 * "freelancer daromadi" endpoint'i yo'q, pul oqimi bitta hamyondan
 * o'tadi. Bu yerda faqat SOTUV tomonidagi tranzaksiyalar ko'rsatiladi;
 * to'liq tarix va yechib olish `/wallet` sahifasida.
 */
export function FreelancerEarnings() {
  const dates = useDates();
  const { m } = useT();
  const money = useMoney();
  const { data: wallet, isLoading, error } = useGetWalletQuery();
  const { data: sales } = useGetWalletTransactionsQuery({
    page_size: 30,
    ordering: '-created_at',
    type: 'escrow_release',
  });

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !wallet) {
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
          label="Balans"
          value={money.decimalSom(wallet.balance)}
          icon={Wallet}
          tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label={m.freelancerCabinet.pendingWithdrawal}
          value={money.decimalSom(wallet.totals.pending_withdrawal)}
          icon={Clock}
          tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label={m.freelancerCabinet.earnedTotal}
          value={money.decimalSom(wallet.totals.earned)}
          icon={PiggyBank}
          tone="bg-violet-500/12 text-violet-600 dark:text-violet-400"
        />
      </section>

      <p className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {m.freelancerCabinet.commissionNote}{' '}
        <Link
          href="/wallet"
          className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Hamyon
        </Link>{' '}
        bo&apos;limida.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">{m.ui.completedJobsPayment}</h2>

        {!sales || sales.results.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            {m.freelancerCabinet.noEarnings}
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {sales.results.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-foreground">
                    {entry.description || TRANSACTION_TYPE_LABELS[entry.type]}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    {dates.dateTime(entry.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    +{money.decimalSom(entry.amount)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    balans: {money.decimalSom(entry.balance_after)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
