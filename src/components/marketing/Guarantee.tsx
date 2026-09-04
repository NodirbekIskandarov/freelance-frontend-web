'use client';

import { CircleCheck, RotateCcw, ShieldCheck, Star } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useT } from '@/i18n/useT';

/**
 * Xarid xavfsizligi bo'limi.
 *
 * To'rtta karta — TIZIMDA HAQIQATAN bor to'rtta narsa: moderatsiya,
 * kafolat hisobi, shikoyat oynasi va muallif reytingi. Muddat
 * serverdan keladi, matnga yozilmaydi.
 */
export function Guarantee({
  windowLabel,
  authorLabel,
}: {
  windowLabel: string;
  authorLabel: string;
}) {
  const { t, m } = useT();

  const cards = [
    {
      icon: CircleCheck,
      tone: 'bg-emerald-500/10 text-brand',
      title: m.home.guaranteeModeration,
      text: m.home.guaranteeModerationText,
    },
    {
      icon: ShieldCheck,
      tone: 'bg-sky-500/10 text-sky-500',
      title: m.home.guaranteeHold,
      text: t((x) => x.home.guaranteeHoldText, { window: windowLabel }),
    },
    {
      icon: RotateCcw,
      tone: 'bg-amber-500/10 text-warning',
      title: t((x) => x.home.guaranteeWindow, { window: windowLabel }),
      text: t((x) => x.home.guaranteeWindowText, { hours: authorLabel }),
    },
    {
      icon: Star,
      tone: 'bg-violet-500/10 text-violet-500',
      title: m.home.guaranteeRating,
      text: m.home.guaranteeRatingText,
    },
  ];

  return (
    <section className="border-y border-border bg-muted/20 py-10 sm:py-14">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-brand">
              {m.home.guaranteeBadge}
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.home.guaranteeTitle}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t((x) => x.home.guaranteeLead, { window: windowLabel })}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <ButtonLink href="/materials" variant="emerald" className="rounded-xl">
                {m.home.heroSearch}
              </ButtonLink>
              <ButtonLink href="/faq" variant="outline" className="rounded-xl">
                {m.home.guaranteeTerms}
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {cards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-card p-4">
                <span
                  className={`grid size-9 place-items-center rounded-xl ${card.tone}`}
                  aria-hidden
                >
                  <card.icon className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
