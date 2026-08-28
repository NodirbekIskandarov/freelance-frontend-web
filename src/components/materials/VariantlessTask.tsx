'use client';

import { Flame, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  useGetMySolutionRequestsQuery,
  useRequestAssignmentSolutionMutation,
} from '@/features/requests/requestsApi';
import { SolutionUploadModal } from '@/features/solutions/SolutionUploadModal';
import { useGetMySolutionsQuery } from '@/features/solutions/solutionsApi';
import { getApiErrorMessage } from '@/shared/api/errors';
import { solutionStatusLabel } from '@/shared/types/solutions';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

/** Backenddagi `MAX_SOLUTIONS_PER_USER_PER_VARIANT` bilan bir xil. */
const MAX_UPLOADS = 2;

/**
 * Variantsiz topshiriq paneli.
 *
 * Guruhga o'zgarishsiz beriladigan topshiriqda raqamlangan variantlar yo'q.
 * Ilgari bu yerda «Bu topshiriqda variantlar yo'q» degan yozuv turardi va
 * boshqa hech nima qilib bo'lmasdi — na so'rov qoldirish, na yechim
 * yuborish. Amallar variantli topshiriqdagi bilan bir xil, faqat variant
 * tanlash bosqichi yo'q: backend yagona variantni birinchi foydalanishda
 * o'zi ochadi.
 */
export function VariantlessTask({
  assignmentId,
  assignmentTitle,
}: {
  assignmentId: string;
  assignmentTitle: string;
}) {
  const { t, m } = useT();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [requestSolution, requestState] = useRequestAssignmentSolutionMutation();
  const [justRequested, setJustRequested] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const myUploads = useGetMySolutionsQuery(
    { variant__assignment: assignmentId, page_size: 100 },
    { skip: !isAuthenticated },
  );
  const myRequests = useGetMySolutionRequestsQuery(
    { variant__assignment: assignmentId, page_size: 100 },
    { skip: !isAuthenticated },
  );

  const mine = myUploads.data?.results ?? [];
  const uploadsLeft = Math.max(0, MAX_UPLOADS - mine.length);
  const alreadyRequested = justRequested || (myRequests.data?.count ?? 0) > 0;

  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-semibold text-foreground">Yagona topshiriq</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{m.variants.variantless}</p>

      {/*
        Chop etilgan yechim bu yerda BO'LISHI MUMKIN EMAS: yechim variantga
        biriktiriladi, variant paydo bo'lishi bilan esa topshiriq
        variantsiz bo'lmay qoladi va odatiy variantlar to'ri chiziladi.
        Shuning uchun panel faqat talab va yuklashni ko'rsatadi.
      */}
      <div className="mt-3 space-y-2.5 rounded-lg border border-amber-500/40 bg-amber-500/[0.06] p-3">
        {alreadyRequested && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
            <Flame className="size-3" />
            {m.variants.requestLeft}
          </span>
        )}

        <p className="text-[11px] leading-snug text-muted-foreground">
          {m.variants.notUploadedYet}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
          disabled={requestState.isLoading || alreadyRequested}
          onClick={() => {
            void requestSolution(assignmentId)
              .unwrap()
              .then(() => setJustRequested(true))
              .catch(() => undefined);
          }}
        >
          {requestState.isLoading
            ? m.variants.sending
            : alreadyRequested
              ? m.variants.requestSent
              : m.variants.leaveRequest}
        </Button>

        {requestState.error && !alreadyRequested && (
          <p role="alert" className="text-[11px] text-destructive">
            {getApiErrorMessage(requestState.error)}
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-border/70 pt-3">
        {/* Foydalanuvchining o'z yuborganlari — chop etilmagunicha ular
            katalogda ko'rinmaydi, shuning uchun bu ro'yxatsiz odam yechimi
            yetib bordimi-yo'qmi bilmasdi. */}
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
                  {solutionStatusLabel(item.status, m)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {uploadsLeft > 0 ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="size-3.5" />
              {m.variants.upload}
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {mine.length > 0
                ? t((x) => x.variants.uploadsLeft, { count: uploadsLeft })
                : t((x) => x.variants.assignmentUploadHint, { max: MAX_UPLOADS })}
            </p>
          </>
        ) : (
          <p className="text-[11px] leading-snug text-muted-foreground">
            {t((x) => x.variants.assignmentLimitReached, { max: MAX_UPLOADS })}
          </p>
        )}
      </div>

      <SolutionUploadModal
        open={uploadOpen}
        assignmentId={assignmentId}
        assignmentTitle={assignmentTitle}
        onClose={() => setUploadOpen(false)}
      />
    </div>
  );
}
