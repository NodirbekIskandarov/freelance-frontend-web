'use client';

import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState } from 'react';

import { Container } from '@/components/ui/Container';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

const testimonials = [
  {
    quote: (m: Messages) => m.home.review1,
    name: 'Jasurbek J.',
    role: (m: Messages) => m.home.review1Role,
    initials: 'JJ',
    color: 'from-emerald-400 to-emerald-600',
    border: 'from-emerald-200/80 via-emerald-100/40 to-teal-200/70',
    quoteBg: 'bg-emerald-500/10 text-emerald-600',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    quote: (m: Messages) => m.home.review2,
    name: 'Madina K.',
    role: (m: Messages) => m.home.review2Role,
    initials: 'MK',
    color: 'from-violet-400 to-violet-600',
    border: 'from-violet-200/80 via-violet-100/40 to-fuchsia-200/70',
    quoteBg: 'bg-violet-500/10 text-violet-600',
    dot: 'bg-violet-500',
    badge: 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  },
  {
    quote: (m: Messages) => m.home.review3,
    name: 'Sardor A.',
    role: (m: Messages) => m.home.review3Role,
    initials: 'SA',
    color: 'from-blue-400 to-blue-600',
    border: 'from-blue-200/80 via-blue-100/40 to-sky-200/70',
    quoteBg: 'bg-blue-500/10 text-blue-600',
    dot: 'bg-blue-500',
    badge: 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  },
] as const;

function TestimonialCard({
  item,
  className,
}: {
  item: (typeof testimonials)[number];
  className?: string;
}) {
  const { m } = useT();

  return (
    <article className={cn('group relative h-full', className)}>
      <div
        className={cn(
          'absolute inset-0 rounded-3xl bg-gradient-to-br p-px opacity-90',
          item.border,
        )}
        aria-hidden
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/90 p-6 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 sm:p-7 dark:border-white/10 dark:bg-zinc-900/75">
        <div className="relative flex items-start justify-between gap-4">
          <div className={cn('grid size-11 place-items-center rounded-2xl', item.quoteBg)}>
            <Quote className="size-5" />
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
              item.badge,
            )}
          >
            <BadgeCheck className="size-3.5 shrink-0" />
            {m.home.verifiedReview}
          </span>
        </div>

        <p className="relative mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85 sm:text-base">
          &ldquo;{item.quote(m)}&rdquo;
        </p>

        <div className="relative mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
          <div
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
              item.color,
            )}
          >
            {item.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-bold text-foreground">{item.name}</div>
              <span className={cn('inline-block size-1.5 rounded-full', item.dot)} />
            </div>
            <div className="mt-0.5 text-xs font-medium text-muted-foreground">{item.role(m)}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TestimonialsAnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="testimonial-blob testimonial-blob-1 absolute top-[15%] -left-[8%] size-[min(420px,55vw)] rounded-full bg-emerald-400/20 blur-[90px] dark:bg-emerald-500/30" />
      <div className="testimonial-blob testimonial-blob-2 absolute top-[20%] left-1/2 size-[min(400px,50vw)] rounded-full bg-violet-400/18 blur-[95px] dark:bg-violet-500/28" />
      <div className="testimonial-blob testimonial-blob-3 absolute top-[18%] -right-[6%] size-[min(410px,52vw)] rounded-full bg-blue-400/18 blur-[90px] dark:bg-blue-500/28" />
    </div>
  );
}

export function Testimonials() {
  const { t, m } = useT();
  const [active, setActive] = useState(0);

  return (
    <section
      className="relative overflow-hidden border-y border-border/40 bg-zinc-100 py-14 sm:py-16 dark:border-white/5 dark:bg-zinc-950"
      aria-label={m.home.testimonialsTitle}
    >
      <TestimonialsAnimatedBackground />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            {m.home.testimonialsTitle}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {m.home.testimonialsLead}
          </p>
        </div>

        <div className="mt-8 hidden gap-5 lg:grid lg:grid-cols-3 xl:gap-6">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>

        <div className="relative mt-8 lg:hidden">
          <div className="mx-auto max-w-md px-10 sm:max-w-lg sm:px-12">
            <TestimonialCard item={testimonials[active]!} />
          </div>

          <button
            type="button"
            onClick={() => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
            aria-label={m.home.prevReview}
            className="absolute top-1/2 left-0 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-emerald-500/30 hover:text-emerald-600"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
            aria-label={m.home.nextReview}
            className="absolute top-1/2 right-0 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-emerald-500/30 hover:text-emerald-600"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={t((x) => x.home.reviewNumber, { index: index + 1 })}
                onClick={() => setActive(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === active ? 'w-6 bg-emerald-500' : 'w-2 bg-muted-foreground/25',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
