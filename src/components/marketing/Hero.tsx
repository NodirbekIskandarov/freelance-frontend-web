'use client';

import {
  BookOpen,
  CheckCheck,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { type ComponentType, type CSSProperties } from 'react';

import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/Link';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import { toSlug, toSlugId } from '@/lib/slug';
import type { LandingHighlights } from '@/server/landing/highlights';

/*
 * Hero atrofidagi kartalar — platformada nima borligini bir qarashda
 * aytadi. Ular bezak, shuning uchun matn tarjimadan, joylashuv esa shu
 * yerda.
 */
const floatingCards = [
  {
    title: (m: Messages) => m.home.cardAssignments,
    desc: (m: Messages) => m.home.cardAssignmentsDesc,
    icon: ClipboardList,
    accent: 'bg-emerald-500/20 text-emerald-300',
    className: 'left-0 top-[4%] md:left-[2%]',
  },
  {
    title: (m: Messages) => m.home.cardNotes,
    desc: (m: Messages) => m.home.cardNotesDesc,
    icon: BookOpen,
    accent: 'bg-violet-500/20 text-violet-300',
    className: 'right-0 top-[4%] md:right-[2%]',
  },
  {
    title: (m: Messages) => m.home.cardDrawing,
    desc: (m: Messages) => m.home.cardDrawingDesc,
    icon: FileText,
    accent: 'bg-teal-500/20 text-teal-300',
    className: 'bottom-[6%] left-0 md:left-[2%]',
  },
  {
    title: (m: Messages) => m.home.cardDiploma,
    desc: (m: Messages) => m.home.cardDiplomaDesc,
    icon: GraduationCap,
    accent: 'bg-orange-500/20 text-orange-300',
    className: 'right-0 bottom-[6%] md:right-[2%]',
  },
] as const;

export function Hero({
  highlights,
  guaranteeLabel,
}: {
  highlights: LandingHighlights;
  /** Kafolat muddati — SERVERDAN kelgan qiymatdan yasalgan matn. */
  guaranteeLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_70%_20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(700px_400px_at_20%_80%,rgba(99,102,241,0.12),transparent_55%)]"
        aria-hidden
      />

      <Container className="relative z-10 pt-10 pb-10 sm:pt-14 sm:pb-12 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <HeroContent highlights={highlights} guaranteeLabel={guaranteeLabel} />
          <HeroVisual highlights={highlights} />
        </div>

        <div className="mt-10 sm:mt-12">
          <InstituteStrip highlights={highlights} />
        </div>
      </Container>
    </section>
  );
}

const RISE_DELAYS = ['0ms', '100ms', '200ms'];

function HeroContent({
  highlights,
  guaranteeLabel,
}: {
  highlights: LandingHighlights;
  guaranteeLabel: string;
}) {
  const { m } = useT();

  const promises: { icon: LucideIcon; label: string }[] = [
    { icon: ShieldCheck, label: m.home.promiseModerated },
    { icon: Clock, label: guaranteeLabel },
    { icon: Star, label: m.home.promiseLibrary },
  ];

  return (
    <div className="mx-auto max-w-[600px] text-center lg:mx-0 lg:max-w-none lg:text-left">
      <h1
        className="hero-rise text-[2rem] leading-[1.1] font-bold tracking-tight sm:text-[2.65rem] lg:text-[3.4rem] lg:leading-[1.06]"
        style={{ animationDelay: RISE_DELAYS[0] }}
      >
        {m.home.heroTitle}{' '}
        <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
          {m.home.heroTitleAccent}
        </span>
      </h1>

      <p
        className="hero-rise mx-auto mt-5 max-w-[520px] text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0"
        style={{ animationDelay: RISE_DELAYS[1] }}
      >
        {m.home.heroLead}
      </p>

      <div className="hero-rise mt-7" style={{ animationDelay: RISE_DELAYS[2] }}>
        <SearchShowcase highlights={highlights} />
      </div>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 lg:justify-start">
        {promises.map((promise) => (
          <li key={promise.label} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="grid size-5 shrink-0 place-items-center rounded-md bg-white/5">
              <promise.icon className="size-3 text-emerald-400" />
            </span>
            {promise.label}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-zinc-500">
        {m.home.heroOrFreelancer}{' '}
        <Link href="/freelance" className="font-medium text-emerald-400 hover:underline">
          {m.home.heroFindFreelancer}
        </Link>
      </p>
    </div>
  );
}

/**
 * Qidiruvning KO'RINISHI — ishlaydigan qidiruv emas.
 *
 * Bu blok reklama: u platforma nima qilishini bir qarashda ko'rsatadi —
 * qidirasiz, yechimlar chiqadi. Shuning uchun maydonga matn kiritilmaydi
 * va u fokus olmaydi: yozib bo'ladigan, lekin hech nima qilmaydigan
 * maydon reklamadan ko'ra ko'proq nosozlikka o'xshaydi. Qidiruvning
 * o'zi katalog sahifasida.
 *
 * Ro'yxatdagi qatorlar esa O'YLAB TOPILGAN emas — backenddan kelgan eng
 * ko'p sotilgan fanlar. Bosh sahifada namuna sifatida soxta narx va
 * reyting chizish saytning birinchi ekranida yolg'on raqam ko'rsatish
 * bo'lardi.
 */
function SearchShowcase({ highlights }: { highlights: LandingHighlights }) {
  const { t, m } = useT();
  const rows = highlights.subjects.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03]">
      {/* Butun blok bezak: skrinriderga o'qilmaydi va bosilmaydi.
          Yagona haqiqiy amal — pastdagi havola. */}
      <div aria-hidden className="pointer-events-none p-2.5 select-none">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 py-2.5 pr-2 pl-3.5">
          <Search className="size-4 shrink-0 text-zinc-500" />
          <span className="min-w-0 flex-1 truncate text-left text-sm text-zinc-500">
            {m.home.heroSearchPlaceholder}
          </span>
          <span className="shrink-0 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-emerald-950">
            {m.home.heroSearch}
          </span>
        </div>

        {rows.length > 0 && (
          <div className="mt-2.5">
            <p className="px-1 pb-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
              {m.home.topSubjects}
            </p>

            <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-zinc-900/40">
              {rows.map((subject) => (
                <li key={subject.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-300">
                    <CheckCheck className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-[13px] font-semibold text-white">
                      {subject.name}
                    </span>
                    <span className="block truncate text-[11px] text-zinc-500">
                      {[
                        subject.university_short_name,
                        subject.course
                          ? t((x) => x.materials.course, { course: subject.course })
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[11px] tabular-nums">
                    <span className="block font-semibold text-emerald-300">
                      {t((x) => x.home.instituteSolutions, {
                        count: formatCount(subject.solution_count),
                      })}
                    </span>
                    <span className="block text-zinc-500">
                      {t((x) => x.home.subjectSales, {
                        count: formatCount(subject.sale_count),
                      })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        href="/materials"
        className="flex items-center justify-between gap-2 border-t border-white/[0.08] px-3.5 py-2.5 text-[11px] transition-colors hover:bg-white/[0.03]"
      >
        <span className="truncate text-zinc-500">
          {t((x) => x.home.startFromInstituteNote, {
            institutes: formatCount(highlights.stats.universities),
            subjects: formatCount(highlights.stats.subjects),
          })}
        </span>
        <span className="shrink-0 font-semibold text-emerald-400">{m.home.allMaterials} →</span>
      </Link>
    </div>
  );
}

/**
 * O'ng tomondagi vizual — markazda HAQIQIY fan.
 *
 * Ilgari bu yerda diplom belgisi turardi. Endi eng ko'p sotilgan fan
 * ko'rsatiladi: bosh sahifa mahsulotni bir marta bo'lsa ham ko'rsatishi
 * kerak, va o'ylab topilgan «namuna» karta o'rniga bosib ochiladigan
 * haqiqiy fan ancha foydali.
 */
function HeroVisual({ highlights }: { highlights: LandingHighlights }) {
  const { m } = useT();
  const featured = highlights.subjects[0];

  return (
    <div className="hero-scale-in relative mx-auto w-full max-w-[640px] lg:max-w-none">
      {/* Telefonda past: suzuvchi kartalar `md` dan pastda ko'rinmaydi va
            kvadrat maydon o'rtada bitta karta bilan yarim ekran bo'sh
            joy qoldirardi. */}
      <div className="relative mx-auto aspect-[5/3] max-h-[240px] w-full md:aspect-square md:max-h-[440px] lg:max-h-[520px]">
        <HeroVisualBackground />

        {featured ? (
          <FeaturedSubject subject={featured} />
        ) : (
          <div className="hero-float absolute top-1/2 left-1/2 z-10 grid place-items-center">
            <div className="grid size-32 place-items-center rounded-[1.375rem] border border-emerald-400/25 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent backdrop-blur-xl sm:size-40">
              <GraduationCap className="size-12 text-emerald-300 sm:size-16" strokeWidth={1.4} />
            </div>
          </div>
        )}

        {floatingCards.map((card, index) => (
          <FloatingCard
            key={index}
            {...card}
            title={card.title(m)}
            desc={card.desc(m)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedSubject({ subject }: { subject: LandingHighlights['subjects'][number] }) {
  const { t, m } = useT();
  const href = `/materials/${toSlug(subject.university_short_name || subject.university_name)}/${toSlugId(subject.name, subject.id)}`;

  return (
    <div className="hero-float absolute top-1/2 left-1/2 z-10 w-[min(19rem,86%)]">
      <Link
        href={href}
        className="block rounded-2xl border border-white/12 bg-zinc-900/85 p-4 backdrop-blur-xl transition-colors hover:border-emerald-400/40"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <CheckCheck className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{subject.name}</span>
            <span className="block truncate text-[11px] text-zinc-400">
              {[subject.university_short_name, subject.course ? `${subject.course}-kurs` : '']
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
        </span>

        <span className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
          <span className="text-zinc-400">{m.home.heroFeaturedLabel}</span>
          <span className="font-semibold text-emerald-300 tabular-nums">
            {t((x) => x.home.heroFeaturedCounts, {
              solutions: formatCount(subject.solution_count),
              sales: formatCount(subject.sale_count),
            })}
          </span>
        </span>
      </Link>
    </div>
  );
}

function HeroVisualBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="hero-blob hero-blob-1 absolute top-[48%] left-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />
      <div className="hero-orbit absolute top-1/2 left-1/2 size-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/8" />
      <div className="hero-orbit-reverse absolute top-1/2 left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/8" />
    </div>
  );
}

function FloatingCard({
  title,
  desc,
  icon: Icon,
  accent,
  className,
  index,
}: {
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  className: string;
  index: number;
}) {
  return (
    <div
      className={cn('hero-card-in absolute z-20 hidden w-[148px] md:block lg:w-[158px]', className)}
      style={{ animationDelay: `${250 + index * 100}ms` }}
    >
      <div
        className="hero-card-float rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl"
        style={{
          animationDuration: `${4.5 + index * 0.4}s`,
          animationDelay: `${index * 0.35}s`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-white/10',
              accent,
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] leading-tight font-semibold text-white">{title}</div>
            <div className="mt-0.5 text-[10px] leading-snug text-zinc-400">{desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lenta aylanishi uchun kerak bo'ladigan eng kam karta soni.
 *
 * To'rttadan kam bo'lsa ikki nusxa ham ekran kengligini to'ldirmaydi va
 * halqada ko'zga tashlanadigan bo'sh joy paydo bo'lardi — bunday holatda
 * lenta oddiy qatorga aylanadi.
 */
const MARQUEE_MIN_CARDS = 4;

/** Bitta karta ko'z oldidan o'tib ketadigan vaqt. */
const SECONDS_PER_CARD = 6;

function InstituteCard({
  university,
  clone = false,
}: {
  university: LandingHighlights['universities'][number];
  /**
   * Halqaning ikkinchi nusxasimi.
   *
   * Nusxa skrinriderdan yashiriladi (aks holda har institut ikki marta
   * o'qilardi) va uning havolalari tab navbatidan chiqariladi: ko'rinmas
   * takror havolaga fokus tushishi klaviatura bilan yurgan odam uchun
   * yo'q joyga borish bo'lardi.
   */
  clone?: boolean;
}) {
  const { t } = useT();

  return (
    <li className="w-[15rem] shrink-0" aria-hidden={clone || undefined} inert={clone || undefined}>
      <Link
        href={`/materials/${toSlug(university.short_name || university.name)}`}
        tabIndex={clone ? -1 : undefined}
        className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition-colors hover:border-emerald-400/40"
      >
        <span className="text-sm font-semibold text-white">
          {university.short_name || university.name}
        </span>
        <span className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-zinc-400">
          {university.name}
        </span>
        <span className="mt-3 flex items-center justify-between text-[11px] tabular-nums">
          <span className="text-zinc-500">
            {t((x) => x.home.instituteSubjects, {
              count: formatCount(university.subject_count),
            })}
          </span>
          <span className="font-semibold text-emerald-300">
            {t((x) => x.home.instituteSolutions, {
              count: formatCount(university.solution_count),
            })}
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * «Institutingizdan boshlang» — bosh sahifadan katalogga eng qisqa yo'l.
 *
 * Ro'yxat materiali ko'p institutdan boshlanadi: bosh sahifada tanlov
 * qilayotgan odam qayerda ko'proq narsa borligini bilmaydi.
 *
 * Lenta O'ZI aylanadi. Ilgari u aylantirish paneli bilan turardi va
 * birinchi beshtadan keyingi institutlar ekranning o'ng chetida qolib
 * ketardi — ularni ko'rish uchun panelni surish kerakligini bilish
 * kerak edi. Ustiga borilganda (yoki barmoq tekkanda) to'xtaydi.
 */
function InstituteStrip({ highlights }: { highlights: LandingHighlights }) {
  const { t, m } = useT();
  const universities = highlights.universities;

  if (universities.length === 0) return null;

  const rolling = universities.length >= MARQUEE_MIN_CARDS;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-white">
          {m.home.startFromInstitute}{' '}
          <span className="ml-1 font-normal text-zinc-500">
            {t((x) => x.home.startFromInstituteNote, {
              institutes: formatCount(highlights.stats.universities),
              subjects: formatCount(highlights.stats.subjects),
            })}
          </span>
        </p>
        <Link href="/materials" className="text-xs font-semibold text-emerald-400 hover:underline">
          {m.home.allInstitutes} →
        </Link>
      </div>

      {rolling ? (
        <div
          className="marquee mt-3"
          style={
            {
              '--marquee-gap': '0.625rem',
              // Tezlik karta soniga bog'liq emas: har bir karta ko'z
              // oldidan bir xil vaqtda o'tadi, ro'yxat qanchalik uzun
              // bo'lmasin.
              '--marquee-duration': `${universities.length * SECONDS_PER_CARD}s`,
            } as CSSProperties
          }
        >
          {/* Ikkala nusxa BITTA yo'lakda: alohida ro'yxatlarga bo'linsa
              ular ustma-ust tushib, lenta ikki qatorga aylanardi. */}
          <ul className="marquee-track">
            {universities.map((university) => (
              <InstituteCard key={university.id} university={university} />
            ))}
            {universities.map((university) => (
              <InstituteCard key={`clone-${university.id}`} university={university} clone />
            ))}
          </ul>
        </div>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {universities.map((university) => (
            <InstituteCard key={university.id} university={university} />
          ))}
        </ul>
      )}
    </div>
  );
}
