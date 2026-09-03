'use client';

import { Download, Flame, Lock, ShoppingCart, Star, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useGetLibraryQuery } from '@/features/library/libraryApi';
import { OwnedSolutionButton } from '@/features/library/OwnedSolutionButton';
import {
  useGetMySolutionRequestsQuery,
  useRequestVariantSolutionMutation,
} from '@/features/requests/requestsApi';
import { PurchaseModal } from '@/features/solutions/PurchaseModal';
import { SolutionUploadModal } from '@/features/solutions/SolutionUploadModal';
import {
  useGetMySolutionsQuery,
  useGetVariantSolutionsQuery,
} from '@/features/solutions/solutionsApi';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { PublicSolution } from '@/shared/types/catalogue';
import { solutionStatusLabel } from '@/shared/types/solutions';
import { useAppSelector } from '@/store/hooks';
import { selectAuthHydrated, selectIsAuthenticated } from '@/store/slices/authSlice';

import {
  BADGE,
  MAX_UPLOADS_PER_VARIANT,
  requestCountOf,
  STATUS_LABELS,
  statusOf,
  type VariantWithCount,
} from './variantStatus';

/**
 * Javob kelguncha turadigan tugma o'rni — yozuvsiz.
 *
 * Balandligi haqiqiy tugmanikiday: holat aniqlangach panel siljimasin.
 */
function ActionPlaceholder({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('h-9 w-full animate-pulse rounded-lg bg-muted', className)} />
  );
}

/**
 * Tanlangan variant paneli — sahifaning o'ng ustuni.
 *
 * Yechimlar serverdan OLDINDAN keladi (`solutionsByVariant`): sahifa ISR
 * bilan statik chiziladi va variantdan variantga o'tish qo'shimcha
 * so'rovsiz ishlaydi. Shaxsiy narsalar — sotib olinganlar, o'z
 * yuklamalari, yuborilgan so'rovlar — statik javobda bo'lishi mumkin
 * emas, ular mijozda so'raladi.
 */
export function VariantPanel({
  variant,
  solutions,
  assignmentId,
  assignmentTitle,
  subjectName,
  universityShortName,
  requestedIds,
  onRequested,
}: {
  variant: VariantWithCount;
  solutions: PublicSolution[];
  assignmentId: string;
  assignmentTitle: string;
  subjectName: string;
  universityShortName: string;
  requestedIds: string[];
  onRequested: (variantId: string) => void;
}) {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authHydrated = useAppSelector(selectAuthHydrated);

  const [requestVariant, requestState] = useRequestVariantSolutionMutation();
  const [boughtIds, setBoughtIds] = useState<string[]>([]);
  const [buyTarget, setBuyTarget] = useState<PublicSolution | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const justRequested = requestedIds.includes(variant.id);
  const requestCount = requestCountOf(variant, justRequested);

  /*
   * Sotuvdagi yechimlar — serverdan kelgani BOSHLANG'ICH qiymat, tirigi esa
   * shu so'rovdan. Faqat tanlangan variant uchun so'raladi va RTK Query uni
   * keshlab qo'yadi, ya'ni variantga qayta bosilganda so'rov takrorlanmaydi.
   */
  const live = useGetVariantSolutionsQuery(variant.id);
  const shown = live.data?.results ?? solutions;

  /* Holat ham tirik ro'yxatdan: statik sanoq nolni ko'rsatib turgan
     variantda yechim paydo bo'lgan bo'lishi mumkin. */
  const status = statusOf(
    live.data ? { ...variant, solutionCount: shown.length } : variant,
    justRequested,
  );

  /*
   * Foydalanuvchining shu TOPSHIRIQQA yuborgan yechimlari — bitta so'rovda.
   *
   * Variant bo'yicha so'ralsa, har variant bosilganda yangi so'rov ketardi:
   * o'n beshta variantli topshiriqda o'n beshta borish-kelish.
   *
   * Mehmon uchun o'tkazib yuboriladi: backend 401 qaytaradi va ochiq
   * katalogda bu foydasiz xato bo'lardi.
   */
  const myUploads = useGetMySolutionsQuery(
    { variant__assignment: assignmentId, page_size: 100 },
    { skip: !isAuthenticated },
  );
  const myRequests = useGetMySolutionRequestsQuery(
    { variant__assignment: assignmentId, page_size: 100 },
    { skip: !isAuthenticated },
  );
  /*
   * Sotib olinganlar — kutubxonadan.
   *
   * Egalikni katalog javobidan olib bo'lmaydi: u STATIK chiziladi va
   * hamma tashrif buyuruvchiga bir xil ketadi. Ro'yxat butun sahifa uchun
   * bitta so'rov: RTK Query uni kesh orqali bo'lishadi.
   */
  const library = useGetLibraryQuery({ page_size: 100 }, { skip: !isAuthenticated });
  const ownedIds = new Set((library.data?.results ?? []).map((item) => item.solution_id));

  const alreadyRequested =
    justRequested || (myRequests.data?.results ?? []).some((item) => item.variant === variant.id);

  const allMyUploads = myUploads.data?.results ?? [];
  const mine = allMyUploads.filter((item) => item.variant === variant.id);
  const uploadsLeft = Math.max(0, MAX_UPLOADS_PER_VARIANT - mine.length);

  /*
   * O'z yechimini sotib olib bo'lmaydi — backend buni rad qiladi.
   * Egalik `uploader` maydonini taqqoslash orqali emas, o'z yuklamalari
   * ro'yxati orqali aniqlanadi: u fayl havolasini ham o'zi bilan olib
   * keladi, ya'ni yuklab olish uchun qo'shimcha so'rov kerak emas.
   */
  const myUploadById = new Map(allMyUploads.map((item) => [item.id, item]));

  /*
   * Tugma qaysi holatda ekani MA'LUM bo'ldimi.
   *
   * «Sotib olish» va «Yuklab olish» orasidagi tanlov kutubxona va o'z
   * yuklamalari javobiga bog'liq, ular esa sahifa chizilgandan keyin
   * keladi. Ilgari shu oraliqda «Sotib olish» chizilib turardi va javob
   * kelgach yozuv almashib ketardi — sotib olgan odam bir lahza yana
   * pul so'ralayotgandek ko'rardi.
   *
   * Mehmon uchun kutish yo'q: uning uchun javob boshdanoq «Sotib olish».
   * `authHydrated` esa tokenning `localStorage`dan o'qilishini kutadi —
   * usiz tizimga kirgan odam ham bir lahza mehmon bo'lib ko'rinardi.
   */
  const ownershipReady =
    authHydrated && (!isAuthenticated || (!library.isLoading && !myUploads.isLoading));

  /*
   * Shu sabab yana ikki joyda.
   *
   * «So'rov qoldirish» tugmasi bosilgan-bosilmaganini `myRequests` aytadi:
   * javob kelguncha u «So'rov qoldirish» bo'lib turar, keyin «So'rov
   * yuborildi»ga almashardi — allaqachon so'ragan odam tugmani yana
   * bosishga ulgurardi.
   *
   * Panel osti esa `myUploads` ga bog'liq: chegaraga yetgan odamga avval
   * yuklash tugmasi ko'rsatilib, keyin «chegaraga yetildi» yozuvi
   * chiqardi.
   */
  const requestReady = authHydrated && (!isAuthenticated || !myRequests.isLoading);
  const uploadsReady = authHydrated && (!isAuthenticated || !myUploads.isLoading);

  /*
   * Katalogda allaqachon ko'rinib turgan yechim «yuborganlarim»
   * ro'yxatida takrorlanmaydi: tor panelda bir xil sarlavha ikki marta
   * chiqishi xatodek ko'rinardi.
   */
  const catalogueIds = new Set(shown.map((item) => item.id));
  const minePending = mine.filter((item) => !catalogueIds.has(item.id));

  return (
    <section className="scroll-mt-20 rounded-2xl border border-border/70 bg-card">
      <header className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">
            {t((x) => x.variants.variantNumber, { number: variant.number })}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {status === 'available'
              ? t((x) => x.variants.availableCount, { count: shown.length })
              : status === 'requested'
                ? t((x) => x.variants.requestCount, { count: requestCount })
                : m.variants.notReady}
          </p>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
            BADGE[status],
          )}
        >
          {STATUS_LABELS(m)[status]}
        </span>
      </header>

      <div className="p-3 sm:p-4">
        {status === 'available' ? (
          <ul className="space-y-2.5">
            {shown.map((solution) => (
              <li
                key={solution.id}
                className="rounded-xl border border-border/70 bg-background/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 text-[13px] leading-snug font-semibold text-foreground">
                    {solution.title}
                  </p>
                  <p className="shrink-0 text-[13px] font-bold text-emerald-700 dark:text-emerald-400">
                    {money.decimalSom(solution.price)}
                  </p>
                </div>

                {/* Bo'laklar QO'SHILIB yoziladi: yuklovchining ismi bo'sh
                    bo'lishi mumkin va qat'iy «·» lar oxirida osilib
                    qolgan ajratgich qoldirardi. */}
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                  <span className="truncate">
                    {[
                      Number(solution.average_rating).toFixed(1),
                      t((x) => x.variants.sales, { count: solution.sold_count }),
                      solution.uploader.full_name?.trim(),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </p>

                {/*
                  Yorliqlarda faqat backend beradigan narsa turadi.
                  Maketdagi «DOCX» va «9 bet» YO'Q: `PublicSolution` da na
                  fayl turi, na sahifalar soni bor va ularni chizish
                  o'ylab topish bo'lardi.
                */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {dates.date(solution.created_at)}
                  </span>
                  {solution.review_count > 0 && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {t((x) => x.variants.reviews, { count: solution.review_count })}
                    </span>
                  )}
                </div>

                {/* Uch holat: o'zi yuklagan, sotib olgan, hali olmagan.
                    `boughtIds` — shu seansda sotib olinganlari: kutubxona
                    ro'yxati keshdan yangilanguncha tugma darrov o'zgarsin. */}
                {!ownershipReady ? (
                  /* Javob kelguncha tugmaning o'rni turadi — yozuvsiz.
                     Balandligi tugmanikiga teng, shunda holat aniqlangach
                     karta siljimaydi. */
                  <div
                    aria-hidden
                    className="mt-2.5 h-9 w-full animate-pulse rounded-lg bg-muted"
                  />
                ) : myUploadById.has(solution.id) ? (
                  <a
                    href={myUploadById.get(solution.id)!.file}
                    target="_blank"
                    rel="noreferrer"
                    className="solution-action-in mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border/70 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Download className="size-3.5" />
                    {m.variants.download}
                  </a>
                ) : boughtIds.includes(solution.id) || ownedIds.has(solution.id) ? (
                  <OwnedSolutionButton
                    solutionId={solution.id}
                    className="solution-action-in mt-2.5 w-full"
                  />
                ) : (
                  <Button
                    variant="emerald"
                    size="sm"
                    className="solution-action-in mt-2.5 w-full"
                    /* Pul haqiqiy balansdan ketadi — bosish bilan darhol
                       yechilmaydi, avval oyna nima qancha turishini va
                       balansda qancha borligini ko'rsatadi. */
                    onClick={() => setBuyTarget(solution)}
                  >
                    <ShoppingCart className="size-3.5" />
                    {m.variants.buy}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2.5 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] p-3">
            {requestCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                <Flame className="size-3" />
                {t((x) => x.variants.demandWithCount, { count: requestCount })}
              </span>
            )}

            <p className="text-[11px] leading-snug text-muted-foreground">
              {m.variants.notUploaded}
            </p>

            {!requestReady ? (
              /* Amber quti ichida turgani uchun rangi ham shu qutiniki. */
              <ActionPlaceholder className="bg-amber-500/15" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="solution-action-in w-full border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
                disabled={requestState.isLoading || alreadyRequested}
                onClick={() => {
                  void requestVariant(variant.id)
                    .unwrap()
                    .then(() => onRequested(variant.id))
                    .catch(() => undefined);
                }}
              >
                {requestState.isLoading
                  ? m.variants.sending
                  : alreadyRequested
                    ? m.variants.requestSent
                    : m.variants.leaveRequest}
              </Button>
            )}

            {requestState.error && !alreadyRequested && (
              <p role="alert" className="text-[11px] text-destructive">
                {getApiErrorMessage(requestState.error)}
              </p>
            )}
          </div>
        )}

        {/*
          Foydalanuvchining o'z yuborganlari — holati bilan. Chop
          etilmagunicha ular katalogda ko'rinmaydi, shuning uchun bu
          ro'yxatsiz odam yechimi yetib bordimi-yo'qmi bilmasdi.
        */}
        {minePending.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {minePending.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/40 px-2.5 py-1.5"
              >
                <span
                  className="min-w-0 flex-1 truncate text-[11px] text-foreground"
                  title={item.title}
                >
                  {item.title}
                  <span className="ml-1.5 text-muted-foreground/80">
                    {dates.date(item.created_at)}
                  </span>
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
                  {solutionStatusLabel(item.status, m)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*
        Yechim yuborish — AYNAN SHU YERDA, tanlangan variantning
        yechimlari ostida.

        Sahifa sarlavhasida turganda tugma qaysi variantni nazarda
        tutayotganini aytmasdi: odam 7-variantni tanlab, ekranning tepasidagi
        tugmani bosardi va oyna «7-variant» deyishiga ishonishdan boshqa
        chorasi qolmasdi. Bu yerda tanlov ko'z oldida turadi.

        Shart-sharoit ham shu yerda: nechta yubora olasiz, qabul ochiqmi,
        moderatsiya nima qiladi.
      */}
      <footer className="border-t border-border/60 px-4 py-3">
        {!variant.submissions_open ? (
          /* Yopilgani ochiq aytiladi. Tugmani shunchaki yashirish «bu yerda
             yuklab bo'lmaydi» degan xulosani o'zi chiqarishga qoldirardi;
             yuklashga urinib, xato olishdan esa yomonroq. */
          <p className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
            <Lock className="mt-px size-3 shrink-0" />
            {m.variants.uploadsClosed}
          </p>
        ) : !uploadsReady ? (
          <ActionPlaceholder />
        ) : uploadsLeft === 0 ? (
          /* Chegaraga yetildi. Tugmani ko'rsatib, keyin serverdan xato
             qaytarish o'rniga sababi shu yerda aytiladi. */
          <p className="solution-action-in text-[11px] leading-snug text-muted-foreground">
            {t((x) => x.variants.uploadLimitReached, { max: MAX_UPLOADS_PER_VARIANT })}
          </p>
        ) : (
          /* Tugma va uning ostidagi izoh BIRGA ochiladi: izohdagi son ham
             o'sha javobdan keladi. */
          <div className="solution-action-in">
            <Button
              variant="emerald"
              size="sm"
              className="w-full"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="size-3.5" />
              {t((x) => x.variants.uploadForVariant, { number: variant.number })}
            </Button>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              {mine.length > 0
                ? t((x) => x.variants.uploadsLeft, { count: uploadsLeft })
                : t((x) => x.variants.uploadLimitHint, { max: MAX_UPLOADS_PER_VARIANT })}{' '}
              {m.variants.moderationNote}
            </p>
          </div>
        )}
      </footer>

      <SolutionUploadModal
        open={uploadOpen}
        variantId={variant.id}
        variantNumber={variant.number}
        assignmentTitle={assignmentTitle}
        onClose={() => setUploadOpen(false)}
      />

      {/* Shartli chiziladi: oyna har yechim uchun boshlang'ich qiymatlarni
          holatga bir marta oladi, ya'ni yopilib-ochilganda o'zi tozalanadi. */}
      {buyTarget && (
        <PurchaseModal
          open
          solution={buyTarget}
          assignmentTitle={assignmentTitle}
          variantLabel={t((x) => x.variants.variantNumber, { number: variant.number })}
          subjectName={subjectName}
          universityShortName={universityShortName}
          onClose={() => setBuyTarget(null)}
          onPurchased={() => setBoughtIds((current) => [...current, buyTarget.id])}
        />
      )}
    </section>
  );
}
