'use client';

import { Link } from '@/i18n/Link';

import { cn } from '@/lib/cn';
import { gradientFor, initialsOf, SubjectIcon } from '@/lib/catalogueVisuals';
import type { Subject, University } from '@/shared/types/catalogue';

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
        'grid size-14 shrink-0 place-items-center rounded-2xl border text-base font-bold ring-4 ring-card',
        gradientFor(university.id),
        className,
      )}
    >
      {initialsOf(university.short_name || university.name)}
    </div>
  );
}

/**
 * Institut yorlig'i — rangli kvadratda QISQARTMA («TATU», «SamDU»).
 *
 * `UniversityLogo` dan farqi shu: u bosh harflarni oladi («TA»), bu esa
 * qisqartmaning o'zini. Ro'yxatda yonma-yon sakkizta institut turganda
 * ikki harf ularni ajratmaydi — «TDPU» va «TDIU» ikkalasi ham «TD»
 * bo'lib qolardi.
 *
 * Qisqartma juda uzun bo'lsa (yoki umuman bo'lmasa) bosh harflarga
 * qaytadi: olti belgidan ortig'i kvadratga sig'maydi.
 */
export function UniversityBadge({
  university,
  className,
}: {
  university: Pick<University, 'id' | 'short_name' | 'name'>;
  className?: string;
}) {
  const short = university.short_name.trim();
  const label = short && short.length <= 6 ? short : initialsOf(short || university.name);

  return (
    <span
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-xl border px-1 text-[10px] leading-none font-bold ',
        gradientFor(university.id),
        className,
      )}
    >
      {label}
    </span>
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
        'card-enter card-lift card-sheen group hover: relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-3 hover:border-emerald-500/45 hover:bg-emerald-500/[0.04] sm:p-3.5 dark:border-zinc-700/80 dark:bg-zinc-900',
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
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-brand ring-1 ring-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-500/20 group-hover:ring-emerald-500/25">
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
              ? 'bg-emerald-500/12 text-brand'
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
      <h3 className="mt-2.5 line-clamp-2 text-[15px] leading-snug font-bold text-foreground transition-colors group-hover:text-brand sm:text-base dark:group-hover:text-emerald-300">
        {subject.name}
      </h3>

      {/*
        Kurs, semestr va toifa — alohida yorliqlar, bitta uzun qator
        emas.

        Ilgari ular «1-kurs · 2-semestr · Sun'iy intellekt» bo'lib bitta
        qatorga sig'dirilardi va tor kartada oxiri kesilib ketardi:
        toifa ko'rinmasdi, ba'zan semestr ham. Yorliqlar esa keyingi
        qatorga o'tadi.

        «Ko'rish →» OLIB TASHLANDI: kartaning o'zi havola va har kartada
        takrorlangan bir xil yozuv faqat balandlik egallardi.
      */}
      {(subject.course || subject.semester || subject.category_name) && (
        <div className="mt-2.5 flex flex-wrap gap-1 border-t border-border pt-2.5">
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
          {subject.category_name && (
            <span
              title={subject.category_name}
              className="max-w-full truncate rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {subject.category_name}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
