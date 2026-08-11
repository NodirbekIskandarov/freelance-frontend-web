'use client';

import { ArrowDownLeft, ArrowUpRight, RotateCcw, Wallet } from 'lucide-react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { cn } from '@/lib/cn';
import { formatSom } from '@/lib/format';
import { WALLET_TRANSACTION_LABELS, type WalletTransactionType } from '@/shared/types/account';

import { useGetWalletQuery } from './accountApi';

const icons: Record<WalletTransactionType, typeof ArrowDownLeft> = {
  topup: ArrowDownLeft,
  purchase: ArrowUpRight,
  refund: RotateCcw,
};

export function WalletView() {
  const { data, isLoading, error } = useGetWalletQuery();

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <>
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Wallet className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Joriy balans</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {formatSom(data.balance)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Balansni to&apos;ldirish hozircha karta orqali qo&apos;lda amalga oshiriladi:
          to&apos;lovni bajarib, chek skrinshotini murojaat sifatida yuboring — admin tasdiqlagach
          summa balansga tushadi.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Tranzaksiyalar</h2>

        {data.transactions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Hali tranzaksiya yo&apos;q.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.transactions.map((transaction) => {
              const Icon = icons[transaction.type];
              const isCredit = transaction.amount > 0;

              return (
                <article
                  key={transaction.id}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
                >
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-lg',
                      isCredit
                        ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {transaction.description}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {WALLET_TRANSACTION_LABELS[transaction.type]} &middot;{' '}
                      {transaction.createdAt}
                    </p>
                  </div>

                  {/*
                    Manfiy summa oldiga qo'lda "−" qo'yilmaydi: `formatSom`
                    ishorani o'zi chiqaradi, ikkitasi bo'lib qolardi.
                  */}
                  <span
                    className={cn(
                      'text-sm font-semibold whitespace-nowrap tabular-nums',
                      isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                    )}
                  >
                    {isCredit && '+'}
                    {formatSom(transaction.amount)}
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
