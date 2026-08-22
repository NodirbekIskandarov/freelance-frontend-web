'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  PiggyBank,
  Send,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { formatDecimalSom } from '@/lib/format';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  isCreditTransaction,
  TRANSACTION_TYPE_LABELS,
  WITHDRAWAL_METHOD_LABELS,
  WITHDRAWAL_METHODS,
  WITHDRAWAL_STATUS_LABELS,
  type WithdrawalMethod,
} from '@/shared/types/account';

import {
  useCreateWithdrawalMutation,
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useGetWithdrawalsQuery,
} from './accountApi';

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU').slice(0, 16);
}

function WithdrawModal({
  open,
  balance,
  onClose,
}: {
  open: boolean;
  balance: string;
  onClose: () => void;
}) {
  const [create, { isLoading, error }] = useCreateWithdrawalMutation();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawalMethod>('card');
  const [destination, setDestination] = useState('');
  const [name, setName] = useState('');

  const tooMuch = Number(amount) > Number(balance);
  const canSubmit = Boolean(amount.trim()) && Boolean(destination.trim()) && !tooMuch;

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      await create({
        amount: amount.trim(),
        method,
        destination: destination.trim(),
        destination_name: name.trim(),
      }).unwrap();
    } catch {
      return;
    }

    setAmount('');
    setDestination('');
    setName('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pul yechib olish"
      description={`Mavjud balans: ${formatDecimalSom(balance)}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button
            variant="emerald"
            disabled={isLoading || !canSubmit}
            onClick={() => void handleSubmit()}
          >
            {isLoading ? 'Yuborilmoqda…' : 'Yuborish'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label="Summa"
          required
          inputMode="decimal"
          placeholder="50000"
          value={amount}
          error={tooMuch ? 'Balansdan ortiq summa' : undefined}
          onChange={(event) => setAmount(event.target.value)}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Usul</span>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value as WithdrawalMethod)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            {WITHDRAWAL_METHODS.map((item) => (
              <option key={item} value={item}>
                {WITHDRAWAL_METHOD_LABELS[item]}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label={method === 'card' ? 'Karta raqami' : 'Telefon raqami'}
          required
          placeholder={method === 'card' ? '8600 XXXX XXXX XXXX' : '+998901234567'}
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />

        <TextField
          label="Karta egasi (ixtiyoriy)"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}
      </div>
    </Modal>
  );
}

export function WalletView() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: wallet, isLoading, error } = useGetWalletQuery();
  const { data: transactions } = useGetWalletTransactionsQuery({ page_size: 30 });
  const { data: withdrawals } = useGetWithdrawalsQuery({ page_size: 10 });

  if (error) return <ErrorNotice error={error} />;
  if (isLoading || !wallet) return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;

  return (
    <>
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <WalletIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Joriy balans</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatDecimalSom(wallet.balance)}
              </p>
            </div>
          </div>

          <Button
            variant="emerald"
            disabled={wallet.is_frozen || Number(wallet.balance) <= 0}
            onClick={() => setModalOpen(true)}
          >
            <Send className="size-4" />
            Pul yechish
          </Button>
        </div>

        {/* Muzlatilgan hamyonda amallar bloklanadi — sababi ko'rsatilishi kerak. */}
        {wallet.is_frozen && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
            Hamyoningiz vaqtincha muzlatilgan. Sabab bo&apos;yicha qo&apos;llab-quvvatlashga
            murojaat qiling.
          </p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "To'ldirilgan", value: wallet.totals.topped_up, icon: ArrowDownLeft },
            { label: 'Ishlangan', value: wallet.totals.earned, icon: PiggyBank },
            { label: 'Sarflangan', value: wallet.totals.spent, icon: ArrowUpRight },
            { label: 'Kutilayotgan', value: wallet.totals.pending_withdrawal, icon: Clock },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/60 bg-background p-3">
              <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <item.icon className="size-3.5" />
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-bold text-foreground tabular-nums">
                {formatDecimalSom(item.value)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {withdrawals && withdrawals.results.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground">Yechish so&apos;rovlari</h2>
          <div className="mt-4 grid gap-3">
            {withdrawals.results.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {formatDecimalSom(item.amount)}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {WITHDRAWAL_METHOD_LABELS[item.method]} &middot; {item.destination}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">
                    {item.reference} &middot; {formatDate(item.created_at)}
                  </p>
                  {item.admin_note && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.admin_note}</p>
                  )}
                </div>

                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    item.status === 'paid'
                      ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
                      : item.status === 'rejected'
                        ? 'bg-destructive/12 text-destructive'
                        : 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
                  )}
                >
                  {WITHDRAWAL_STATUS_LABELS[item.status]}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Tranzaksiyalar</h2>

        {!transactions || transactions.results.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Hali tranzaksiya yo&apos;q.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {transactions.results.map((transaction) => {
              const isCredit = isCreditTransaction(transaction.amount);

              return (
                <article
                  key={transaction.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background p-4 sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900/70"
                >
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-lg',
                      isCredit
                        ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1 basis-40">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {transaction.description || TRANSACTION_TYPE_LABELS[transaction.type]}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {TRANSACTION_TYPE_LABELS[transaction.type]} &middot;{' '}
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>

                  {/*
                    `ml-auto` va `shrink-0`: tor ekranda summa pastki
                    qatorga tushadi va o'ngda turadi — qatorni cho'zib
                    sahifani yon tomonga surib yubormaydi.
                  */}
                  <div className="ml-auto shrink-0 text-right">
                    {/* `formatDecimalSom` ishorani o'zi chiqaradi — qo'lda "−" qo'yilmaydi. */}
                    <div
                      className={cn(
                        'text-sm font-semibold whitespace-nowrap tabular-nums',
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                      )}
                    >
                      {formatDecimalSom(transaction.amount)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Qoldiq: {formatDecimalSom(transaction.balance_after)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <WithdrawModal
        open={modalOpen}
        balance={wallet.balance}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
