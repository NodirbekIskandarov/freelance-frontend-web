import type { FreelancerAvailability, FreelancerProfile } from '@/shared/types/freelance';

/**
 * Katalog filtri — sof funksiyalar, React'siz.
 *
 * Alohida modulda: mantiq komponentdan mustaqil sinaladi va sahifa
 * server'da ham, mijozda ham bir xil natija beradi.
 */

export const FREELANCE_SORT_OPTIONS = [
  { id: 'rating', label: "Reyting bo'yicha" },
  { id: 'newest', label: "Yangi qo'shilganlar" },
  { id: 'price_asc', label: 'Narx: arzon' },
  { id: 'price_desc', label: 'Narx: qimmat' },
] as const;

export type FreelanceSortId = (typeof FREELANCE_SORT_OPTIONS)[number]['id'];

export interface FreelanceFilterState {
  institute: string;
  availability: FreelancerAvailability | 'all';
  onlineOnly: boolean;
}

export const DEFAULT_FREELANCE_FILTERS: FreelanceFilterState = {
  institute: 'all',
  availability: 'all',
  onlineOnly: false,
};

export function countActiveFilters(filters: FreelanceFilterState): number {
  let count = 0;
  if (filters.institute !== 'all') count += 1;
  if (filters.availability !== 'all') count += 1;
  if (filters.onlineOnly) count += 1;
  return count;
}

function matchesQuery(freelancer: FreelancerProfile, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    freelancer.name,
    freelancer.primarySkill,
    freelancer.universityShortName,
    freelancer.universityFullName,
    ...freelancer.skills,
  ];

  return haystack.some((value) => value.toLowerCase().includes(needle));
}

const comparators: Record<
  FreelanceSortId,
  (a: FreelancerProfile, b: FreelancerProfile) => number
> = {
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => b.joinedAt.localeCompare(a.joinedAt),
  price_asc: (a, b) => a.priceFrom - b.priceFrom,
  price_desc: (a, b) => b.priceFrom - a.priceFrom,
};

export function filterFreelancers(
  freelancers: FreelancerProfile[],
  options: { query: string; filters: FreelanceFilterState; sortId: FreelanceSortId },
): FreelancerProfile[] {
  const { query, filters, sortId } = options;

  const matched = freelancers.filter((freelancer) => {
    if (!matchesQuery(freelancer, query)) return false;
    if (filters.institute !== 'all' && freelancer.universitySlug !== filters.institute) return false;
    if (filters.availability !== 'all' && freelancer.availability !== filters.availability) {
      return false;
    }
    if (filters.onlineOnly && !freelancer.isOnline) return false;
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
