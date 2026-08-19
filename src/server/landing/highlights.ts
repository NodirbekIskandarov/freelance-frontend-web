import 'server-only';

import { request } from '../catalogue/client';

/**
 * Bosh sahifa ko'rsatkichlari — server tomonda, haqiqiy backenddan.
 *
 * RTK Query emas: bu sahifa Google uchun eng muhimi, bot bo'sh raqamlar
 * emas, to'ldirilgan HTML ko'rishi kerak.
 */

export interface LandingStats {
  universities: number;
  subjects: number;
  assignments: number;
  variants: number;
  solutions: number;
}

export interface LandingUniversity {
  id: string;
  name: string;
  short_name: string;
  code: string;
  city: string;
  subject_count: number;
  solution_count: number;
}

export interface LandingSubject {
  id: string;
  name: string;
  course: number | null;
  university: string;
  university_name: string;
  university_short_name: string;
  sale_count: number;
  solution_count: number;
}

export interface LandingHighlights {
  stats: LandingStats;
  universities: LandingUniversity[];
  subjects: LandingSubject[];
}

const EMPTY: LandingHighlights = {
  stats: { universities: 0, subjects: 0, assignments: 0, variants: 0, solutions: 0 },
  universities: [],
  subjects: [],
};

/**
 * Backend yiqilsa bosh sahifa BUTUNLAY yiqilmasin — bo'sh ko'rsatkichlar
 * qaytadi va bo'lim ko'rsatilmaydi. Bosh sahifaning qolgan qismi
 * (matn, xizmatlar, FAQ) baribir ishlaydi.
 */
export async function getLandingHighlights(limit = 6): Promise<LandingHighlights> {
  try {
    return await request<LandingHighlights>('/landing/highlights/', { limit });
  } catch {
    return EMPTY;
  }
}
