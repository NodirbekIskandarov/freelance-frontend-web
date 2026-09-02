import 'server-only';

import { findBySlugId, toSlug, toSlugId } from '@/lib/slug';
import type {
  ApiPaginated,
  Assignment,
  CatalogueStats,
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

/**
 * Materiallar sahifasining to'rtta sarlavha sanog'i.
 *
 * Ular katalog daraxtidan HISOBLANMAYDI: daraxtda faqat ochiq katalog
 * bor, sanoqlar esa xarid va talab kabi u yerda umuman yo'q narsalarni
 * ham qamraydi.
 */
export async function getCatalogueStats(): Promise<CatalogueStats> {
  return request<CatalogueStats>('/catalogue/stats/');
}

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

/**
 * Materiali ko'p fan tepada, tenglikda alifbo.
 *
 * Alifbo yolg'iz o'zi foydalanuvchiga hech nima aytmaydi: u bo'sh fanlarni
 * topshirig'i borlari bilan aralashtirib yuboradi va odam sahifani pastga
 * aylantirib qidirishga majbur bo'ladi.
 *
 * Tartib SERVERDA beriladi, mijozda emas: ro'yxat sahifalab olinadi va
 * mijozda saralash faqat joriy sahifani tartiblab, natijani buzardi.
 * Ikkala maydon ham `ordering_fields` da bor.
 */
const SUBJECT_ORDERING = '-assignment_count,name';

/**
 * BUTUN katalogni olishda esa alifbo bo'yicha.
 *
 * Materiallar sahifasi fanlarni o'zi qayta saralaydi (yechim ko'p / yechim
 * kerak / A→Z), ya'ni serverdan kelgan tartib u yerda baribir buziladi.
 * Farqi narxda: sanoq bo'yicha saralash backendni HAR BIR fanning
 * sanoqlarini oldindan hisoblashga majbur qiladi, saqlangan ustun bo'yicha
 * saralash esa sanoqlarni faqat sahifadagi qatorlar uchun oldiradi.
 */
const CATALOGUE_ORDERING = 'name';

export async function getSubjectsByUniversity(universityId: string): Promise<Subject[]> {
  const subjects = await requestAll<Subject>(`/universities/${universityId}/subjects/`, {
    ordering: SUBJECT_ORDERING,
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

/**
 * Butun katalogni bir yo'la oladigan ro'yxatlar.
 *
 * Institut ichidagi ro'yxatlar (`getSubjectsByUniversity`) bitta sahifa
 * uchun to'g'ri, lekin butun katalogni yig'ishda ular institut boshiga
 * bittadan so'rovga aylanadi. Bu ikkisi esa sahifalab o'tadi va soni
 * institutlar/fanlar soniga emas, YOZUVLAR soniga bog'liq.
 *
 * Faol bo'lmaganlari mijozda ajratiladi: anonim so'rovga backend
 * allaqachon faqat faollarini beradi, lekin filtr `getUniversities()`
 * bilan bir xil bo'lib qolsin — ikki joyda ikki xil qoida bo'lsa,
 * ro'yxatlar jimgina bir-biriga to'g'ri kelmay qolardi.
 */
export async function getAllSubjects(): Promise<Subject[]> {
  const subjects = await requestAll<Subject>('/subjects/', { ordering: CATALOGUE_ORDERING });
  return subjects.filter((item) => item.is_active);
}

export async function getAllAssignments(): Promise<Assignment[]> {
  return requestAll<Assignment>('/assignments/', { ordering: 'title' });
}

/** `subject` maydoni bo'yicha guruhlaydi — ro'yxat bo'ylab qidirmasdan. */
function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const bucket = groups.get(key(item)) ?? [];
    bucket.push(item);
    groups.set(key(item), bucket);
  }
  return groups;
}

export async function getAssignmentBySlugId(
  subjectId: string,
  segment: string,
): Promise<Assignment | null> {
  const assignments = await getAssignmentsBySubject(subjectId);
  return findBySlugId(assignments, segment);
}

/**
 * Materiallar sahifasi uchun butun katalog: institutlar, ularning
 * fanlari va har fandagi topshiriqlar soni.
 *
 * So'rovlar PARALLEL ketadi: ketma-ket bo'lsa institut va fan soni
 * ko'paygani sari sahifa chizilishi chiziqli sekinlashardi. Javob ISR
 * bilan keshlanadi, shuning uchun bu narx bir necha daqiqada bir marta
 * to'lanadi.
 */
export interface UniversityWithSubjects {
  university: University;
  slug: string;
  subjects: (Subject & { assignmentCount: number; slug: string })[];
}

export async function getCatalogueTree(): Promise<UniversityWithSubjects[]> {
  const [universities, allSubjects] = await Promise.all([getUniversities(), getAllSubjects()]);
  const subjectsByUniversity = groupBy(allSubjects, (subject) => subject.university);

  return Promise.all(
    universities.map(async (university) => {
      const subjects = subjectsByUniversity.get(university.id) ?? [];

      /*
       * Topshiriqlar soni fan javobining O'ZIDA keladi
       * (`subjects_with_counts()`). Ilgari bu yerda har fan uchun
       * `/subjects/{id}/assignments/` so'rovi ketardi — 21 institut va
       * o'nlab fan bilan bu yuzlab so'rov degani edi.
       */
      const withCounts = subjects.map((subject) => ({
        ...subject,
        slug: toSlugId(subject.name, subject.id),
        assignmentCount: subject.assignment_count ?? 0,
      }));

      return {
        university,
        slug: universitySlug(university),
        subjects: withCounts,
      };
    }),
  );
}

export async function getVariantsByAssignment(assignmentId: string): Promise<Variant[]> {
  return requestAll<Variant>(`/assignments/${assignmentId}/variants/`, { ordering: 'number' });
}

/**
 * Fanning BARCHA variantlari — bitta so'rovda.
 *
 * `/variants/?assignment__subject=` topshiriqlar bo'ylab kesib o'tadi,
 * shuning uchun daraxt uchun topshiriq boshiga alohida so'rov kerak
 * emas. Tartib `assignment`ga qarab emas, `number` bo'yicha keladi —
 * guruhlash chaqiruvchida bo'lgani uchun bu muhim emas.
 */
export async function getVariantsBySubject(subjectId: string): Promise<Variant[]> {
  return requestAll<Variant>('/variants/', {
    assignment__subject: subjectId,
    ordering: 'number',
  });
}

export async function getSolutionsByVariant(variantId: string): Promise<PublicSolution[]> {
  const page = await request<ApiPaginated<PublicSolution>>(`/variants/${variantId}/solutions/`, {
    page_size: 20,
  });
  return page.results;
}

/**
 * Fan sahifasi uchun to'liq daraxt: topshiriqlar → variantlar →
 * har variantdagi yechimlar soni.
 *
 * IKKI so'rov, topshiriqlar soniga bog'liq emas: topshiriqlar ro'yxati va
 * fanning barcha variantlari. Yechimlar soni variant javobining o'zida
 * keladi (`published_solution_count`).
 *
 * Ilgari bu 1 + N + N×M so'rov edi — har variant uchun uning yechimlari
 * olinib, faqat uzunligi ishlatilardi. Sahifa ISR bilan chizilgani uchun
 * narxni tashrif buyuruvchi to'lamasdi, lekin qayta chizish har fan uchun
 * yuzlab so'rovga cho'zilardi va backendni katalog to'lgani sari
 * og'irlashtirardi.
 */
export interface AssignmentNode {
  assignment: Assignment;
  slug: string;
  variants: (Variant & { solutionCount: number })[];
}

export async function getAssignmentTree(subjectId: string): Promise<AssignmentNode[]> {
  const [assignments, variants] = await Promise.all([
    getAssignmentsBySubject(subjectId),
    getVariantsBySubject(subjectId),
  ]);

  // Topshiriq bo'yicha guruhlash — ro'yxat bo'ylab qidirish o'rniga bitta
  // o'tish: variantlar soni yuzlab bo'lishi mumkin.
  const byAssignment = new Map<string, (Variant & { solutionCount: number })[]>();
  for (const variant of variants) {
    const bucket = byAssignment.get(variant.assignment) ?? [];
    bucket.push({ ...variant, solutionCount: variant.published_solution_count });
    byAssignment.set(variant.assignment, bucket);
  }

  return assignments.map((assignment) => ({
    assignment,
    slug: toSlugId(assignment.title, assignment.id),
    variants: byAssignment.get(assignment.id) ?? [],
  }));
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
  /*
   * Uchta ro'yxat, keyin xotirada birlashtiriladi.
   *
   * Ilgari bu ich-ichiga kirgan sikl edi va har fan uchun bitta so'rov
   * yuborardi — build vaqtida yuzlab ketma-ket so'rov. Endi so'rovlar soni
   * faqat sahifalash sonicha.
   */
  const [universities, allSubjects, allAssignments] = await Promise.all([
    getUniversities(),
    getAllSubjects(),
    getAllAssignments(),
  ]);

  const subjectsByUniversity = groupBy(allSubjects, (subject) => subject.university);
  const assignmentsBySubject = groupBy(allAssignments, (assignment) => assignment.subject);

  const paths: CataloguePaths = { universities: [], subjects: [], assignments: [] };

  for (const university of universities) {
    const uniSlug = universitySlug(university);
    paths.universities.push({ universitySlug: uniSlug });

    const subjects = subjectsByUniversity.get(university.id) ?? [];

    for (const subject of subjects) {
      const subjSlug = toSlugId(subject.name, subject.id);
      paths.subjects.push({ universitySlug: uniSlug, subjectSlug: subjSlug });

      const assignments = assignmentsBySubject.get(subject.id) ?? [];

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
