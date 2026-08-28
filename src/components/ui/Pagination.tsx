'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useT } from '@/i18n/useT';

/**
 * Ko'rinadigan raqamlar soni (uchi-uchigacha).
 *
 * Toq son ataylab: joriy sahifa o'rtada turadi va oldinga-ortga
 * o'tganda raqamlar bir tekis suriladi.
 */
const WINDOW = 5;

/**
 * Sahifa raqamlari ro'yxati. `null` — uzilish belgisi («…»).
 *
 * Chetlar doim ko'rinadi: foydalanuvchi 7-sahifadan birinchisiga yoki
 * oxirgisiga bir bosishda qayta olishi kerak.
 */
function buildPages(current: number, total: number): (number | null)[] {
  if (total <= WINDOW + 2) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const half = Math.floor(WINDOW / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // Chekkaga yaqinlashganda oyna qisqarib qolmasligi uchun ikkinchi
  // tomonga cho'ziladi — aks holda 1-sahifada atigi uchta raqam qolardi.
  if (current - half < 2) end = Math.min(total - 1, end + (2 - (current - half)));
  if (current + half > total - 1) start = Math.max(2, start - (current + half - (total - 1)));

  const pages: (number | null)[] = [1];
  if (start > 2) pages.push(null);
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push(null);
  pages.push(total);

  return pages;
}

const itemBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40';

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  const { m } = useT();
  // Bitta sahifa bo'lsa boshqaruv keraksiz — hech qayerga o'tib bo'lmaydi.
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav
      aria-label={m.ui.pages}
      className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={m.ui.prevPage}
        className={cn(itemBase, 'border-border/70 text-muted-foreground hover:bg-muted')}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((item, index) =>
        item === null ? (
          <span
            // Uzilishlar ikkitagacha bo'ladi va joyi o'zgarmaydi, shuning
            // uchun indeks kalit sifatida xavfsiz.
            key={`gap-${index}`}
            aria-hidden
            className="px-1 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              itemBase,
              'tabular-nums',
              item === page
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={m.ui.nextPage}
        className={cn(itemBase, 'border-border/70 text-muted-foreground hover:bg-muted')}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
