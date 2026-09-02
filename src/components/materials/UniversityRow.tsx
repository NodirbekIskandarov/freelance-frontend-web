'use client';

import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { cn } from '@/lib/cn';
import { gradientFor, initialsOf, SubjectIcon } from '@/lib/catalogueVisuals';
import type { Subject, University } from '@/shared/types/catalogue';
import { useT } from '@/i18n/useT';

/** Qatorda ko'rinadigan fan soni — qolgani institut sahifasida. */
const VISIBLE_SUBJECTS = 4;

export interface SubjectWithCount extends Subject {
  /** Fandagi topshiriqlar soni — kartadagi rozetka. */
  assignmentCount: number;
  /** Manzil segmenti (`nom-qisqaID`). */
  slug: string;
}

export function UniversityLogo({
  university,
  className,
}: {
  university: Pick<University, 'id' | 'short_name' | 'name'>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-base font-bold text-white ring-4 ring-card',
        gradientFor(university.id),
        className,
      )}
    >
      {initialsOf(university.short_name || university.name)}
    </div>
  );
}

export function SubjectMiniCard({
  subject,
  universitySlug,
  className,
  /**
   * To'rdagi o'rni — chiqish animatsiyasi navbatini belgilaydi.
   *
   * Kechikish 6 tadan keyin o'sishdan to'xtaydi: uzun ro'yxatda oxirgi
   * karta yarim soniyadan ko'p kutib qolardi va bu sekinlik bo'lib
   * tuyulardi, jonlilik emas.
   */
  index = 0,
}: {
  subject: SubjectWithCount;
  universitySlug: string;
  className?: string;
  index?: number;
}) {
  const hasAssignments = subject.assignmentCount > 0;

  return (
    <Link
      href={`/materials/${universitySlug}/${subject.slug}`}
      style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
      className={cn(
        'card-enter card-lift card-sheen group hover: relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-3 hover:border-emerald-500/45 hover:bg-emerald-500/[0.04] sm:p-3.5 dark:border-zinc-700/80 dark:bg-zinc-900',
        className,
      )}
    >
      {/* Yuqori chekkadagi rangli chiziq — karta ustiga borilganda kengayadi.
          Faqat bezak, shuning uchun skrinriderdan yashirilgan. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-500/20 group-hover:ring-emerald-500/25 dark:text-emerald-400">
          <SubjectIcon name={subject.name} className="size-[18px]" />
        </span>

        {/*
          Topshiriqsiz fanda rozetka kulrang: nol ham raqam, lekin uni
          yashilda ko'rsatish "tayyor material bor" degan taassurot berardi.
        */}
        <span
          className={cn(
            'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums transition-colors',
            hasAssignments
              ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground dark:bg-zinc-800',
          )}
        >
          {subject.assignmentCount}
        </span>
      </div>

      {/*
        `flex-1` ATAYLAB YO'Q. U bo'lganda sarlavha qolgan bo'sh joyni
        egallab, yorliqlarni kartaning pastiga itarardi. To'rdagi kartalar
        bir xil balandlikka cho'zilgani uchun bu sarlavha bilan yorliqlar
        orasida katta teshik ochardi — «Falsafa» kabi bitta yorlig'i bor
        fanda ayniqsa ko'rinardi. Yorliqlar pastda TEKISLANMASDI ham:
        yorliqlar soni har fanda har xil.
      */}
      <h3 className="mt-2.5 line-clamp-2 text-[15px] leading-snug font-bold text-foreground transition-colors group-hover:text-emerald-700 sm:text-base dark:group-hover:text-emerald-300">
        {subject.name}
      </h3>

      {/*
        Kurs, semestr va yo'nalish — alohida yorliqlar, bitta uzun qator
        emas.

        Ilgari ular «1-kurs · 2-semestr · Sun'iy intellekt» bo'lib bitta
        qatorga sig'dirilardi va tor kartada oxiri kesilib ketardi:
        yo'nalish ko'rinmasdi, ba'zan semestr ham. Yorliqlar esa keyingi
        qatorga o'tadi.

        «Ko'rish →» OLIB TASHLANDI: kartaning o'zi havola va har kartada
        takrorlangan bir xil yozuv faqat balandlik egallardi.
      */}
      {(subject.course || subject.semester || subject.direction_name) && (
        <div className="mt-2.5 flex flex-wrap gap-1 border-t border-border/50 pt-2.5">
          {subject.course && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {subject.course}-kurs
            </span>
          )}
          {subject.semester && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {subject.semester}-semestr
            </span>
          )}
          {subject.direction_name && (
            <span
              title={subject.direction_name}
              className="max-w-full truncate rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {subject.direction_name}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

/**
 * Bitta institut va uning fanlari — materiallar sahifasidagi asosiy qator.
 *
 * Chapda institut kartasi, o'ngda birinchi to'rtta fan. Qolganlari
 * o'ngdagi strelka orqali institut sahifasida ochiladi.
 */
export function UniversityRow({
  university,
  subjects,
  slug,
}: {
  university: University;
  subjects: SubjectWithCount[];
  slug: string;
}) {
  const { m } = useT();
  const visible = subjects.slice(0, VISIBLE_SUBJECTS);
  const hasMore = subjects.length > VISIBLE_SUBJECTS;
  const href = `/materials/${slug}`;

  /*
   * Sanoqlar backenddan keladi. `subjects.length` ISHLATILMAYDI: bu massiv
   * filtrlangan bo'lishi mumkin va "3 ta fan" deb ko'rsatib, institut
   * sahifasida yigirma ikkitasini chiqarish yolg'on bo'lardi.
   */
  const stats = [
    { value: university.subject_count ?? subjects.length, label: 'fan' },
    { value: university.assignment_count ?? 0, label: 'topshiriq' },
    { value: university.solution_count ?? 0, label: 'yechim' },
  ].filter((item) => item.value > 0);

  return (
    <article className="group/row card-lift hover: overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-emerald-500/30">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="relative overflow-hidden border-b border-border/60 bg-muted/20 p-5 sm:p-6 lg:w-[220px] lg:shrink-0 lg:border-r lg:border-b-0 xl:w-[232px]">
          {/* Logotip rangidan olingan yumshoq yorug'lik — qator ustiga
              borilganda kuchayadi. Bezak, shuning uchun yashirin. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-emerald-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover/row:opacity-100"
          />

          <UniversityLogo
            university={university}
            className="transition-transform duration-300 group-hover/row:scale-105"
          />

          <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground">
            {university.short_name || university.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {university.name}
          </p>

          {/* Uchta sanoq: fan, topshiriq, yechim. Nol bo'lganlari
              chizilmaydi — ular hech nima aytmaydi, faqat joy egallaydi. */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stats.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                <span className="tabular-nums">{item.value}</span>
                <span className="font-medium opacity-80">{item.label}</span>
              </span>
            ))}
          </div>

          <Link
            href={href}
            className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-background text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            {m.ui.allSubjects}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/row:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-stretch gap-2.5 p-4 sm:gap-3 sm:p-5">
          {visible.length === 0 ? (
            <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
              {m.ui.noSubjectsYet}
            </p>
          ) : (
            <>
              {/*
                  `items-start` — kartalar mazmun balandligida qolsin.
                  Cho'zilganda ular chapdagi institut ustuni balandligiga
                  tenglashardi (logotip + sanoqlar + tugma ≈ 450px) va
                  ichi bo'm-bo'sh baland qutilar bo'lib chiqardi.
              */}
              <div className="grid min-w-0 flex-1 grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
                {visible.map((subject, index) => (
                  <SubjectMiniCard
                    key={subject.id}
                    subject={subject}
                    universitySlug={slug}
                    index={index}
                  />
                ))}
              </div>

              {hasMore && (
                <Link
                  href={href}
                  aria-label={`${university.short_name} — barcha fanlar`}
                  className="grid size-9 shrink-0 place-items-center self-center rounded-full border border-border/70 bg-background text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-300"
                >
                  <ChevronRight className="size-5" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
