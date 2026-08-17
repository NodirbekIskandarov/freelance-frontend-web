import 'server-only';

import { findBySlugId, toSlug, toSlugId } from '@/lib/slug';
import type {
  ApiPaginated,
  Assignment,
  PublicSolution,
  Subject,
  University,
  Variant,
} from '@/shared/types/catalogue';

import { request, requestAll } from './client';

/**
 * Katalog ma'lumot qatlami.
 *
 * Sahifalar faqat shu funksiyalarni biladi — API yo'llari, sahifalash
 * va slug yechish shu yerda to'xtaydi.
 */

export async function getUniversities(): Promise<University[]> {
  const universities = await requestAll<University>('/universities/', { ordering: 'short_name' });
  return universities.filter((item) => item.is_active);
}

/**
 * Universitet manzil segmenti — qisqa nomdan yasalgan slug (`tatu`).
 *
 * Fan va topshiriqdan farqli o'laroq bu yerda ID qo'shilmaydi:
 * universitetlar kam va qisqa nomlari o'ziga xos, manzil esa katalogning
 * eng ko'rinadigan qismi — `tatu` `tatu-970b6752` dan ancha yaxshi.
 */
export function universitySlug(university: University): string {
  return toSlug(university.short_name || university.name);
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  const universities = await getUniversities();
  return universities.find((item) => universitySlug(item) === slug) ?? null;
}

export async function getSubjectsByUniversity(universityId: string): Promise<Subject[]> {
  const subjects = await requestAll<Subject>(`/universities/${universityId}/subjects/`, {
    ordering: 'name',
  });
  return subjects.filter((item) => item.is_active);
}

export async function getSubjectBySlugId(
  universityId: string,
  segment: string,
): Promise<Subject | null> {
  const subjects = await getSubjectsByUniversity(universityId);
  return findBySlugId(subjects, segment);
}

export async function getAssignmentsBySubject(subjectId: string): Promise<Assignment[]> {
  return requestAll<Assignment>(`/subjects/${subjectId}/assignments/`, { ordering: 'title' });
}

export async function getAssignmentBySlugId(
  subjectId: string,
  segment: string,
): Promise<Assignment | null> {
  const assignments = await getAssignmentsBySubject(subjectId);
  return findBySlugId(assignments, segment);
}

export async function getVariantsByAssignment(assignmentId: string): Promise<Variant[]> {
  return requestAll<Variant>(`/assignments/${assignmentId}/variants/`, { ordering: 'number' });
}

export async function getSolutionsByVariant(variantId: string): Promise<PublicSolution[]> {
  const page = await request<ApiPaginated<PublicSolution>>(`/variants/${variantId}/solutions/`, {
    page_size: 20,
  });
  return page.results;
}

/**
 * `generateStaticParams` va `sitemap.ts` uchun barcha katalog yo'llari.
 *
 * Ikkalasi bitta manbadan o'qiydi — aks holda sitemap'da bor, lekin
 * generatsiya qilinmagan (yoki aksincha) sahifalar paydo bo'lardi.
 */
export interface CataloguePaths {
  universities: { universitySlug: string }[];
  subjects: { universitySlug: string; subjectSlug: string }[];
  assignments: { universitySlug: string; subjectSlug: string; assignmentSlug: string }[];
}

export async function getAllCataloguePaths(): Promise<CataloguePaths> {
  const universities = await getUniversities();

  const paths: CataloguePaths = { universities: [], subjects: [], assignments: [] };

  for (const university of universities) {
    const uniSlug = universitySlug(university);
    paths.universities.push({ universitySlug: uniSlug });

    const subjects = await getSubjectsByUniversity(university.id);

    for (const subject of subjects) {
      const subjSlug = toSlugId(subject.name, subject.id);
      paths.subjects.push({ universitySlug: uniSlug, subjectSlug: subjSlug });

      const assignments = await getAssignmentsBySubject(subject.id);

      for (const assignment of assignments) {
        paths.assignments.push({
          universitySlug: uniSlug,
          subjectSlug: subjSlug,
          assignmentSlug: toSlugId(assignment.title, assignment.id),
        });
      }
    }
  }

  return paths;
}
