import 'server-only';

import type { ApiPaginated } from '@/shared/types/catalogue';
import type { ExchangeReview } from '@/shared/types/exchange';
import type { PublicFreelancer } from '@/shared/types/publicFreelance';

import { request } from '../catalogue/client';

/**
 * Freelancer katalogi — server tomonda, haqiqiy backenddan.
 *
 * Bu sahifa Google uchun ochiq, shuning uchun ro'yxat RTK Query bilan
 * emas, Server Component'da olinadi: bot bo'sh HTML emas, to'ldirilgan
 * kartalarni ko'radi. Filtrlash keyin mijozda, allaqachon kelgan
 * ro'yxat ustida bajariladi.
 */

export async function getFreelancers(): Promise<PublicFreelancer[]> {
  const page = await request<ApiPaginated<PublicFreelancer>>('/freelance/freelancers/', {
    page_size: 100,
    ordering: '-rating',
  });
  return page.results;
}

/**
 * Bitta freelancer — profil sahifasi uchun.
 *
 * Topilmasa `null`: sahifa `notFound()` chaqiradi, xato tashlamaydi.
 * O'chirilgan yoki to'xtatilgan profilga havola qolib ketishi mumkin.
 */
export async function getFreelancer(id: string): Promise<PublicFreelancer | null> {
  try {
    return await request<PublicFreelancer>(`/freelance/freelancers/${id}/`);
  } catch {
    return null;
  }
}

/** Profil sahifasidagi sharhlar — ular ham botga ko'rinishi kerak. */
export async function getFreelancerReviews(id: string): Promise<ExchangeReview[]> {
  try {
    const page = await request<ApiPaginated<ExchangeReview>>(
      `/freelance/freelancers/${id}/reviews/`,
      { page_size: 50, ordering: '-created_at' },
    );
    return page.results;
  } catch {
    return [];
  }
}

/**
 * Filtr uchun shaharlar — faqat freelanceri bor shaharlar.
 *
 * Ilgari bu yerda institutlar bo'lgan, lekin backend freelancer
 * profilida OTM emas, shaharni beradi.
 */
export async function getFreelancerCities(): Promise<{ city: string; count: number }[]> {
  const freelancers = await getFreelancers();
  const counts = new Map<string, number>();

  for (const item of freelancers) {
    if (!item.city) continue;
    counts.set(item.city, (counts.get(item.city) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => a.city.localeCompare(b.city, 'uz'));
}
