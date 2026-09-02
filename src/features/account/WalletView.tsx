'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  PiggyBank,
  Plus,
  Send,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
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
import { DisputesAgainstMe } from '@/features/disputes/DisputesAgainstMe';
import { HeldEarnings } from '@/features/disputes/HeldEarnings';

import { DepositModal } from './DepositModal';
import { useT } from '@/i18n/useT';
import { useMoney } from '@/lib/useMoney';
import { useDates } from '@/lib/useDates';

function WithdrawModal({
  open,
  balance,
  onClose,
}: {
  open: boolean;
  balance: string;
  onClose: () => void;
}) {
  const { m } = useT();
  const money = useMoney();
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
      title={m.wallet.withdrawTitle}
      description={`Mavjud balans: ${money.decimalSom(balance)}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {m.common.cancel}
          </Button>
          <Button
            variant="emerald"
            disabled={isLoading || !canSubmit}
            onClick={() => void handleSubmit()}
          >
            {isLoading ? m.wallet.sending : m.wallet.send}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          label={m.wallet.amount}
          required
          inputMode="decimal"
          placeholder="50000"
          value={amount}
          error={tooMuch ? m.wallet.overBalance : undefined}
          onChange={(event) => setAmount(event.target.value)}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">{m.wallet.method}</span>
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
          label={method === 'card' ? m.wallet.methodCard : m.wallet.methodPhone}
          required
          placeholder={method === 'card' ? '8600 XXXX XXXX XXXX' : '+998901234567'}
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />

        <TextField
          label={m.wallet.cardHolder}
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
  const dates = useDates();
  const { m } = useT();
  const money = useMoney();
  const [modalOpen, setModalOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [direction, setDirection] = useState<'all' | 'in' | 'out'>('all');

  const { data: wallet, isLoading, error } = useGetWalletQuery();
  const { data: transactions } = useGetWalletTransactionsQuery({ page_size: 30 });
  const { data: withdrawals } = useGetWithdrawalsQuery({ page_size: 10 });

  /* Ishora bo'yicha saralash — sabab quyida, filtr tugmalari yonida. */
  const visibleTransactions = (transactions?.results ?? []).filter((transaction) => {
    if (direction === 'all') return true;
    const credit = isCreditTransaction(transaction.amount);
    return direction === 'in' ? credit : !credit;
  });

  if (error) return <ErrorNotice error={error} />;
  if (isLoading || !wallet) return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;

  return (
    <>
      {/*
        Balans kartasi — sahifaning yagona asosiy raqami.

        Gradient tokenlardan yasaladi, qat'iy hexdan emas: sayt yorug' va
        qorong'i mavzuda ham ishlaydi va bittasida karta o'qilmay qolishi
        mumkin emas.
      */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] via-emerald-500/[0.05] to-transparent p-5 sm:p-6">
        {/* Yumshoq yorug'lik — kartaga chuqurlik beradi, matnga tegmaydi. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-emerald-500/15 blur-3xl"
        />

        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <WalletIcon className="size-3.5" />
            {m.wallet.balance}
          </p>

          {/* Raqam iyerarxiyaning cho'qqisi: sahifadagi eng katta matn. */}
          <p className="mt-2 text-[34px] leading-none font-bold tracking-tight text-foreground tabular-nums sm:text-[40px]">
            {money.decimalSom(wallet.balance)}
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            {/*
              Ikkita amal, biri asosiy. Ilgari faqat «Pul yechish» bor
              edi va balansga pul QANDAY tushishi ekranda hech qayerda
              aytilmasdi.
            */}
            <Button variant="emerald" className="flex-1" onClick={() => setDepositOpen(true)}>
              <Plus className="size-4" />
              {m.wallet.deposit}
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              disabled={wallet.is_frozen || Number(wallet.balance) <= 0}
              title={Number(wallet.balance) <= 0 ? m.wallet.withdrawNothing : undefined}
              onClick={() => setModalOpen(true)}
            >
              <Send className="size-4" />
              {m.wallet.withdraw}
            </Button>
          </div>

          {/* Muzlatilgan hamyonda amallar bloklanadi — sababi ko'rsatilishi kerak. */}
          {wallet.is_frozen && (
            <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
              {m.wallet.frozen}
            </p>
          )}
        </div>
      </section>

      {/* Telefonda 2×2, kengroq ekranda bitta qator. */}
      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: m.wallet.toppedUp,
            value: wallet.totals.topped_up,
            icon: ArrowDownLeft,
            tone: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: m.wallet.earned,
            value: wallet.totals.earned,
            icon: PiggyBank,
            tone: 'text-emerald-600 dark:text-emerald-400',
          },
          { label: m.wallet.spent, value: wallet.totals.spent, icon: ArrowUpRight, tone: '' },
          {
            label: m.wallet.pending,
            value: wallet.totals.pending_withdrawal,
            icon: Clock,
            tone: '',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/70 bg-card p-3.5">
            <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <item.icon className={cn('size-3.5', item.tone)} />
              {item.label}
            </dt>
            <dd className="mt-1.5 text-[15px] font-bold text-foreground tabular-nums">
              {money.decimalSom(item.value)}
            </dd>
          </div>
        ))}
      </dl>

      {/* «Hold» — sotilgan, lekin hali balansga tushmagan pul. Balansning
          ostida turadi: savol aynan shu ikki raqamni solishtirganda
          tug'iladi. */}
      <div className="mt-6 space-y-6">
        <HeldEarnings />
        {/* Nizo — pul nega ushlanib turganining sababi, shuning uchun u
            aynan shu yerda: odam «balansim qani» deb kelgan joyda. */}
        <DisputesAgainstMe />
      </div>

      {withdrawals && withdrawals.results.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground">{m.wallet.withdrawals}</h2>
          <div className="mt-4 grid gap-3">
            {withdrawals.results.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {money.decimalSom(item.amount)}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {WITHDRAWAL_METHOD_LABELS[item.method]} &middot; {item.destination}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">
                    {item.reference} &middot; {dates.dateTime(item.created_at)}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">{m.wallet.transactions}</h2>

          {/*
            Kirim/chiqim JOYIDA saralanadi, serverda emas.

            Backend `?type=` bo'yicha filtrlaydi, yo'nalish esa tur emas:
            `adjustment` ikkala tomonga ham ketadi va bitta tur bilan uni
            ajratib bo'lmaydi. Yagona ishonchli manba — summaning ishorasi,
            u esa allaqachon qo'lda. Ro'yxat bitta odamniki va o'ttizta
            yozuv bilan cheklangan, ya'ni bu arzon.
          */}
          <div
            role="group"
            aria-label={m.wallet.transactions}
            className="flex gap-1 rounded-full border border-border/70 p-1"
          >
            {(
              [
                ['all', m.wallet.filterAll],
                ['in', m.wallet.filterIn],
                ['out', m.wallet.filterOut],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={direction === value}
                onClick={() => setDirection(value)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  direction === value
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visibleTransactions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            {/* «Umuman yo'q» va «bu filtrda yo'q» — boshqa-boshqa gap. */}
            {transactions && transactions.results.length > 0
              ? m.wallet.filterEmpty
              : m.wallet.noTransactions}
          </p>
        ) : (
          <div className="mt-4 grid gap-2.5">
            {visibleTransactions.map((transaction) => {
              const isCredit = isCreditTransaction(transaction.amount);

              return (
                <article
                  key={transaction.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 sm:gap-4"
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

                  {/*
                    `basis` YO'Q: u matn blokini 10rem'dan kichrayishga
                    qo'ymasdi va 390px ekranda summa alohida qatorga
                    tushib, har yozuv ikki barobar baland bo'lardi.
                    Endi sarlavha qisqaradi, summa esa yonida qoladi.
                  */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {transaction.description || TRANSACTION_TYPE_LABELS[transaction.type]}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      {/* Tur — yorliq, oddiy matn emas: qatorda u sarlavha
                          bilan qo'shilib ketmasin. */}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {TRANSACTION_TYPE_LABELS[transaction.type]}
                      </span>
                      {dates.dateTime(transaction.created_at)}
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
                      {money.decimalSom(transaction.amount)}
                    </div>
                    <div className="text-[11px] whitespace-nowrap text-muted-foreground">
                      {m.wallet.balanceAfter}: {money.decimalSom(transaction.balance_after)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />

      <WithdrawModal
        open={modalOpen}
        balance={wallet.balance}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
