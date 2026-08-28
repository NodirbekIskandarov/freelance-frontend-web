import { Briefcase, MapPin, MessageCircle, Star } from 'lucide-react';
import { Link } from '@/i18n/Link';

import { cn } from '@/lib/cn';
import { formatSom } from '@/lib/format';
import {
  AVAILABILITY_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  WORK_DIRECTION_LABELS,
  type PublicFreelancer,
} from '@/shared/types/publicFreelance';

/**
 * Avatar rangi ID'dan hosil qilinadi — backend brend rangi bermaydi,
 * qo'lda yozib qo'yish esa yangi freelancer bilan eskirardi.
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

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  return parts
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
export function FreelancerCard({ freelancer }: { freelancer: PublicFreelancer }) {
  const isBusy = freelancer.availability === 'busy';
  const rating = Number(freelancer.rating);

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
          {freelancer.avatar ? (
            // Backend rasm domenlari oldindan noma'lum — `next/image` emas.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={freelancer.avatar} alt="" className="size-14 rounded-full object-cover" />
          ) : (
            <div
              className={cn(
                'grid size-14 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                isBusy ? 'from-slate-400 to-slate-500' : gradientFor(freelancer.id),
              )}
            >
              {initialsOf(freelancer.full_name)}
            </div>
          )}

          <span
            className={cn(
              'absolute right-0.5 bottom-0.5 size-3 rounded-full border-2 border-background',
              isBusy ? 'bg-orange-500' : 'bg-emerald-500',
            )}
            title={AVAILABILITY_LABELS[freelancer.availability]}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {freelancer.full_name || 'Freelancer'}
          </h3>

          <div className="mt-0.5 flex items-center gap-1 text-xs">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground">
              {Number.isNaN(rating) ? '—' : rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({freelancer.completed_jobs} ish)</span>
          </div>

          {freelancer.city && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{freelancer.city}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
          {EXPERIENCE_LEVEL_LABELS[freelancer.experience_level]?.split('—')[0]?.trim() ??
            freelancer.experience_level}
        </span>
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1',
            isBusy
              ? 'bg-orange-50 text-orange-700 ring-orange-200/90 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/25'
              : 'bg-emerald-50 text-emerald-700 ring-emerald-200/90 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
          )}
        >
          {AVAILABILITY_LABELS[freelancer.availability]}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        {WORK_DIRECTION_LABELS[freelancer.direction] ?? freelancer.direction}
      </p>

      {freelancer.skills.length > 0 && (
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
      )}

      <dl className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-center">
        <div>
          <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            <Briefcase className="size-3" />
            Bajarilgan
          </dt>
          <dd className="text-xs font-bold text-foreground">{freelancer.completed_jobs}</dd>
        </div>
        <div className="border-l border-emerald-500/15">
          <dt className="text-[10px] text-muted-foreground">Narx</dt>
          <dd className="text-[11px] leading-tight font-bold text-emerald-700 dark:text-emerald-400">
            {/* Narx berilmagan bo'lsa kelishuv asosida ishlaydi. */}
            {freelancer.price_from ? formatSom(Number(freelancer.price_from)) : 'Kelishuv'}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex gap-2 pt-3">
        <Link
          href={`/freelance/${freelancer.id}`}
          className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-border text-xs font-semibold text-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          Profil
        </Link>

        {isBusy ? (
          <span
            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
            title="Ish topshirilguncha band"
          >
            Hozir band
          </span>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            <MessageCircle className="size-3.5" />
            Yozish
          </Link>
        )}
      </div>
    </article>
  );
}
