import { Briefcase, GraduationCap, MessageCircle, Star, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/cn';
import { formatSom } from '@/lib/format';
import {
  FREELANCER_AVAILABILITY_LABELS,
  FREELANCER_BADGE_LABELS,
  FREELANCER_LEVEL_LABELS,
  type FreelancerProfile,
} from '@/shared/types/freelance';

const badgeStyles: Record<FreelancerProfile['badge'], string> = {
  top: 'bg-amber-50 text-amber-800 ring-amber-200/90 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/25',
  pro: 'bg-sky-50 text-sky-800 ring-sky-200/90 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/25',
  new: 'bg-emerald-50 text-emerald-800 ring-emerald-200/90 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Server Component — kartada interaktivlik yo'q, faqat ko'rinish.
 * "Yozish" tugmasi kirishni talab qiladi, shuning uchun u login
 * sahifasiga oddiy havola: mijoz JS'i shart emas.
 */
export function FreelancerCard({ freelancer }: { freelancer: FreelancerProfile }) {
  const isBusy = freelancer.availability === 'busy';

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-2xl border p-4 transition-all',
        isBusy
          ? 'border-border/60 bg-muted/30'
          : 'border-border/60 bg-background hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/70',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              'grid size-14 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
              isBusy ? 'from-slate-400 to-slate-500' : freelancer.avatarGradient,
            )}
          >
            {initialsOf(freelancer.name)}
          </div>
          <span
            className={cn(
              'absolute right-0.5 bottom-0.5 size-3 rounded-full border-2 border-background',
              isBusy ? 'bg-orange-500' : freelancer.isOnline ? 'bg-emerald-500' : 'bg-slate-400',
            )}
            title={isBusy ? 'Band — ish ustida' : freelancer.isOnline ? 'Onlayn' : 'Oflayn'}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{freelancer.name}</h3>

          <div className="mt-0.5 flex items-center gap-1 text-xs">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground">{freelancer.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({freelancer.reviews})</span>
          </div>

          <p
            className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"
            title={freelancer.universityFullName}
          >
            <GraduationCap className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">{freelancer.universityShortName}</span>
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1',
            badgeStyles[freelancer.badge],
          )}
        >
          {FREELANCER_BADGE_LABELS[freelancer.badge]}
        </span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
          {FREELANCER_LEVEL_LABELS[freelancer.level]}
        </span>
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1',
            isBusy
              ? 'bg-orange-50 text-orange-700 ring-orange-200/90 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/25'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-200/90 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
          )}
        >
          {FREELANCER_AVAILABILITY_LABELS[freelancer.availability]}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        {freelancer.primarySkill}
      </p>

      <ul className="mt-1.5 flex flex-wrap gap-1">
        {freelancer.skills.slice(0, 3).map((skill) => (
          <li
            key={skill}
            className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {skill}
          </li>
        ))}
      </ul>

      <dl className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-center">
        <div>
          <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Briefcase className="size-3" />
            Ishlar
          </dt>
          <dd className="text-xs font-bold text-foreground">{freelancer.completedWorks}</dd>
        </div>
        <div className="border-x border-emerald-500/15">
          <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <TrendingUp className="size-3" />
            Muvaffaqiyat
          </dt>
          <dd className="text-xs font-bold text-foreground">{freelancer.successRate}%</dd>
        </div>
        <div>
          <dt className="text-[10px] text-muted-foreground">Narx</dt>
          <dd className="text-[11px] leading-tight font-bold text-emerald-700 dark:text-emerald-400">
            {formatSom(freelancer.priceFrom)}
          </dd>
        </div>
      </dl>

      {isBusy && freelancer.activeOrderTitle && (
        <p className="mt-2 truncate text-[11px] text-muted-foreground">
          Hozir: {freelancer.activeOrderTitle}
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-3">
        {isBusy ? (
          <span
            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
            title="Ish topshirilguncha band"
          >
            Hozir band
          </span>
        ) : (
          <a
            href="/login"
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            <MessageCircle className="size-3.5" />
            Yozish
          </a>
        )}
      </div>
    </article>
  );
}
