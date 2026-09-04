'use client';

import { Download, Loader2, ShieldAlert, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { LIBRARY_ORDERING_OPTIONS, type LibraryItem } from '@/shared/types/library';
import { DisputeModal } from '@/features/disputes/DisputeModal';
import { disputeStatusLabel, type DisputeStatus } from '@/shared/types/disputes';

import { useGetLibraryQuery, useLazyGetLibraryItemQuery } from './libraryApi';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';
import { useDates } from '@/lib/useDates';
import { useNow } from '@/lib/useNow';

/**
 * Fayl havolasi ro'yxatda kelmaydi — u faqat tafsilot so'rovida
 * beriladi. Shuning uchun "Yuklab olish" bosilganda avval tafsilot
 * olinadi, keyin havola ochiladi.
 */
function DownloadButton({ item }: { item: LibraryItem }) {
  const { m } = useT();
  const [fetchItem, { isFetching }] = useLazyGetLibraryItemQuery();
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);

    try {
      const detail = await fetchItem(item.solution_id).unwrap();
      if (!detail.solution.file) {
        setError('Fayl topilmadi');
        return;
      }
      window.open(detail.solution.file, '_blank', 'noopener');
    } catch {
      setError(m.library.downloadFailed);
    }
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <Button
        variant="emerald"
        size="sm"
        disabled={isFetching}
        onClick={() => void handleDownload()}
      >
        {isFetching ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5" />
        )}
        {m.library.download}
      </Button>
      {error && <span className="text-[11px] text-destructive">{error}</span>}
    </span>
  );
}

export function LibraryList() {
  const dates = useDates();
  const money = useMoney();
  const { t, m } = useT();
  const [ordering, setOrdering] = useState<string>('-purchased_at');
  const [disputeTarget, setDisputeTarget] = useState<LibraryItem | null>(null);
  const now = useNow();
  const { data, isLoading, error } = useGetLibraryQuery({ ordering, page_size: 50 });

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (data.results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Kutubxona bo&apos;sh</p>
        <p className="mt-1 text-sm text-muted-foreground">{m.library.empty}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t((x) => x.library.count, { count: data.count })}
        </p>

        <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
          <span className="sr-only">{m.library.sort}</span>
          <select
            value={ordering}
            onChange={(event) => setOrdering(event.target.value)}
            className="bg-transparent text-xs font-medium text-foreground outline-none"
          >
            {LIBRARY_ORDERING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label(m)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3">
        {data.results.map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-foreground">{item.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.variant_label}</p>
              <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground/80">
                <span>
                  {t((x) => x.library.purchasedAt, { date: dates.date(item.purchased_at) })}
                </span>
                {Number(item.average_rating) > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {Number(item.average_rating).toFixed(1)}
                  </span>
                )}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {money.som(Number(item.price_paid))}
              </div>
              <div className="text-[11px] text-muted-foreground">to&apos;langan</div>
            </div>

            <span className="flex flex-col items-end gap-1.5">
              <DownloadButton item={item} />

              {/* Shikoyat FAQAT oyna ochiq bo'lganda va hali yozilmaganda.
                  Muddati o'tgan xaridda tugmani ko'rsatish — bosib, «muddat
                  o'tdi» xatosini olish demak edi. */}
              {item.dispute_status ? (
                <span className="text-[11px] text-muted-foreground">
                  {disputeStatusLabel(item.dispute_status as DisputeStatus, m)}
                </span>
              ) : (
                windowOpen(item.dispute_deadline, now) && (
                  <button
                    type="button"
                    onClick={() => setDisputeTarget(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <ShieldAlert className="size-3" />
                    {m.dispute.action}
                  </button>
                )
              )}
            </span>
          </article>
        ))}
      </div>

      {disputeTarget && (
        <DisputeModal
          open
          orderId={disputeTarget.order_id}
          solutionTitle={disputeTarget.title}
          variantLabel={disputeTarget.variant_label}
          purchasedAt={disputeTarget.purchased_at}
          deadline={disputeTarget.dispute_deadline}
          windowHours={disputeTarget.dispute_window_hours}
          price={disputeTarget.price_paid}
          onClose={() => setDisputeTarget(null)}
        />
      )}
    </>
  );
}

/**
 * Xariddan keyingi shikoyat oynasi hali ochiqmi.
 *
 * Muddat SERVERDAN keladi. Ilgari u shu yerda «xarid + 24 soat» deb
 * hisoblanardi, muddat sozlamaga aylangach esa sayt yolg'on gapira
 * boshladi: server yetti kun qabul qilaverar, tugma esa birinchi kundan
 * keyin yo'qolardi.
 */
function windowOpen(deadline: string | null, now: number): boolean {
  if (!deadline) return false;
  return new Date(deadline).getTime() > now;
}
