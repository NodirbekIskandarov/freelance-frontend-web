'use client';

import { CircleCheck, Plus, Wallet } from 'lucide-react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useGetWalletQuery } from '@/features/account/accountApi';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useMoney } from '@/lib/useMoney';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { PublicSolution } from '@/shared/types/catalogue';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { usePurchaseSolutionMutation } from './solutionsApi';

/**
 * Xarid tasdiqlash oynasi.
 *
 * Ilgari «Sotib olish» darhol pulni yechardi — tasdiqlashsiz, balans
 * ko'rinmasdan. Endi pul haqiqiy ichki balansdan ketadi, ya'ni odam
 * bosishdan oldin nima qancha turishini va o'zida qancha borligini
 * ko'rishi kerak.
 *
 * Balans YETMASA tugma o'chadi va yetishmagan summa aytiladi. Server
 * baribir rad etadi, lekin «mablag' yetarli emas» degan xatoni bosgandan
 * KEYIN ko'rish — javobi allaqachon ekranda turgan savol.
 */
export function PurchaseModal({
  open,
  solution,
  assignmentTitle,
  variantLabel,
  subjectName,
  universityShortName,
  onClose,
  onPurchased,
}: {
  open: boolean;
  solution: PublicSolution;
  assignmentTitle: string;
  /** Variantsiz topshiriqda bo'sh — sarlavhaga variant qo'shilmaydi. */
  variantLabel?: string;
  subjectName: string;
  universityShortName: string;
  onClose: () => void;
  onPurchased: () => void;
}) {
  const { t, m } = useT();
  const money = useMoney();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [purchase, { isLoading, error, isSuccess, reset }] = usePurchaseSolutionMutation();

  // Balans faqat oyna ochilganda kerak — katalog sahifasi har karta uchun
  // hamyonni so'rab o'tirmasin.
  const { data: wallet } = useGetWalletQuery(undefined, { skip: !open || !isAuthenticated });

  const price = Number(solution.price);
  const balance = Number(wallet?.balance ?? 0);
  const left = balance - price;
  const enough = Boolean(wallet) && left >= 0;

  function close() {
    reset();
    onClose();
  }

  async function handlePay() {
    try {
      await purchase(solution.id).unwrap();
    } catch {
      // Xato quyida ko'rsatiladi.
      return;
    }
    onPurchased();
  }

  const heading = [assignmentTitle, variantLabel].filter(Boolean).join(' · ');
  const place = [subjectName, universityShortName].filter(Boolean).join(' · ');

  return (
    <Modal
      open={open}
      onClose={close}
      title={isSuccess ? m.purchase.done : m.purchase.title}
      className="w-[min(30rem,calc(100vw-2rem))]"
      footer={
        isSuccess ? (
          <>
            <Button variant="outline" onClick={close}>
              {m.common.close}
            </Button>
            <ButtonLink href="/student/downloads" variant="emerald">
              {m.purchase.openLibrary}
            </ButtonLink>
          </>
        ) : isAuthenticated ? (
          <Button
            variant="emerald"
            className="w-full"
            disabled={isLoading || !enough}
            onClick={() => void handlePay()}
          >
            {isLoading ? m.purchase.paying : enough ? m.purchase.pay : m.purchase.cannotPay}
          </Button>
        ) : undefined
      }
    >
      {isSuccess ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-foreground">{solution.title}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{m.purchase.doneText}</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">{m.purchase.loginRequired}</p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            {m.header.login}
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Nima sotib olinayotgani — oynada bittagina karta bo'lsa ham,
              odam qaysi variantni bosganini adashtirishi mumkin. */}
          <div className="flex gap-3 border-b border-border/70 pb-4">
            <div className="size-14 shrink-0 rounded-lg border border-border/70 bg-muted/40" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{heading}</p>
              {place && <p className="mt-0.5 truncate text-xs text-muted-foreground">{place}</p>}
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {t((x) => x.purchase.author, { name: solution.uploader.full_name || '—' })}
                {' · ★ '}
                {Number(solution.average_rating).toFixed(1)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground">
              {m.purchase.paymentSection}
            </p>

            {/* Yagona to'lov usuli — shuning uchun tanlov emas, holat.
                Radio ko'rinishida qoldirildi: pastdagi «to'ldirish» qatori
                ulanganda bu ikkitadan biri bo'ladi. */}
            <div
              className={cn(
                'mt-2 flex items-center gap-3 rounded-xl border p-3.5',
                enough
                  ? 'border-emerald-500/50 bg-emerald-500/[0.06]'
                  : 'border-destructive/50 bg-destructive/[0.06]',
              )}
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full',
                  enough
                    ? 'bg-emerald-600 text-white'
                    : 'bg-destructive/15 text-destructive dark:text-red-400',
                )}
              >
                <Wallet className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {m.purchase.myBalance}
                </span>
                <span
                  className={cn(
                    'block text-xs',
                    enough ? 'text-muted-foreground' : 'text-destructive dark:text-red-400',
                  )}
                >
                  {enough
                    ? t((x) => x.purchase.balanceLine, {
                        balance: money.som(balance),
                        left: money.som(left),
                      })
                    : t((x) => x.purchase.notEnough, {
                        balance: money.som(balance),
                        missing: money.som(Math.abs(left)),
                      })}
                </span>
              </span>
            </div>

            {/* To'lov tizimi hali ulanmagan. Tugma qilib qo'yish — bosib,
                hech nima bo'lmasligini ko'rish; shuning uchun u ochiq
                «tez orada» deb turadi. */}
            <p className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-border/70 px-3.5 py-3 text-xs text-muted-foreground">
              <Plus className="size-3.5 shrink-0" />
              {m.purchase.topUpSoon}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{m.purchase.priceRow}</span>
              <span className="font-medium text-foreground">{money.decimalSom(solution.price)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
              <span className="text-sm font-semibold text-foreground">{m.purchase.totalRow}</span>
              <span className="text-lg font-bold text-foreground">
                {money.decimalSom(solution.price)}
              </span>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {getApiErrorMessage(error)}
            </p>
          )}

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            {m.purchase.footnote}
          </p>
        </div>
      )}
    </Modal>
  );
}
