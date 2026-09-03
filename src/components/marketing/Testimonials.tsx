'use client';

import { BadgeCheck, Star } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import type { LandingHighlights } from '@/server/landing/highlights';

/**
 * «Talabalar nima deydi» — HAQIQIY sharhlar.
 *
 * Ilgari bu bo'lim o'ylab topilgan uchta iqtibos edi. Endi u backenddan
 * keladi va sharh yozish faqat sotib olgan odamga ruxsat etilgani uchun
 * yonidagi «Xarid tasdiqlangan» belgisi so'z emas, qoida.
 *
 * Yonidagi o'rtacha baho esa BARCHA sharhlarni hisoblaydi — shu jumladan
 * bu yerda ko'rsatilmaydiganlarini ham. Aks holda «4.8» faqat tanlab
 * olingan uchtaning o'rtachasi bo'lardi.
 *
 * Sharh bo'lmasa bo'lim UMUMAN chizilmaydi: bo'sh «talabalar nima deydi»
 * yangi saytda hech kim gapirmaganini e'lon qilishdan boshqa narsa emas.
 */
export function Testimonials({ highlights }: { highlights: LandingHighlights }) {
  const { t, m } = useT();
  const { reviews, rating } = highlights;

  if (reviews.length === 0) return null;

  return (
    <section className="py-10 sm:py-14" aria-label={m.home.reviewsTitle}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {m.home.reviewsTitle}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{m.home.reviewsLead}</p>
          </div>

          {rating.average !== null && (
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-2.5">
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {rating.average.toFixed(1)}
              </span>
              <span>
                <Stars value={Math.round(rating.average)} />
                <span className="mt-0.5 block text-[11px] text-muted-foreground tabular-nums">
                  {t((x) => x.home.reviewsCount, { count: formatCount(rating.count) })}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Stars value={review.rating} />
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                  <BadgeCheck className="size-3" />
                  {m.home.reviewVerified}
                </span>
              </div>

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                «{review.comment}»
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border/50 pt-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  {initials(review.author)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {review.author || m.home.reviewAnonymous}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {[
                      review.university,
                      review.course ? t((x) => x.materials.course, { course: review.course }) : '',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={cn(
            'size-3.5',
            star <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
