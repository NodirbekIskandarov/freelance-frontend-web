'use client';

import { ArrowUpRight, Gift } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Link } from '@/i18n/Link';
import { cn } from '@/lib/cn';
import { toSlug, toSlugId } from '@/lib/slug';
import { isVisibleAssignmentType } from '@/shared/types/assignmentTypes';
import {
  REQUEST_STATUS_LABELS,
  type MyAssignmentRequest,
  type MySolutionRequest,
  type MySubjectRequest,
  type RequestStatus,
} from '@/shared/types/myRequests';

import {
  useGetMyAssignmentRequestsQuery,
  useGetMySolutionRequestsQuery,
  useGetMySubjectRequestsQuery,
} from './requestsApi';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { useDates } from '@/lib/useDates';

/*
 * Institut arizasi bu yerda YO'Q.
 *
 * Institutni katalogga qo'shish talabaning ishi emas — u ma'muriy qaror va
 * saytda institut qo'shish so'rovini qoldiradigan joy ham yo'q. Tab bor
 * ekan, u har doim bo'sh turardi va kabinetni "nimadir ishlamayapti" degan
 * taassurot bilan ochardi.
 */
const TABS = [
  { key: 'subjects', label: (m: Messages) => m.requests.tabSubjects },
  { key: 'assignments', label: (m: Messages) => m.requests.tabAssignments },
  { key: 'variants', label: (m: Messages) => m.requests.tabVariants },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const statusTones: Record<RequestStatus, string> = {
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-destructive/12 text-destructive',
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        statusTones[status],
      )}
    >
      {REQUEST_STATUS_LABELS[status]}
    </span>
  );
}

/**
 * Katalogdagi manzil.
 *
 * Fan va topshiriq bo'lagi «nom-qisqaID» ko'rinishida: katalog qidirishni
 * ID bo'yicha qiladi, ya'ni admin sarlavhani to'g'rilagan bo'lsa ham
 * havola ishlayveradi. Universitet bo'lagi esa QISQA NOMDAN yasaladi va
 * u aniq mos kelishi shart — shuning uchun `university_short_name`
 * backenddan alohida keladi.
 */
function cataloguePath(
  universityShortName: string,
  universityName: string,
  parts: string[],
): string {
  return ['/materials', toSlug(universityShortName || universityName), ...parts].join('/');
}

/**
 * Topshiriq sahifasi HAMMA tur uchun mavjud emas.
 *
 * Katalog `course_work` va `other` turlarini ataylab chiqarmaydi —
 * ularning manzili 404 beradi. Bunday holatda havola FANGA olib
 * boradi: odam baribir o'sha yerga tushadi, faqat bir qadam yuqoriroq.
 */
function assignmentOrSubjectPath(
  universityShortName: string,
  universityName: string,
  subjectSlug: string,
  assignmentSlug: string,
  assignmentType: string,
): string {
  const parts = isVisibleAssignmentType(assignmentType)
    ? [subjectSlug, assignmentSlug]
    : [subjectSlug];

  return cataloguePath(universityShortName, universityName, parts);
}

/** Barcha ariza turlari bir xil karta ichida — faqat matni farq qiladi. */
function RequestCard({
  title,
  meta,
  status,
  rewardGranted,
  rejectReason,
  createdAt,
  href,
  extra,
}: {
  title: string;
  meta: string;
  status?: RequestStatus;
  rewardGranted?: boolean;
  rejectReason?: string;
  createdAt: string;
  /**
   * Katalogdagi yozuv — faqat ariza TASDIQLANGANDA bo'ladi.
   *
   * Havola AYNAN sarlavhada, butun karta emas: kartaning ichida
   * allaqachon havola bor («Fayl»), ikkinchisini ustiga qo'yish esa
   * yaroqsiz HTML va bosilganda qaysi biri ishlashi noaniq bo'lardi.
   */
  href?: string;
  extra?: ReactNode;
}) {
  const { m } = useT();
  const dates = useDates();

  return (
    <article className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          {href ? (
            <Link
              href={href}
              title={m.requests.openInCatalogue}
              className="group inline-flex items-start gap-1 text-sm font-bold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {title}
              <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
            </Link>
          ) : (
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/80">{dates.dateTime(createdAt)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status && <StatusBadge status={status} />}
          {/* Mukofot faqat tasdiqlangan arizada beriladi. */}
          {rewardGranted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/12 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400">
              <Gift className="size-3.5" />
              {m.requests.rewarded}
            </span>
          )}
          {extra}
        </div>
      </div>

      {rejectReason && (
        <p className="mt-3 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs leading-relaxed text-destructive">
          {rejectReason}
        </p>
      )}
    </article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">Ariza topilmadi</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export function MyRequests() {
  const { t, m } = useT();
  const [tab, setTab] = useState<TabKey>('subjects');

  const query = { page_size: 50, ordering: '-created_at' };

  // Uchtasi ham birdaniga so'raladi: har biri kichik ro'yxat va
  // tab almashganda kutish bo'lmaydi. RTK Query keshi takroriy
  // so'rovlarni o'zi to'xtatadi.
  const subjects = useGetMySubjectRequestsQuery(query);
  const assignments = useGetMyAssignmentRequestsQuery(query);
  const variants = useGetMySolutionRequestsQuery(query);

  const counts: Record<TabKey, number> = {
    subjects: subjects.data?.count ?? 0,
    assignments: assignments.data?.count ?? 0,
    variants: variants.data?.count ?? 0,
  };

  const error = subjects.error ?? assignments.error ?? variants.error ?? undefined;

  if (error) return <ErrorNotice error={error} />;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            aria-pressed={tab === item.key}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              tab === item.key
                ? 'bg-emerald-600 text-white'
                : 'border border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label(m)}
            {counts[item.key] > 0 && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] leading-4 font-bold',
                  tab === item.key ? 'bg-white/25' : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[item.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'subjects' &&
          (subjects.isLoading ? (
            <Skeletons />
          ) : subjects.data?.results.length === 0 ? (
            <EmptyState message={m.requests.emptySubjects} />
          ) : (
            <div className="grid gap-3">
              {subjects.data?.results.map((row: MySubjectRequest) => (
                <RequestCard
                  key={row.id}
                  title={row.name}
                  meta={[
                    row.university_short_name || row.university_name,
                    row.course ? t((x) => x.materials.course, { course: row.course }) : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  status={row.status}
                  rewardGranted={row.reward_granted}
                  rejectReason={row.reject_reason}
                  createdAt={row.created_at}
                  href={
                    row.created_subject
                      ? cataloguePath(row.university_short_name, row.university_name, [
                          toSlugId(row.name, row.created_subject),
                        ])
                      : undefined
                  }
                />
              ))}
            </div>
          ))}

        {tab === 'assignments' &&
          (assignments.isLoading ? (
            <Skeletons />
          ) : assignments.data?.results.length === 0 ? (
            <EmptyState message={m.requests.emptyAssignments} />
          ) : (
            <div className="grid gap-3">
              {assignments.data?.results.map((row: MyAssignmentRequest) => (
                <RequestCard
                  key={row.id}
                  title={row.title}
                  meta={[
                    row.university_name,
                    row.subject_name,
                    row.variant_count
                      ? t((x) => x.tasks.variantCount, { count: row.variant_count })
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  status={row.status}
                  rewardGranted={row.reward_granted}
                  rejectReason={row.reject_reason}
                  createdAt={row.created_at}
                  href={
                    row.created_assignment
                      ? assignmentOrSubjectPath(
                          row.university_short_name,
                          row.university_name,
                          toSlugId(row.subject_name, row.subject),
                          toSlugId(row.title, row.created_assignment),
                          row.type,
                        )
                      : undefined
                  }
                  extra={
                    row.file ? (
                      <a
                        href={row.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        {m.requests.file}
                      </a>
                    ) : undefined
                  }
                />
              ))}
            </div>
          ))}

        {tab === 'variants' &&
          (variants.isLoading ? (
            <Skeletons />
          ) : variants.data?.results.length === 0 ? (
            <EmptyState message={m.requests.emptyVariants} />
          ) : (
            <div className="grid gap-3">
              {variants.data?.results.map((row: MySolutionRequest) => (
                <RequestCard
                  key={row.id}
                  title={`${row.assignment_title} — ${row.variant_number}-variant`}
                  meta={[
                    row.university_name,
                    row.subject_name,
                    t((x) => x.requests.requestCount, { count: row.request_count }),
                  ].join(' · ')}
                  createdAt={row.created_at}
                  href={assignmentOrSubjectPath(
                    row.university_short_name,
                    row.university_name,
                    toSlugId(row.subject_name, row.subject),
                    toSlugId(row.assignment_title, row.assignment),
                    row.assignment_type,
                  )}
                  extra={
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                        row.is_fulfilled
                          ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
                      )}
                    >
                      {row.is_fulfilled ? 'Yechim chiqdi' : 'Kutilmoqda'}
                    </span>
                  }
                />
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
