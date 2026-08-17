import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import type { University } from '@/shared/types/catalogue';

/**
 * Logotip rangi universitet ID'sidan hosil qilinadi.
 *
 * Backend brend rangi yoki logotip bermaydi, urug'dagi kabi qo'lda
 * yozib qo'yish esa yangi universitet qo'shilishi bilan eskirardi.
 * ID doimiy, shuning uchun rang ham har renderda bir xil qoladi.
 */
const GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-amber-400 to-orange-500',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function gradientFor(id: string): string {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length]!;
}

function initialsOf(university: University): string {
  return (university.short_name || university.name).slice(0, 2).toUpperCase();
}

export function UniversityCard({
  university,
  href,
  subjectCount,
}: {
  university: University;
  href: string;
  subjectCount?: number;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm',
            gradientFor(university.id),
          )}
        >
          {initialsOf(university)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-foreground">{university.short_name}</div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {university.name}
          </p>
        </div>
      </div>

      <dl className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        {university.city && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Shahar</dt>
            <MapPin className="size-3.5" />
            <dd>{university.city}</dd>
          </div>
        )}

        {subjectCount !== undefined && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Fanlar</dt>
            <dd className="font-semibold text-foreground">{subjectCount}</dd>
            <span>fan</span>
          </div>
        )}
      </dl>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2 dark:text-emerald-400">
        Fanlarni ko&apos;rish
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
