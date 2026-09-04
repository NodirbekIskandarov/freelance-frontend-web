'use client';

import type { CSSProperties } from 'react';

import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/Link';
import { useT } from '@/i18n/useT';
import { gradientFor, initialsOf } from '@/lib/catalogueVisuals';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import { toSlug, toSlugId } from '@/lib/slug';
import type { LandingHighlights } from '@/server/landing/highlights';

/**
 * «Katalogda hozir» — platformada ayni damda nima borligi.
 *
 * Hamma raqam backenddan (`/landing/highsights/`), hech biri qo'lda
 * yozilmagan: bosh sahifa katalog o'sgan sari o'zi yangilanadi. Oxirgi
 * sanoq — javobsiz talab: u boshqa tomonga, yechim yozadigan odamga
 * qilingan taklif.
 */
/** Yorliqlar lentaga aylanadigan eng kam son. */
const CATEGORY_MIN_CHIPS = 6;

/** Bitta yorliq ko'z oldidan o'tib ketadigan vaqt. */
const CATEGORY_SECONDS = 3;

export function CatalogueNow({ highlights }: { highlights: LandingHighlights }) {
  const { t, m } = useT();
  const { stats } = highlights;
  const rolling = highlights.categories.length >= CATEGORY_MIN_CHIPS;

  const tiles = [
    { value: stats.universities, label: m.home.statInstitutes, tone: 'text-foreground' },
    { value: stats.subjects, label: m.home.statSubjects, tone: 'text-foreground' },
    { value: stats.variants, label: m.home.statVariants, tone: 'text-foreground' },
    {
      value: stats.solutions,
      label: m.home.statSolutions,
      tone: 'text-brand',
    },
    {
      value: stats.awaiting_variants,
      label: m.home.statAwaiting,
      /* Sariq FAQAT kutilayotgan ish uchun. Yonidagi yorliq ham
         «yechim kutilmoqda» deb yozadi — ma'no rangda yolg'iz qolmaydi. */
      tone: 'text-warning',
    },
  ];

  if (stats.subjects === 0) return null;

  return (
    <section className="py-10 sm:py-14" aria-label={m.home.catalogueNow}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {m.home.catalogueNow}
            </h2>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
              {m.home.catalogueNowLead}
            </p>
          </div>

          <dl className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-5">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:min-w-[6rem]"
              >
                <dd className={cn('text-lg font-bold tabular-nums', tile.tone)}>
                  {formatCount(tile.value)}
                </dd>
                <dt className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {tile.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <Panel
            title={m.home.popularInstitutes}
            href="/materials"
            linkLabel={m.home.allInstitutes}
          >
            {highlights.universities.slice(0, 5).map((university) => (
              <Link
                key={university.id}
                href={`/materials/${toSlug(university.short_name || university.name)}`}
                className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/50"
              >
                <UniversityMark university={university} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {university.short_name || university.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {university.name}
                  </span>
                </span>
                <span className="shrink-0 text-right text-[11px] tabular-nums">
                  <span className="block text-muted-foreground">
                    {t((x) => x.home.instituteSubjects, {
                      count: formatCount(university.subject_count),
                    })}
                  </span>
                  <span className="block font-semibold text-brand">
                    {t((x) => x.home.instituteSolutions, {
                      count: formatCount(university.solution_count),
                    })}
                  </span>
                </span>
              </Link>
            ))}
          </Panel>

          <Panel title={m.home.topSubjects} href="/materials" linkLabel={m.home.allMaterials}>
            {highlights.subjects.slice(0, 5).map((subject, index) => (
              <Link
                key={subject.id}
                href={`/materials/${toSlug(subject.university_short_name || subject.university_name)}/${toSlugId(subject.name, subject.id)}`}
                className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/50"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {subject.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
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
                  <span className="block font-semibold text-brand">
                    {t((x) => x.home.instituteSolutions, {
                      count: formatCount(subject.solution_count),
                    })}
                  </span>
                  <span className="block text-muted-foreground">
                    {t((x) => x.home.subjectSales, { count: formatCount(subject.sale_count) })}
                  </span>
                </span>
              </Link>
            ))}
          </Panel>
        </div>

        {highlights.categories.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{m.home.popularCategories}</p>
              <Link
                href="/materials"
                className="text-xs font-semibold text-brand hover:underline"
              >
                {m.home.allCategories} →
              </Link>
            </div>

            {/*
              Yorliqlar O'ZI aylanadi.

              Ular bitta qatorga sig'maydi va o'ralganda bo'lim ikki-uch
              qatorga cho'zilardi; aylantirish paneli bilan qoldirilsa esa
              oxirgi yo'nalishlar o'ng chetda ko'rinmay qolardi. Ustiga
              borilganda to'xtaydi — bosmoqchi bo'lgan yorliqni quvish
              kerak bo'lmasin.
            */}
            {rolling ? (
              <div
                className="marquee mt-3"
                style={
                  {
                    '--marquee-gap': '0.5rem',
                    '--marquee-duration': `${highlights.categories.length * CATEGORY_SECONDS}s`,
                  } as CSSProperties
                }
              >
                {/* Ikkala nusxa BITTA yo'lakda — alohida ro'yxatlar
                    ustma-ust tushib, lenta ikki qatorga aylanardi. */}
                <ul className="marquee-track">
                  {highlights.categories.map((category) => (
                    <CategoryChip key={category.id} category={category} />
                  ))}
                  {highlights.categories.map((category) => (
                    <CategoryChip key={`clone-${category.id}`} category={category} clone />
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {highlights.categories.map((category) => (
                  <CategoryChip key={category.id} category={category} />
                ))}
              </ul>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

/**
 * Institut belgisi: logotip, bo'lmasa qisqartma rangli kvadratda.
 *
 * `next/image` EMAS: logotip boshqa domendan keladi va uni optimizatsiya
 * qilish uchun o'sha domenni konfiguratsiyaga yozish kerak bo'lardi —
 * 36 pikselli rasm uchun bu ortiqcha bog'lanish. O'lcham qat'iy, ya'ni
 * rasm kech kelsa ham qator sakramaydi.
 */
function UniversityMark({ university }: { university: LandingHighlights['universities'][number] }) {
  const label = university.short_name || university.name;

  if (university.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- yuqoridagi izohga qarang
      <img
        src={university.logo}
        alt=""
        width={36}
        height={36}
        loading="lazy"
        decoding="async"
        className="size-9 shrink-0 rounded-xl bg-muted object-contain"
      />
    );
  }

  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-xl border px-1 text-[10px] leading-none font-bold',
        gradientFor(university.id),
      )}
    >
      {label.length <= 6 ? label : initialsOf(label)}
    </span>
  );
}

function CategoryChip({
  category,
  clone = false,
}: {
  category: LandingHighlights['categories'][number];
  /** Halqaning ikkinchi nusxasi — skrinriderdan va tab navbatidan tashqarida. */
  clone?: boolean;
}) {
  return (
    <li className="shrink-0" aria-hidden={clone || undefined} inert={clone || undefined}>
      <Link
        href="/materials"
        tabIndex={clone ? -1 : undefined}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:border-emerald-500/40"
      >
        {category.name}
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatCount(category.subject_count)}
        </span>
      </Link>
    </li>
  );
}

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Link
          href={href}
          className="text-xs font-semibold text-brand hover:underline"
        >
          {linkLabel} →
        </Link>
      </header>
      <div className="divide-y divide-border/60">{children}</div>
    </section>
  );
}
