import 'server-only';

import type { FreelancerProfile } from '@/shared/types/freelance';

import { freelancers } from './seed';

/**
 * Freelancer katalogi — server tomonda.
 *
 * Bu sahifa Google uchun ochiq, shuning uchun ro'yxat RTK Query bilan
 * emas, Server Component'da olinadi: bot bo'sh HTML emas, to'ldirilgan
 * kartalarni ko'radi. Filtrlash keyin mijozda, allaqachon kelgan
 * ro'yxat ustida bajariladi.
 */

export async function getFreelancers(): Promise<FreelancerProfile[]> {
  return freelancers;
}

/** Filter uchun institut variantlari — faqat freelanceri bor institutlar. */
export async function getFreelancerInstitutes(): Promise<
  { slug: string; shortName: string; count: number }[]
> {
  const counts = new Map<string, { slug: string; shortName: string; count: number }>();

  for (const item of freelancers) {
    const existing = counts.get(item.universitySlug);
    if (existing) existing.count += 1;
    else
      counts.set(item.universitySlug, {
        slug: item.universitySlug,
        shortName: item.universityShortName,
        count: 1,
      });
  }

  return [...counts.values()].sort((a, b) => a.shortName.localeCompare(b.shortName, 'uz'));
}
