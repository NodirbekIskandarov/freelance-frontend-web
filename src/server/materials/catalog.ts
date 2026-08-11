import 'server-only';

import type { Subject, Task, University } from '@/shared/types/materials';

import { seed } from './seed';

/**
 * Katalog uchun server-side ma'lumot qatlami.
 *
 * `import 'server-only'` — bu modul mijoz komponentiga tasodifan import
 * qilinsa, build vaqtida XATO beradi. Seed ma'lumoti (yoki kelajakda
 * backend maxfiy kaliti) brauzerga sizib chiqmasligining kafolati.
 *
 * Nega RTK Query emas: bu sahifalar Google uchun. RTK Query hook'i mijozda
 * ishlaydi va bot bo'sh HTML ko'radi. Shuning uchun katalog Server
 * Component'da render qilinadi, bu funksiyalar esa `fetch()`ga o'tishga
 * tayyor — sahifa komponentlari o'zgarmaydi.
 */

export async function getUniversities(): Promise<University[]> {
  return seed.universities;
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  return seed.universities.find((item) => item.slug === slug) ?? null;
}

export async function getSubjectsByUniversity(universityId: string): Promise<Subject[]> {
  return seed.subjects.filter((item) => item.universityId === universityId);
}

export async function getSubjectBySlug(
  universityId: string,
  subjectSlug: string,
): Promise<Subject | null> {
  return (
    seed.subjects.find((item) => item.universityId === universityId && item.slug === subjectSlug) ??
    null
  );
}

export async function getTasksBySubject(subjectId: string): Promise<Task[]> {
  return seed.tasks.filter((item) => item.subjectId === subjectId);
}

/** `generateStaticParams` va `sitemap.ts` uchun barcha yo'llar. */
export async function getAllCatalogPaths(): Promise<{
  universities: { slug: string }[];
  subjects: { universitySlug: string; subjectSlug: string }[];
}> {
  const universityById = new Map(seed.universities.map((item) => [item.id, item]));

  return {
    universities: seed.universities.map((item) => ({ slug: item.slug })),
    subjects: seed.subjects.flatMap((subject) => {
      const university = universityById.get(subject.universityId);
      if (!university) return [];
      return [{ universitySlug: university.slug, subjectSlug: subject.slug }];
    }),
  };
}
