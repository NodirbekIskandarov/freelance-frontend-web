'use client';

import { Flame, Lock, ShoppingCart, Star, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { useRequestVariantSolutionMutation } from '@/features/requests/requestsApi';
import { SolutionUploadModal } from '@/features/solutions/SolutionUploadModal';
import {
  useGetMySolutionsQuery,
  usePurchaseSolutionMutation,
} from '@/features/solutions/solutionsApi';
import { cn } from '@/lib/cn';
import { formatDecimalSom } from '@/lib/format';
import { SOLUTION_STATUS_LABELS } from '@/shared/types/solutions';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { PublicSolution, Variant } from '@/shared/types/catalogue';

export interface VariantWithCount extends Variant {
  solutionCount: number;
}

/**
 * Bitta odam bitta variantga nechta yechim yubora oladi.
 *
 * Backenddagi `MAX_SOLUTIONS_PER_USER_PER_VARIANT` bilan bir xil. Mijozda
 * takrorlangani — chegaraga yetganda tugmani o'chirib qo'yish uchun:
 * uchinchi urinishda faylni yuklab bo'lib, keyin xato olish yomon.
 * Haqiqiy chek baribir serverda.
 */
const MAX_UPLOADS_PER_VARIANT = 2;

type VariantStatus = 'available' | 'requested' | 'empty';

function statusOf(variant: VariantWithCount): VariantStatus {
  if (variant.solutionCount > 0) return 'available';
  if (variant.request_count > 0) return 'requested';
  return 'empty';
}

const STATUS_LABELS: Record<VariantStatus, string> = {
  available: 'Yechim bor',
  requested: 'Talab mavjud',
  empty: "Hech kim so'ramagan",
};

const DOT: Record<VariantStatus, string> = {
  available: 'bg-emerald-500',
  requested: 'bg-amber-500',
  empty: 'bg-zinc-400',
};

const BADGE: Record<VariantStatus, string> = {
  available: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  requested: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  empty: 'bg-zinc-500/10 text-zinc-500',
};

const ACTIVE_BORDER: Record<VariantStatus, string> = {
  available: 'border-emerald-500/60 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]',
  requested: 'border-amber-500/60 shadow-[0_0_0_1px_rgba(245,158,11,0.15)]',
  empty: 'border-zinc-400/50',
};

/**
 * Variantlar to'ri va tanlangan variant paneli.
 *
 * Rang variant HOLATIDAN kelib chiqadi: yechim bor (yashil), kimdir
 * so'ragan (sariq), hech kim so'ramagan (kulrang). Yechimlar soni
 * serverda hisoblanadi — mijozda 20 ta so'rov qilinmasin.
 */
export function VariantGrid({
  variants,
  solutionsByVariant,
}: {
  variants: VariantWithCount[];
  /** Tanlangan variant uchun yechimlar — serverdan oldindan kelgan. */
  solutionsByVariant: Record<string, PublicSolution[]>;
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const [requestVariant, requestState] = useRequestVariantSolutionMutation();
  const [purchase, purchaseState] = usePurchaseSolutionMutation();
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [boughtIds, setBoughtIds] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  /*
   * Foydalanuvchining SHU variantga yuborgan yechimlari.
   *
   * Erta qaytishdan oldin chaqiriladi — hook shartli bo'lmasligi kerak.
   * Mehmon uchun butunlay o'tkazib yuboriladi: backend 401 qaytaradi va
   * ochiq katalogda bu foydasiz xato bo'lardi.
   */
  const myUploads = useGetMySolutionsQuery(
    { variant: selectedId, page_size: MAX_UPLOADS_PER_VARIANT + 1 },
    { skip: !isAuthenticated || !selectedId },
  );

  if (variants.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
        Bu topshiriqda variantlar yo&apos;q.
      </p>
    );
  }

  const selected = variants.find((item) => item.id === selectedId) ?? variants[0]!;
  const selectedStatus = statusOf(selected);
  const solutions = solutionsByVariant[selected.id] ?? [];
  const alreadyRequested = requestedIds.includes(selected.id);

  const mine = myUploads.data?.results ?? [];
  const uploadsLeft = Math.max(0, MAX_UPLOADS_PER_VARIANT - mine.length);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_260px] lg:items-start">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">Variantlar ({variants.length})</p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {variants.map((variant) => {
            const status = statusOf(variant);
            const active = variant.id === selected.id;
            const locked = status === 'empty';

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedId(variant.id)}
                aria-pressed={active}
                className={cn(
                  'card-lift rounded-xl border bg-card p-2.5 text-left',
                  active
                    ? ACTIVE_BORDER[status]
                    : 'border-border/70 hover:border-emerald-500/40 hover:bg-muted/40',
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      'inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                      locked ? 'bg-zinc-500/10' : BADGE[status],
                    )}
                  >
                    {locked ? <Lock className="size-3.5 text-zinc-500" /> : variant.number}
                  </span>

                  <div className="min-w-0 flex-1 pt-0.5">
                    {locked ? (
                      // Matn o'ralishi kerak: tor kartada bir qatorga sig'maydi.
                      <p className="text-[11px] leading-tight break-words text-muted-foreground">
                        Tayyor emas
                      </p>
                    ) : (
                      <>
                        <p className="text-base leading-none font-semibold text-foreground">
                          {variant.number}
                        </p>
                        <p
                          className={cn(
                            'mt-1.5 text-[11px] font-medium',
                            status === 'requested'
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-muted-foreground',
                          )}
                        >
                          {/* Talab qancha ekani muhim: bitta so'rov bilan
                              o'ntasi bir xil ko'rinmasin. */}
                          {status === 'requested'
                            ? `${variant.request_count} ta so'rov`
                            : `${variant.solutionCount} ta yechim`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {(['available', 'requested', 'empty'] as const).map((status) => (
            <span key={status} className="inline-flex items-center gap-1.5">
              {status === 'empty' ? (
                <Lock className="size-3 text-zinc-500" />
              ) : (
                <span className={cn('size-2 rounded-full', DOT[status])} />
              )}
              {STATUS_LABELS[status]}
            </span>
          ))}
        </div>
      </div>

      <aside className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-4 lg:sticky lg:top-4">
        <p className="text-sm font-semibold text-foreground">{selected.number}-variant</p>

        {selectedStatus === 'available' ? (
          <ul className="mt-3 space-y-2">
            {solutions.map((solution) => (
              <li key={solution.id} className="rounded-lg border border-border/70 bg-card p-3">
                <p className="text-sm font-medium text-foreground">{solution.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {Number(solution.average_rating).toFixed(1)} · {solution.sold_count} sotuv
                </p>
                <p className="mt-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatDecimalSom(solution.price)}
                </p>
                {boughtIds.includes(solution.id) ? (
                  <ButtonLink
                    href="/student/downloads"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                  >
                    Kutubxonada ochish
                  </ButtonLink>
                ) : (
                  <Button
                    variant="emerald"
                    size="sm"
                    className="mt-2 w-full"
                    disabled={purchaseState.isLoading}
                    onClick={() => {
                      void purchase(solution.id)
                        .unwrap()
                        .then(() => setBoughtIds((current) => [...current, solution.id]))
                        .catch(() => undefined);
                    }}
                  >
                    <ShoppingCart className="size-3.5" />
                    Sotib olish
                  </Button>
                )}
              </li>
            ))}

            {/*
              Xarid xatosi shu yerda: kirmagan foydalanuvchi 401 oladi,
              balansi yetmasa esa boshqa xabar — ikkalasi ham backenddan
              o'zbekcha keladi.
            */}
            {purchaseState.error && (
              <li role="alert" className="text-[11px] text-destructive">
                {getApiErrorMessage(purchaseState.error)}
              </li>
            )}
          </ul>
        ) : (
          <div className="mt-3 space-y-2.5 rounded-lg border border-amber-500/40 bg-amber-500/[0.06] p-3">
            {selected.request_count > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                <Flame className="size-3" />
                Talab mavjud · {selected.request_count}
              </span>
            )}

            <p className="text-[11px] leading-snug text-muted-foreground">
              Variant yuklanmagan. Talab qoldiring — yechim chiqqanda birinchilardan bo&apos;lib
              bilasiz.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
              disabled={requestState.isLoading || alreadyRequested}
              onClick={() => {
                void requestVariant(selected.id)
                  .unwrap()
                  .then(() => setRequestedIds((current) => [...current, selected.id]))
                  .catch(() => undefined);
              }}
            >
              {alreadyRequested ? 'So‘rov yuborildi' : "So'rov qoldirish"}
            </Button>

            {requestState.error && !alreadyRequested && (
              <p role="alert" className="text-[11px] text-destructive">
                {getApiErrorMessage(requestState.error)}
              </p>
            )}
          </div>
        )}

        {/*
          Yechim yuborish HAR IKKALA holatda ham ko'rinadi — yechimi bor
          variantga ham yuborish mumkin, chegara to'lmaguncha. Panel pastida
          turadi: sotib olish yoki so'rov qoldirish tashrif buyuruvchilarning
          ko'pchiligi uchun asosiy amal, yuklash esa ozchilik uchun.
        */}
        <div className="mt-3 border-t border-border/70 pt-3">
          {/*
            Foydalanuvchining o'z yuborganlari — holati bilan. Chop
            etilmagunicha ular katalogda ko'rinmaydi, shuning uchun bu
            ro'yxatsiz odam yechimi yetib bordimi-yo'qmi bilmasdi.
          */}
          {mine.length > 0 && (
            <ul className="mb-3 space-y-1.5">
              {mine.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card px-2.5 py-1.5"
                >
                  <span className="min-w-0 truncate text-[11px] text-foreground" title={item.title}>
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      item.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : item.status === 'rejected'
                          ? 'bg-destructive/15 text-destructive'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                    )}
                  >
                    {SOLUTION_STATUS_LABELS[item.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {selected.submissions_open ? (
            uploadsLeft > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload className="size-3.5" />
                  Yechim yuborish
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  {mine.length > 0
                    ? `Yana ${uploadsLeft} ta yubora olasiz.`
                    : selected.request_count > 0 && selectedStatus !== 'available'
                      ? `${selected.request_count} kishi shu variantni kutyapti.`
                      : `Bir variantga ${MAX_UPLOADS_PER_VARIANT} tagacha yechim yuborish mumkin.`}
                </p>
              </>
            ) : (
              /* Chegaraga yetildi. Tugmani ko'rsatib, keyin serverdan xato
                 qaytarish o'rniga sababi shu yerda aytiladi. */
              <p className="text-center text-[11px] leading-snug text-muted-foreground">
                Bu variantga {MAX_UPLOADS_PER_VARIANT} ta yechim yuborib bo&apos;lgansiz.
              </p>
            )
          ) : (
            /*
              Yopilgani ochiq aytiladi. Tugmani shunchaki yashirish
              «bu yerda yuklab bo'lmaydi» degan xulosani o'zi chiqarishga
              qoldirardi; yuklashga urinib, xato olishdan esa yomonroq.
            */
            <p className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
              <Lock className="mt-px size-3 shrink-0" />
              Bu variantga yechim qabul qilish yopilgan.
            </p>
          )}
        </div>
      </aside>

      <SolutionUploadModal
        open={uploadOpen}
        variantId={selected.id}
        variantNumber={selected.number}
        assignmentTitle={selected.assignment_title}
        onClose={() => setUploadOpen(false)}
      />
    </div>
  );
}
