'use client';

import { CheckCircle2, Lock, RotateCcw, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { useNow } from '@/lib/useNow';
import type { Messages } from '@/i18n/messages/uz';
import { SALE_STATUSES, type Sale, type SaleStatus } from '@/shared/types/sales';

import { useGetMySalesQuery } from '@/features/disputes/disputesApi';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

type Filter = 'all' | SaleStatus;

const STATUS_LABEL: Record<SaleStatus, (m: Messages) => string> = {
  held: (m) => m.sales.statusHeld,
  released: (m) => m.sales.statusReleased,
  disputed: (m) => m.sales.statusDisputed,
  refunded: (m) => m.sales.statusRefunded,
  partially_refunded: (m) => m.sales.statusPartiallyRefunded,
};

const STATUS_TONE: Record<SaleStatus, string> = {
  held: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  released: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  disputed: 'bg-destructive/12 text-destructive dark:text-red-400',
  refunded: 'bg-muted text-muted-foreground',
  partially_refunded: 'bg-muted text-muted-foreground',
};

const STATUS_ICON: Record<SaleStatus, typeof Lock> = {
  held: Lock,
  released: CheckCircle2,
  disputed: ShieldAlert,
  refunded: RotateCcw,
  partially_refunded: RotateCcw,
};

/**
 * Ochilishigacha qancha qolgani.
 *
 * SOAT MIJOZNIKI, ya'ni u noto'g'ri bo'lishi mumkin — shuning uchun bu
 * faqat IZOH. Kartaning holati serverdan keladi (`sale.status`) va
 * qolgan vaqt nolga tushgani bilan «chiqarildi» bo'lib qolmaydi: telefoni
 * bir kunga oldinda ketgan odam hali ushlab turilgan pulni «keldi» deb
 * o'qimasligi kerak. Manfiy qiymat ham ko'rsatilmaydi — u «hozir
 * ochilmoqda» bo'ladi, chunki server supurishi soatiga bir ishlaydi.
 */
function remaining(iso: string, now: number, m: Messages): string {
  const left = new Date(iso).getTime() - now;
  if (Number.isNaN(left)) return '';
  if (left <= 0) return m.sales.remainingDue;

  const days = Math.floor(left / DAY);
  const hours = Math.floor((left % DAY) / HOUR);
  if (days > 0) {
    return m.sales.remainingDays.replace('{days}', String(days)).replace('{hours}', String(hours));
  }
  if (hours > 0) return m.sales.remainingHours.replace('{hours}', String(hours));
  return m.sales.remainingSoon;
}

/** Kutish qancha bosib o'tilgani — 0…1. */
function progress(sale: Sale, now: number): number {
  if (!sale.releases_at) return 0;

  const end = new Date(sale.releases_at).getTime();
  const start = new Date(sale.paid_at).getTime();
  if (!Number.isFinite(end) || !Number.isFinite(start) || end <= start) return 0;

  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}

function SaleCard({ sale }: { sale: Sale }) {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();
  const now = useNow();

  const Icon = STATUS_ICON[sale.status];
  const held = sale.status === 'held';
  const title = [sale.solution_title, sale.variant_label].filter(Boolean).join(' · ');

  return (
    <article className="rounded-xl border border-border/70 bg-card p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <h3 className="min-w-0 flex-1 text-sm font-semibold text-foreground">{title}</h3>
        <p
          className={cn(
            'shrink-0 text-sm font-bold tabular-nums',
            sale.status === 'refunded'
              ? 'text-muted-foreground line-through'
              : 'text-emerald-700 dark:text-emerald-400',
          )}
        >
          +{money.decimalSom(sale.seller_earning)}
        </p>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="font-mono text-[11px] text-muted-foreground/80">
          {sale.order_reference}
        </span>
        <span className="text-[11px] text-muted-foreground">{dates.date(sale.paid_at)}</span>

        <span
          className={cn(
            'ml-auto inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            STATUS_TONE[sale.status],
          )}
        >
          <Icon className="size-3" />
          {STATUS_LABEL[sale.status](m)}
        </span>
      </div>

      {/*
        Sanoq — bezak emas.

        «Pulim qayerda» har bozorda birinchi savol, va ko'rinib turgan
        taymer uning ko'pini javobsiz qoldirmaydi.
      */}
      {held && sale.releases_at && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
              style={{ width: `${Math.round(progress(sale, now) * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span>{remaining(sale.releases_at, now, m)}</span>
            <span>{t((x) => x.sales.opensAt, { date: dates.dateTime(sale.releases_at!) })}</span>
          </div>
        </div>
      )}

      {sale.status === 'released' && sale.released_at && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {t((x) => x.sales.releasedAt, { date: dates.dateTime(sale.released_at!) })}
        </p>
      )}

      {(sale.status === 'refunded' || sale.status === 'partially_refunded') &&
        sale.refunded_amount && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {t((x) => x.sales.refunded, { amount: money.decimalSom(sale.refunded_amount!) })}
          </p>
        )}

      {/* Nizolar ro'yxati SHU sahifada, pastroqda — shuning uchun oddiy
          langar, marshrut emas: alohida sahifa yo'q va bo'lishi ham
          shart emas, javob bir ekran narida. */}
      {sale.status === 'disputed' && (
        <a
          href="#disputes"
          className="mt-2 inline-block text-[11px] font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          {m.sales.disputeLink}
        </a>
      )}
    </article>
  );
}

/**
 * «Sotuvlarim» — bitta sotuv darajasidagi pul tarixi.
 *
 * Hamyondagi «hold» kartasi umumiy summani aytadi; bu esa har sotuv bilan
 * nima bo'lganini: qachon ochiladi, qachon ochilgan, nima qaytarilgan.
 * Ikkalasi ham kerak — birinchisi «qancha», ikkinchisi «qaysi biri».
 */
export function SalesList() {
  const { m } = useT();
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, isFetching } = useGetMySalesQuery(
    filter === 'all' ? { page_size: 50 } : { status: filter, page_size: 50 },
  );
  // Filtr almashganda ro'yxat bo'shab qolmasin: eski javob turadi va
  // ustiga xiralik tushadi — «yo'q» bilan «yuklanmoqda» aralashmasin.
  const results = data?.results ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-2.5">
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  // Hech qachon sotmagan odamga filtr chiplarini ko'rsatish ma'nosiz.
  if (filter === 'all' && results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">{m.sales.empty}</p>
        <p className="mt-1 text-sm text-muted-foreground">{m.sales.emptyHint}</p>
        <ButtonLink href="/materials" variant="outline" size="sm" className="mt-4">
          {m.sales.emptyAction}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <div role="group" className="flex flex-wrap gap-1.5">
        {(['all', ...SALE_STATUSES] as Filter[]).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filter === value
                ? 'border-emerald-500/40 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                : 'border-border/70 text-muted-foreground hover:text-foreground',
            )}
          >
            {value === 'all' ? m.wallet.filterAll : STATUS_LABEL[value](m)}
          </button>
        ))}
      </div>

      <div className={cn('mt-4 grid gap-2.5', isFetching && 'opacity-60')}>
        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-6 py-14 text-center text-sm text-muted-foreground">
            {filter === 'held' ? m.sales.nothingHeld : m.sales.filterEmpty}
          </p>
        ) : (
          results.map((sale) => <SaleCard key={sale.id} sale={sale} />)
        )}
      </div>
    </div>
  );
}
