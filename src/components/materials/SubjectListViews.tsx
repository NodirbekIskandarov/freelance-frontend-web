'use client';

import { Link } from '@/i18n/Link';

import { useT } from '@/i18n/useT';
import { SubjectIcon } from '@/lib/catalogueVisuals';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import { useMoney } from '@/lib/useMoney';

import type { SubjectWithCount } from './CatalogueCards';

/**
 * Fanlar ro'yxatining ikki ko'rinishi: jadval va kartalar.
 *
 * Ikkalasi ham AYNAN bir xil ma'lumotni ko'rsatadi va bir xil joyga —
 * fanning topshiriqlari sahifasiga — olib boradi. «Ochish» tugmasi
 * ATAYLAB yo'q: qator ham, kartaning o'zi ham havola, va har qatorda
 * takrorlanadigan bir xil tugma faqat joy egallardi.
 */

/** Fandagi sanoqlar — backend annotatsiyalari, bo'lmasa nol. */
function countsOf(subject: SubjectWithCount) {
  const variants = subject.variant_count ?? 0;
  const solved = subject.solved_variant_count ?? 0;

  return {
    assignments: subject.assignmentCount,
    variants,
    solved,
    solutions: subject.solution_count ?? 0,
    authors: subject.author_count ?? 0,
    /* Nol variantda foiz YO'Q: `0/0` ni 0% deb ko'rsatish «hech kim
       yechmagan» degan ma'no berardi, holbuki yechadigan narsaning
       o'zi yo'q. */
    percent: variants > 0 ? Math.round((solved / variants) * 100) : null,
  };
}

function SolutionBadge({ count }: { count: number }) {
  const { t, m } = useT();

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[11px] font-semibold whitespace-nowrap tabular-nums',
        count > 0
          ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {count > 0 ? t((x) => x.materials.solutionsBadge, { count }) : m.materials.noSolutions}
    </span>
  );
}

/** «15 / 47» va to'ldirilgan chiziq — fanning qanchasi javoblangani. */
function SolvedProgress({
  solved,
  variants,
  percent,
  label,
  showPercent = true,
}: {
  solved: number;
  variants: number;
  percent: number | null;
  /** Kartadagi izoh («Yechimi bor variant») — jadvalda ustun sarlavhasi bor. */
  label?: string;
  showPercent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2 text-[11px] tabular-nums">
        {label && <span className="truncate text-muted-foreground">{label}</span>}
        <span className={cn('text-muted-foreground', label && 'shrink-0 font-medium')}>
          {formatCount(solved)} / {formatCount(variants)}
        </span>
        {showPercent && percent !== null && (
          <span className="font-medium text-muted-foreground">{percent}%</span>
        )}
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-[width]',
            percent === null || percent === 0
              ? 'bg-transparent'
              : percent >= 100
                ? 'bg-emerald-500'
                : 'bg-amber-400',
          )}
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}

/** «o'rtacha 9 000 so'm · 5 muallif» — fan nomi ostidagi ikkinchi qator. */
function SubjectMeta({ subject }: { subject: SubjectWithCount }) {
  const { t, m } = useT();
  const money = useMoney();
  const { authors } = countsOf(subject);

  const average = Number(subject.average_price);

  if (!subject.average_price || authors === 0 || Number.isNaN(average)) {
    return <span className="text-muted-foreground">{m.materials.noAuthors}</span>;
  }

  return (
    <span className="text-muted-foreground">
      {t((x) => x.materials.averagePrice, {
        /* BUTUN so'mgacha yaxlitlanadi. O'rtacha uchta narxdan
           «13 363,64 so'm» bo'lib chiqishi mumkin, lekin tiyin bu yerda
           ma'lumot emas — shovqin: qator narxni emas, KATTALIK tartibini
           aytadi. */
        price: money.som(Math.round(average)),
      })}{' '}
      · {t((x) => x.materials.authors, { count: authors })}
    </span>
  );
}

function CourseTags({ subject }: { subject: SubjectWithCount }) {
  const { t } = useT();

  if (!subject.course && !subject.semester) return null;

  return (
    <>
      {subject.course && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-muted-foreground">
          {t((x) => x.materials.course, { course: subject.course ?? 0 })}
        </span>
      )}
      {subject.semester && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-muted-foreground">
          {t((x) => x.materials.semesterValue, { value: subject.semester ?? 0 })}
        </span>
      )}
    </>
  );
}

/*
 * Ustun kengliklari BITTA joyda.
 *
 * Sarlavha qatori va ma'lumot qatori alohida elementlar (qator — havola,
 * sarlavha — emas), ya'ni ularni brauzer o'zi tekislab bermaydi. Kenglik
 * ikki joyda yozilsa, ular albatta bir-biridan ajralib ketardi.
 *
 * Tor ekranda ustunlar birin-ketin YASHIRINADI, gorizontal aylantirish
 * o'rniga: telefonda jadvalni yonlamasiga surish — ustun sarlavhasi
 * ko'rinmay qolgan raqamlarni o'qish demak.
 */
const COL = {
  /* Eng tor holatda ham nomga joy qoladigan quyi chegara: usiz `flex-1`
     qolgan ustunlar yig'indisi sig'magan ekranda nomni nolgacha
     qisqartirib, qatorda faqat ikonka qoldirardi. */
  name: 'min-w-[6.5rem] flex-1',
  direction: 'hidden w-24 shrink-0 xl:block 2xl:w-32',
  /* Ikkala yorliq («2-kurs», «6-semestr») BIR QATORGA sig'adigan kenglik:
     torroq bo'lsa ular ikkinchi qatorga tushib, butun jadval qatorini
     ikki barobar balandlashtirardi. */
  course: 'hidden w-[132px] shrink-0 lg:flex lg:flex-wrap lg:gap-1',
  /* Raqamli ustunlar sarlavhasi («VARIANTLAR») raqamning o'zidan keng —
     kenglik shunga qarab olingan, aks holda sarlavhalar bir-birining
     ustiga chiqib ketardi. */
  assignments: 'hidden w-16 shrink-0 text-right lg:block',
  variants: 'hidden w-[68px] shrink-0 text-right lg:block',
  solved: 'hidden w-24 shrink-0 lg:block',
  solution: 'w-[84px] shrink-0 text-right',
};

export function SubjectTable({
  subjects,
  universitySlug,
}: {
  subjects: SubjectWithCount[];
  universitySlug: string;
}) {
  const { m } = useT();

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-2.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase sm:px-4">
        {/* Ikonka ustuni sarlavhasiz — uning tepasida yozadigan so'z yo'q. */}
        <span aria-hidden className="w-9 shrink-0" />
        <span className={cn(COL.name, 'truncate')}>{m.materials.colSubject}</span>
        <span className={cn(COL.direction, 'truncate')}>{m.materials.colDirection}</span>
        <span className={cn(COL.course, 'truncate lg:block')}>{m.materials.colCourse}</span>
        <span className={cn(COL.assignments, 'truncate')}>{m.materials.colAssignments}</span>
        <span className={cn(COL.variants, 'truncate')}>{m.materials.colVariants}</span>
        <span className={cn(COL.solved, 'truncate')}>{m.materials.colSolved}</span>
        <span className={cn(COL.solution, 'truncate')}>{m.materials.colSolution}</span>
      </div>

      <ul className="divide-y divide-border/60">
        {subjects.map((subject) => {
          const counts = countsOf(subject);

          return (
            <li key={subject.id}>
              <Link
                href={`/materials/${universitySlug}/${subject.slug}`}
                className="group flex items-center gap-2 px-3 py-3.5 transition-colors hover:bg-emerald-500/[0.04] sm:px-4 lg:py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20 dark:text-emerald-400">
                  <SubjectIcon name={subject.name} className="size-4" />
                </span>

                <span className={COL.name}>
                  <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {subject.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px]">
                    <SubjectMeta subject={subject} />
                  </span>

                  {/*
                    Telefonda «Yechilgan» ustuni yo'q — chiziq nom ostiga
                    tushadi. Usiz tor ekranda qatorda faqat nom va rozetka
                    qolardi: fanning qanchasi javoblangani jadvalning eng
                    foydali soni, va u aynan telefonda yo'qolardi.
                  */}
                  <span className="mt-1.5 block max-w-[15rem] lg:hidden">
                    <SolvedProgress
                      solved={counts.solved}
                      variants={counts.variants}
                      percent={counts.percent}
                    />
                  </span>
                </span>

                <span className={cn(COL.direction, 'truncate text-xs text-muted-foreground')}>
                  {subject.direction_name || '—'}
                </span>

                <span className={COL.course}>
                  <CourseTags subject={subject} />
                </span>

                <span
                  className={cn(
                    COL.assignments,
                    'text-sm font-semibold text-foreground tabular-nums',
                  )}
                >
                  {formatCount(counts.assignments)}
                </span>

                <span className={cn(COL.variants, 'text-sm text-muted-foreground tabular-nums')}>
                  {formatCount(counts.variants)}
                </span>

                <span className={COL.solved}>
                  <SolvedProgress
                    solved={counts.solved}
                    variants={counts.variants}
                    percent={counts.percent}
                  />
                </span>

                <span className={cn(COL.solution, 'flex justify-end')}>
                  <SolutionBadge count={counts.solutions} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SubjectCardGrid({
  subjects,
  universitySlug,
}: {
  subjects: SubjectWithCount[];
  universitySlug: string;
}) {
  const { m } = useT();

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {subjects.map((subject, index) => {
        const counts = countsOf(subject);

        return (
          <Link
            key={subject.id}
            href={`/materials/${universitySlug}/${subject.slug}`}
            style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
            className="card-enter card-lift group flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card p-3 transition-colors hover:border-emerald-500/45 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20 dark:text-emerald-400">
                <SubjectIcon name={subject.name} className="size-[18px]" />
              </span>
              <SolutionBadge count={counts.solutions} />
            </div>

            <h3 className="mt-3 line-clamp-2 text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-emerald-700 sm:text-[15px] dark:group-hover:text-emerald-300">
              {subject.name}
            </h3>

            {/* `flex-1` shu yerda: kurs yorliqlari bo'lmagan kartada ham
                pastdagi chiziq boshqalari bilan bir sathda tursin. */}
            <div className="mt-2 flex flex-1 flex-wrap items-start gap-1">
              <CourseTags subject={subject} />
            </div>

            <div className="mt-3 border-t border-border/50 pt-2.5">
              <SolvedProgress
                solved={counts.solved}
                variants={counts.variants}
                percent={counts.percent}
                label={m.materials.solvedVariants}
                showPercent={false}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
