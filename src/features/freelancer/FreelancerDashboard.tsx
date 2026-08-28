'use client';

import { Briefcase, CircleCheck, Send, Wallet } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { TaskStatusBadge } from '@/components/freelance/TaskStatusBadge';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { StatCard } from '@/components/ui/StatCard';
import { useGetWalletQuery } from '@/features/account/accountApi';
import { useGetMyJobsQuery, useGetMyOffersQuery } from '@/features/freelance/exchangeApi';
import { workDirectionLabel } from '@/shared/types/publicFreelance';
import { useMoney } from '@/lib/useMoney';
import { useT } from '@/i18n/useT';

/**
 * Freelancer bosh sahifasi — backendda alohida dashboard endpoint'i
 * YO'Q. Ko'rsatkichlar sahifalangan javoblarning `count` maydonidan
 * olinadi: `page_size: 1` bilan so'ralganda backend butun ro'yxatni
 * emas, faqat sonni qaytaradi — bu eng arzon usul.
 */
export function FreelancerDashboard() {
  const { m } = useT();
  const money = useMoney();
  const active = useGetMyJobsQuery({ status: 'in_progress', page_size: 1 });
  const done = useGetMyJobsQuery({ status: 'completed', page_size: 1 });
  const pendingOffers = useGetMyOffersQuery({ status: 'pending', page_size: 1 });
  const wallet = useGetWalletQuery();
  const recent = useGetMyJobsQuery({ page_size: 5, ordering: '-created_at' });

  const error = active.error ?? done.error ?? pendingOffers.error ?? wallet.error;
  if (error) return <ErrorNotice error={error} />;

  const loading = active.isLoading || done.isLoading || pendingOffers.isLoading || wallet.isLoading;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-[116px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Faol ishlar"
          value={String(active.data?.count ?? 0)}
          icon={Briefcase}
          tone="bg-blue-500/12 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Yakunlangan"
          value={String(done.data?.count ?? 0)}
          icon={CircleCheck}
          tone="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Javob kutayotgan takliflar"
          value={String(pendingOffers.data?.count ?? 0)}
          icon={Send}
          tone="bg-violet-500/12 text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Balans"
          value={money.decimalSom(wallet.data?.balance ?? null)}
          icon={Wallet}
          tone="bg-amber-500/12 text-amber-600 dark:text-amber-400"
        />
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-foreground">So&apos;nggi ishlar</h2>
          <Link
            href="/freelancer/orders"
            className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Barchasi
          </Link>
        </div>

        {!recent.data || recent.data.results.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Hali ish yo&apos;q</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <Link
                href="/freelancer/board"
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Ochiq topshiriqlar
              </Link>{' '}
              bo&apos;limidan tanlab, birinchi taklifingizni yuboring.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {recent.data.results.map((job) => (
              <article
                key={job.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">{job.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.client?.full_name ?? 'Mijoz'} &middot;{' '}
                    {workDirectionLabel(job.direction, m)} &middot;{' '}
                    <span className="font-mono">{job.reference}</span>
                  </p>
                </div>

                <TaskStatusBadge status={job.status} />

                <div className="text-sm font-semibold whitespace-nowrap text-foreground">
                  {money.decimalSom(job.agreed_price)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
