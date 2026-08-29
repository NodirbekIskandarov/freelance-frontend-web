'use client';

import { Lock, ShieldAlert } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { useNow } from '@/lib/useNow';

import { useGetHeldEarningsQuery } from './disputesApi';

/** Ochilishigacha necha kun qolgani — «bugun» ham javob. */
function opensLabel(
  iso: string,
  now: number,
  messages: { opensIn: string; opensToday: string },
): string {
  const days = Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
  if (days <= 0) return messages.opensToday;
  return messages.opensIn.replace('{days}', String(days));
}

/**
 * «Hold» — sotilgan, lekin hali balansga tushmagan pul.
 *
 * Usiz muallif sotuvidan kichik balansni ko'rib, sababini bilolmasdi: pul
 * yo'qolmagan, u shikoyat oynasini kutmoqda. Nizodagi summa ALOHIDA
 * ko'rsatiladi — u soat bilan emas, qaror bilan ochiladi va unga sana yozish
 * yolg'on bo'lardi.
 *
 * Hech nima ushlanmagan bo'lsa bo'lim umuman chizilmaydi: hech qachon
 * sotmagan odamga bo'sh «hold» kartasi savol tug'diradi, javob emas.
 */
export function HeldEarnings() {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();
  const now = useNow();
  const { data } = useGetHeldEarningsQuery();

  if (!data || data.count === 0) return null;

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Lock className="size-3.5 text-amber-600 dark:text-amber-400" />
            {m.hold.title}
          </p>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {t((x) => x.hold.intro, { hours: data.window_hours })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            {m.hold.total}
          </p>
          <p className="text-xl font-bold text-foreground tabular-nums">
            {money.decimalSom(data.total)}
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-border/60">
        {data.results.map((sale) => {
          const disputed = Boolean(sale.dispute_status);
          return (
            <li key={sale.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {[sale.solution_title, sale.variant_label].filter(Boolean).join(' · ')}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {dates.dateTime(sale.paid_at)}
                </span>
              </span>

              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  disputed
                    ? 'bg-destructive/12 text-destructive dark:text-red-400'
                    : 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
                )}
              >
                {disputed ? (
                  <>
                    <ShieldAlert className="size-3" />
                    {m.hold.disputed}
                  </>
                ) : (
                  m.hold.waiting
                )}
              </span>

              <span className="w-24 text-right text-xs text-muted-foreground">
                {disputed ? m.hold.stopped : opensLabel(sale.releases_at, now, m.hold)}
              </span>

              <span className="w-28 text-right text-sm font-semibold text-foreground tabular-nums">
                {money.decimalSom(sale.seller_earning)}
              </span>
            </li>
          );
        })}
      </ul>

      {data.disputed_count > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{m.hold.note}</p>
      )}
    </section>
  );
}
