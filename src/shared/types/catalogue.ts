/**
 * Ochiq katalog — haqiqiy backend shakli
 * (`https://api.yopamiz.uz/api/schema/`, "Public Catalogue" bo'limi).
 *
 * Ierarxiya: universitet → fan → topshiriq → variant → yechim.
 * Barcha endpoint'lar autentifikatsiyasiz ochiq, shuning uchun sahifalar
 * Server Component'da render qilinadi va qidiruv tizimi to'ldirilgan
 * HTML ko'radi.
 */

/** Serverning sahifalash javobi. */
export interface ApiPaginated<T> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface University {
  id: string;
  name: string;
  name_uz: string | null;
  name_ru: string | null;
  short_name: string;
  /** Institut kodi — manzil uchun ishlatilmaydi, u raqamli bo'lishi mumkin. */
  code: string;
  city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  university: string;
  university_name: string;
  direction: string | null;
  direction_name: string;
  name: string;
  name_uz: string | null;
  name_ru: string | null;
  course: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  subject: string;
  subject_name: string;
  university: string;
  university_name: string;
  title: string;
  /** `AssignmentTypeEnum` — fan sahifasidagi tablar shunga qarab bo'linadi. */
  type: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: string;
  assignment: string;
  assignment_title: string;
  subject: string;
  number: number;
  label: string;
  max_published_solutions: number;
  request_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicUploader {
  id: string;
  full_name: string;
}

/**
 * Katalogdagi e'lon qilingan yechim.
 * Yuklab olinadigan `file` ATAYLAB yo'q — u faqat sotib olingandan keyin
 * beriladi.
 */
export interface PublicSolution {
  id: string;
  title: string;
  price: string;
  average_rating: string;
  review_count: number;
  sold_count: number;
  uploader: PublicUploader;
  created_at: string;
}
