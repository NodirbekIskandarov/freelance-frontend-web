'use client';

import { Star } from 'lucide-react';

import { cn } from '@/lib/cn';
import type { ExchangeReview } from '@/shared/types/exchange';
import { useT } from '@/i18n/useT';

/** Beshta yulduz — to'lganlari sariq, qolgani kulrang. */
function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${rating} / 5`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden
          className={cn(
            'size-3.5',
            value <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ru-RU');
}

/**
 * Server Component — sharhlar bot uchun HTML'da bo'lishi kerak.
 * Interaktivlik yo'q: yozish va tahrirlash kabinetda.
 */
export function FreelancerReviews({ reviews }: { reviews: ExchangeReview[] }) {
  const { m } = useT();
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        {m.ui.noReviews}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <div className="flex flex-wrap items-center gap-3">
            {review.client_avatar ? (
              // Backend rasm domenlari oldindan noma'lum — `next/image` emas.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.client_avatar} alt="" className="size-9 rounded-full object-cover" />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {(review.client_name || '?').trim().charAt(0).toUpperCase()}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {review.client_name || 'Mijoz'}
              </p>
              <p className="truncate text-xs text-muted-foreground">{review.task_title}</p>
            </div>

            <div className="text-right">
              <Stars rating={review.rating} />
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>

          {review.comment && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
