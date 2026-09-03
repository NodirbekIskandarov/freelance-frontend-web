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
import { useState, type ComponentType, type FormEvent } from 'react';

import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/Link';
import type { Messages } from '@/i18n/messages/uz';
import { useLocaleRouter } from '@/i18n/useLocaleRouter';
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
          <HeroContent guaranteeLabel={guaranteeLabel} />
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

function HeroContent({ guaranteeLabel }: { guaranteeLabel: string }) {
  const { t, m } = useT();
  const router = useLocaleRouter();
  const [query, setQuery] = useState('');

  /*
   * Qidiruv katalogga OLIB BORADI, bu yerda javob bermaydi.
   *
   * Bosh sahifada natijalarni chizish uchun butun katalogni yuklash
   * kerak bo'lardi — ya'ni hech qachon qidirmaydigan odam ham uni
   * yuklab olardi. Katalog sahifasi esa qidiruvni allaqachon biladi.
   */
  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/materials?q=${encodeURIComponent(trimmed)}` : '/materials');
  }

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

      <form
        onSubmit={submit}
        className="hero-rise mt-7 flex flex-col gap-2.5 sm:flex-row"
        style={{ animationDelay: RISE_DELAYS[2] }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
          <label className="sr-only" htmlFor="hero-search">
            {m.home.heroSearchLabel}
          </label>
          <input
            id="hero-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={m.home.heroSearchPlaceholder}
            className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.04] pr-4 pl-11 text-sm text-white transition-colors outline-none placeholder:text-zinc-500 focus-visible:border-emerald-400/50 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          {m.home.heroSearch}
        </button>
      </form>

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
        {t((x) => x.home.heroOrFreelancer, { link: '' })}{' '}
        <Link href="/freelance" className="font-medium text-emerald-400 hover:underline">
          {m.home.heroFindFreelancer}
        </Link>
      </p>
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
 * «Institutingizdan boshlang» — bosh sahifadan katalogga eng qisqa yo'l.
 *
 * Ro'yxat materiali ko'p institutdan boshlanadi: bosh sahifada tanlov
 * qilayotgan odam qayerda ko'proq narsa borligini bilmaydi.
 */
function InstituteStrip({ highlights }: { highlights: LandingHighlights }) {
  const { t, m } = useT();

  if (highlights.universities.length === 0) return null;

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

      <ul className="mt-3 flex snap-x snap-mandatory [scrollbar-width:thin] gap-2.5 overflow-x-auto pb-1">
        {highlights.universities.map((university) => (
          <li key={university.id} className="w-[15rem] shrink-0 snap-start">
            <Link
              href={`/materials/${toSlug(university.short_name || university.name)}`}
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
        ))}
      </ul>
    </div>
  );
}
