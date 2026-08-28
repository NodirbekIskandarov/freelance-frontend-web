'use client';

import { useState } from 'react';

import { OfferStatusBadge } from '@/components/freelance/TaskStatusBadge';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { useGetMyOffersQuery, useWithdrawOfferMutation } from '@/features/freelance/exchangeApi';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { offerStatusLabel, OFFER_STATUSES, type OfferStatus } from '@/shared/types/exchange';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU').slice(0, 16);
}

export function FreelancerOffers() {
  const { m } = useT();
  const money = useMoney();
  const [status, setStatus] = useState<OfferStatus | 'all'>('all');
  const [withdrawOffer, withdraw] = useWithdrawOfferMutation();

  const { data, isLoading, error } = useGetMyOffersQuery({
    page_size: 50,
    ordering: '-created_at',
    ...(status !== 'all' ? { status } : {}),
  });

  if (error) return <ErrorNotice error={error} />;

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', ...OFFER_STATUSES] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            aria-pressed={status === item}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              status === item
                ? 'bg-emerald-600 text-white'
                : 'border border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            {item === 'all' ? m.common.all : offerStatusLabel(item, m)}
          </button>
        ))}
      </div>

      {withdraw.error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {getApiErrorMessage(withdraw.error)}
        </p>
      )}

      {isLoading || !data ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Taklif topilmadi</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.freelancerCabinet.noOffers}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.results.map((offer) => (
            <article
              key={offer.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-muted-foreground">{offer.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  {offer.deadline_days} kun &middot; {formatDate(offer.created_at)}
                </p>
              </div>

              <OfferStatusBadge status={offer.status} />

              <div className="text-sm font-semibold whitespace-nowrap text-foreground">
                {money.decimalSom(offer.price)}
              </div>

              {/* Qaytarib olish faqat hali javob kelmagan taklifda ma'noli. */}
              {offer.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={withdraw.isLoading}
                  onClick={() => void withdrawOffer({ id: offer.id, taskId: offer.task })}
                >
                  {m.freelancerCabinet.withdrawOffer}
                </Button>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
