import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import type { University } from '@/shared/types/materials';

export function UniversityCard({ university }: { university: University }) {
  return (
    <Link
      href={`/materials/${university.slug}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm',
            university.logoGradient,
          )}
        >
          {university.logoInitials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-foreground">{university.shortName}</div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {university.fullName}
          </p>
        </div>
      </div>

      <dl className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <dt className="sr-only">Fanlar</dt>
          <dd className="font-semibold text-foreground">{university.subjectCount}</dd>
          <span>fan</span>
        </div>
        <span aria-hidden>&middot;</span>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Topshiriqlar</dt>
          <dd className="font-semibold text-foreground">
            {university.taskCount.toLocaleString('ru-RU').replace(/ /g, ' ')}
          </dd>
          <span>topshiriq</span>
        </div>
      </dl>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2 dark:text-emerald-400">
        Fanlarni ko&apos;rish
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
