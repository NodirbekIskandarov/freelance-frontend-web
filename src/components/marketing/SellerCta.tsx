'use client';

import { ArrowUpRight, Building2, FilePlus2, Upload } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useT } from '@/i18n/useT';
import { formatCount } from '@/lib/format';
import { useMoney } from '@/lib/useMoney';
import type { SupportTerms } from '@/shared/types/support';

/**
 * Ikkinchi tomonga — yechim yozadigan odamga — qilingan taklif.
 *
 * O'ngdagi qatorlar SOZLAMADAN keladi (`/support/terms/`): mukofot
 * miqdori operator qo'yadigan qiymat va uni sahifaga yozib qo'yish
 * sayt hech kim yoqmagan pulni va'da qilishiga olib borardi. Mukofot
 * o'chirilgan bo'lsa qator umuman chizilmaydi.
 */
export function SellerCta({
  terms,
  awaitingVariants,
}: {
  terms: SupportTerms;
  awaitingVariants: number;
}) {
  const { t, m } = useT();
  const money = useMoney();

  const rewards = [
    {
      icon: FilePlus2,
      title: m.home.rewardSubject,
      note: m.home.rewardAfterApproval,
      amount: terms.subject_request_reward,
    },
    {
      icon: Upload,
      title: m.home.rewardAssignment,
      note: m.home.rewardWithFile,
      amount: terms.assignment_request_reward,
    },
    {
      icon: Building2,
      title: m.home.rewardUniversity,
      note: m.home.rewardAfterApproval,
      amount: terms.university_request_reward,
    },
  ].filter((reward) => reward.amount > 0);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent p-5 sm:p-7 lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                {m.home.sellerBadge}
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {m.home.sellerTitle}{' '}
                <span className="text-amber-600 dark:text-amber-400">
                  {m.home.sellerTitleAccent}
                </span>
              </h2>

              {/* Javobsiz variantlar soni — HAQIQIY talab. Yechim yozmoqchi
                  bo'lgan odam aynan shu raqamni qidiradi. */}
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {awaitingVariants > 0
                  ? t((x) => x.home.sellerLead, { count: formatCount(awaitingVariants) })
                  : m.home.sellerLeadEmpty}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <ButtonLink href="/materials" variant="emerald" className="rounded-xl">
                  {m.home.sellerAction}
                </ButtonLink>
                <ButtonLink href="/faq" variant="outline" className="rounded-xl">
                  {m.home.sellerRules}
                </ButtonLink>
              </div>
            </div>

            <ul className="space-y-2.5">
              <li className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ArrowUpRight className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {m.home.rewardSelling}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {m.home.rewardSellingNote}
                  </span>
                </span>
              </li>

              {rewards.map((reward) => (
                <li
                  key={reward.title}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                    <reward.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {reward.title}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">{reward.note}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-amber-600 tabular-nums dark:text-amber-400">
                    {money.som(reward.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
