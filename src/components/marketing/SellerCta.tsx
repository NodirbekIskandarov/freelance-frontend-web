'use client';

import { ArrowUpRight, FilePlus2, Upload, Users } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { formatCount } from '@/lib/format';

/**
 * Sotuvchiga taklif — HOZIRCHA VERSTKA.
 *
 * O'ngdagi qatorlarning miqdorlari shu yerda turadi, API'dan
 * kelmaydi. Ikkitasi umuman modellashtirilmagan: platforma ulushi har
 * yechimga moderator tomonidan alohida qo'yiladi (qat'iy foiz yo'q), va
 * do'st taklif qilish uchun mukofot tizimi hali yozilmagan.
 *
 * DIQQAT: bu raqamlar foydalanuvchiga berilgan pul va'dasi. Ular
 * ataylab bitta joyda — ulanish payti kelganda o'zgartiriladigan joy
 * shu, sahifa bo'ylab tarqalgan o'nlab satr emas.
 */
const REWARD_ROWS = [
  {
    icon: ArrowUpRight,
    title: (m: Messages) => m.home.rewardSelling,
    note: (m: Messages) => m.home.rewardSellingNote,
    amount: (m: Messages) => m.home.rewardSellingShare,
  },
  {
    icon: FilePlus2,
    title: (m: Messages) => m.home.rewardSubject,
    note: (m: Messages) => m.home.rewardAfterApproval,
    amount: (m: Messages) => m.home.rewardSubjectAmount,
  },
  {
    icon: Upload,
    title: (m: Messages) => m.home.rewardAssignment,
    note: (m: Messages) => m.home.rewardWithFile,
    amount: (m: Messages) => m.home.rewardAssignmentAmount,
  },
  {
    icon: Users,
    title: (m: Messages) => m.home.rewardReferral,
    note: (m: Messages) => m.home.rewardReferralNote,
    amount: (m: Messages) => m.home.rewardReferralAmount,
  },
] as const;

export function SellerCta({ awaitingVariants }: { awaitingVariants: number }) {
  const { t, m } = useT();

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent p-5 sm:p-7 lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-warning">
                {m.home.sellerBadge}
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {m.home.sellerTitle}{' '}
                <span className="text-warning">
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
              {REWARD_ROWS.map((row) => (
                <li
                  key={row.title(m)}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-warning">
                    <row.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {row.title(m)}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">{row.note(m)}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-warning tabular-nums dark:text-amber-400">
                    {row.amount(m)}
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
