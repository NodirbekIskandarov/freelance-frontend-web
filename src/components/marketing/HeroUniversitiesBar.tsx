'use client';

import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

const universities = [
  { name: 'TATU', color: 'from-emerald-500 to-teal-600' },
  { name: 'TDTU', color: 'from-amber-400 to-orange-500' },
  { name: 'SamDU', color: 'from-blue-500 to-indigo-600' },
  { name: 'BuxDU', color: 'from-emerald-600 to-green-700' },
  { name: 'INHA', color: 'from-sky-500 to-blue-600' },
  { name: 'QarDU', color: 'from-lime-500 to-emerald-600' },
  { name: 'UrDU', color: 'from-orange-400 to-red-500' },
  { name: 'AndDU', color: 'from-violet-500 to-purple-600' },
] as const;

export function HeroUniversitiesBar({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const { m } = useT();
  const isHero = variant === 'hero';

  return (
    <div
      className={cn(
        'relative z-20 rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 lg:rounded-3xl',
        isHero
          ? 'border-white/10 bg-white/[0.04] backdrop-blur-xl'
          : 'border-border/50 bg-background dark:border-zinc-800 dark:bg-zinc-900/80',
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className={cn(
            'text-sm font-semibold sm:text-[15px]',
            isHero ? 'text-white' : 'text-foreground',
          )}
        >
          {m.home.topUniversities}
        </h2>
        <Link
          href="/materials"
          className="inline-flex items-center gap-0.5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
        >
          {m.home.seeAll}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-5 [scrollbar-width:none] overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-6 sm:gap-8 lg:min-w-0 lg:flex-wrap lg:justify-between lg:gap-x-5 lg:gap-y-5">
          {universities.map((u) => (
            <div key={u.name} className="flex shrink-0 items-center gap-2.5">
              <div
                className={cn(
                  'grid size-10 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
                  u.color,
                )}
              >
                {u.name.slice(0, 2)}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  isHero ? 'text-zinc-400' : 'text-muted-foreground',
                )}
              >
                {u.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
