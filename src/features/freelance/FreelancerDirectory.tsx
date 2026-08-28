'use client';

import {
  ChevronDown,
  CircleCheck,
  GraduationCap,
  Search,
  SearchX,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';

import { FreelancerCard } from '@/components/freelance/FreelancerCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  WORK_DIRECTIONS,
  workDirectionLabel,
  type PublicFreelancer,
} from '@/shared/types/publicFreelance';

import {
  countActiveFilters,
  DEFAULT_FREELANCE_FILTERS,
  FREELANCE_SORT_OPTIONS,
  filterFreelancers,
  type FreelanceFilterState,
  type FreelanceSortId,
} from './filter';
import { useT } from '@/i18n/useT';

const INITIAL_VISIBLE = 8;
const LOAD_STEP = 4;

interface CityOption {
  city: string;
  count: number;
}

function ToggleChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
          : 'border border-border bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-700 dark:hover:text-emerald-400',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function FreelancerDirectory({
  freelancers,
  cities,
}: {
  freelancers: PublicFreelancer[];
  cities: CityOption[];
}) {
  const { m } = useT();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FreelanceFilterState>(DEFAULT_FREELANCE_FILTERS);
  const [sortId, setSortId] = useState<FreelanceSortId>('rating');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  /*
   * Har harf bosilganda 14 ta kartani qayta saralash — bu ish input'ni
   * sekinlashtiradi. `useDeferredValue` yozishni darhol ko'rsatib,
   * ro'yxatni keyingi kadrda yangilaydi.
   */
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () => filterFreelancers(freelancers, { query: deferredQuery, filters, sortId }),
    [freelancers, deferredQuery, filters, sortId],
  );

  const availableCount = useMemo(
    () => freelancers.filter((item) => item.availability === 'available').length,
    [freelancers],
  );

  const activeCount = countActiveFilters(filters);

  // Filter o'zgarganda ko'rinadigan soni boshiga qaytadi — aks holda
  // 12 ta ochilgan holatda 3 ta natijaga o'tilsa, "Yana ko'rsatish" g'oyib bo'lar,
  // lekin keyingi qidiruvda ham hammasi ochiq qolib ketardi.
  function updateFilters(next: Partial<FreelanceFilterState>) {
    setFilters((current) => ({ ...current, ...next }));
    setVisibleCount(INITIAL_VISIBLE);
  }

  function clearAll() {
    setQuery('');
    setFilters(DEFAULT_FREELANCE_FILTERS);
    setVisibleCount(INITIAL_VISIBLE);
  }

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  return (
    <div className="space-y-6">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="flex items-center gap-2 rounded-xl border border-border bg-background p-1 pl-3.5 shadow-sm focus-within:border-emerald-500/50"
      >
        <Search className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(INITIAL_VISIBLE);
          }}
          placeholder="Mutaxassis yoki kalit so'z..."
          aria-label="Freelancer qidirish"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>

      <section
        aria-label="Saralash va filter"
        className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm dark:bg-zinc-900/50"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
              <Users className="size-4" />
            </span>
            <p className="text-sm text-muted-foreground">
              <strong className="text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                {filtered.length}
              </strong>{' '}
              ta freelancer topildi
              {filtered.length !== freelancers.length && (
                <span className="text-muted-foreground/70"> / {freelancers.length}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs text-muted-foreground">
              <CircleCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <strong className="font-bold text-emerald-700 dark:text-emerald-400">
                {availableCount}
              </strong>
              ta bo&apos;sh
            </span>

            {(activeCount > 0 || query) && (
              <Button variant="outline" size="sm" onClick={clearAll} className="text-xs">
                Tozalash
              </Button>
            )}
          </div>
        </div>

        <div className="px-4 py-4 sm:px-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <SlidersHorizontal className="size-3.5" />
            Saralash va filter
          </p>

          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {FREELANCE_SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortId(option.id)}
                  aria-pressed={sortId === option.id}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    sortId === option.id
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'border border-border bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-700 dark:hover:text-emerald-400',
                  )}
                >
                  {option.label(m)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex min-w-[170px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 sm:flex-none">
                <GraduationCap className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="sr-only">Shahar</span>
                <select
                  value={filters.city}
                  onChange={(event) => updateFilters({ city: event.target.value })}
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none"
                >
                  <option value="all">Barcha shaharlar</option>
                  {cities.map((option) => (
                    <option key={option.city} value={option.city}>
                      {option.city} ({option.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 sm:flex-none">
                <SlidersHorizontal className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="sr-only">Yo&apos;nalish</span>
                <select
                  value={filters.direction}
                  onChange={(event) => updateFilters({ direction: event.target.value })}
                  className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none"
                >
                  <option value="all">Barcha yo&apos;nalishlar</option>
                  {WORK_DIRECTIONS.map((direction) => (
                    <option key={direction} value={direction}>
                      {workDirectionLabel(direction, m)}
                    </option>
                  ))}
                </select>
              </label>

              <ToggleChip
                active={filters.availability === 'available'}
                onClick={() =>
                  updateFilters({
                    availability: filters.availability === 'available' ? 'all' : 'available',
                  })
                }
                icon={<CircleCheck className="size-3.5" />}
                label="Faqat bo'sh"
              />
            </div>
          </div>

          {(activeCount > 0 || query) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <span className="text-[11px] font-medium text-muted-foreground">Faol:</span>
              {query && <ActiveChip label={`Qidiruv: ${query}`} onClear={() => setQuery('')} />}
              {filters.city !== 'all' && (
                <ActiveChip label={filters.city} onClear={() => updateFilters({ city: 'all' })} />
              )}
              {filters.direction !== 'all' && (
                <ActiveChip
                  label={
                    workDirectionLabel(filters.direction as keyof typeof workDirectionLabel, m) ??
                    filters.direction
                  }
                  onClear={() => updateFilters({ direction: 'all' })}
                />
              )}
              {filters.availability !== 'all' && (
                <ActiveChip
                  label="Faqat bo'sh"
                  onClear={() => updateFilters({ availability: 'all' })}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {visible.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
            {visible.map((freelancer) => (
              <li key={freelancer.id}>
                <FreelancerCard freelancer={freelancer} />
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + LOAD_STEP)}
                className="rounded-full px-5"
              >
                Yana {Math.min(LOAD_STEP, remaining)} ta ko&apos;rsatish
                <ChevronDown className="size-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <SearchX className="size-6" />
          </span>
          <p className="mt-3 font-semibold text-foreground">Hech narsa topilmadi</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Filter yoki qidiruvni o&apos;zgartiring — mos freelancer topilmadi.
          </p>
          <Button variant="outline" size="sm" onClick={clearAll} className="mt-4">
            Hammasini tozalash
          </Button>
        </div>
      )}
    </div>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 py-0.5 pr-1.5 pl-2.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-500/25 dark:text-emerald-300"
    >
      {label}
      <X className="size-3 opacity-60" />
    </button>
  );
}
