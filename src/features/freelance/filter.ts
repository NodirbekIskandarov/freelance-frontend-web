import type { Messages } from '@/i18n/messages/uz';

import type { Availability, PublicFreelancer } from '@/shared/types/publicFreelance';

/**
 * Katalog filtri — sof funksiyalar, React'siz.
 *
 * Alohida modulda: mantiq komponentdan mustaqil sinaladi va sahifa
 * server'da ham, mijozda ham bir xil natija beradi.
 */

export const FREELANCE_SORT_OPTIONS = [
  { id: 'rating', label: (m: Messages) => m.freelance.sortRating },
  { id: 'newest', label: (m: Messages) => m.freelance.sortNewest },
  { id: 'price_asc', label: (m: Messages) => m.freelance.sortPriceAsc },
  { id: 'price_desc', label: (m: Messages) => m.freelance.sortPriceDesc },
] as const;

export type FreelanceSortId = (typeof FREELANCE_SORT_OPTIONS)[number]['id'];

export interface FreelanceFilterState {
  city: string;
  availability: Availability | 'all';
  direction: string;
}

export const DEFAULT_FREELANCE_FILTERS: FreelanceFilterState = {
  city: 'all',
  availability: 'all',
  direction: 'all',
};

export function countActiveFilters(filters: FreelanceFilterState): number {
  let count = 0;
  if (filters.city !== 'all') count += 1;
  if (filters.availability !== 'all') count += 1;
  if (filters.direction !== 'all') count += 1;
  return count;
}

function matchesQuery(freelancer: PublicFreelancer, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [freelancer.full_name, freelancer.city, freelancer.bio, ...freelancer.skills];

  return haystack.some((value) => value?.toLowerCase().includes(needle));
}

/** Narx `null` bo'lishi mumkin — kelishuv asosida ishlaydiganlar. */
function priceOf(freelancer: PublicFreelancer): number {
  const parsed = Number(freelancer.price_from);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const comparators: Record<FreelanceSortId, (a: PublicFreelancer, b: PublicFreelancer) => number> = {
  rating: (a, b) => Number(b.rating) - Number(a.rating) || b.completed_jobs - a.completed_jobs,
  newest: (a, b) => (b.approved_at ?? '').localeCompare(a.approved_at ?? ''),
  price_asc: (a, b) => priceOf(a) - priceOf(b),
  price_desc: (a, b) => priceOf(b) - priceOf(a),
};

export function filterFreelancers(
  freelancers: PublicFreelancer[],
  options: { query: string; filters: FreelanceFilterState; sortId: FreelanceSortId },
): PublicFreelancer[] {
  const { query, filters, sortId } = options;

  const matched = freelancers.filter((freelancer) => {
    if (!matchesQuery(freelancer, query)) return false;
    if (filters.city !== 'all' && freelancer.city !== filters.city) return false;
    if (filters.direction !== 'all' && freelancer.direction !== filters.direction) return false;
    if (filters.availability !== 'all' && freelancer.availability !== filters.availability) {
      return false;
    }
    return true;
  });

  /*
   * Saralash HAR DOIM bo'shlar bilan boshlanadi, tanlangan tartib esa
   * ikkinchi darajali. Band freelancer yuqorida turishi foydasiz — u
   * baribir ish qabul qilmaydi.
   */
  return matched.sort(
    (a, b) =>
      Number(b.availability === 'available') - Number(a.availability === 'available') ||
      comparators[sortId](a, b),
  );
}
