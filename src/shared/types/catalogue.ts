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
  logo: string | null;
  /**
   * Backend hisoblab beradi (`universities_with_counts()`).
   *
   * `solution_count` — faqat CHOP ETILGAN yechimlar: katalog «qayerda
   * material ko'p» degan savolga javob beradi, moderatsiyadagi yuklama esa
   * hali material emas.
   *
   * Ixtiyoriy: yozuv javoblari annotatsiyasiz obyekt qaytaradi.
   */
  subject_count?: number;
  assignment_count?: number;
  variant_count?: number;
  solution_count?: number;
  /**
   * Nechta variantga javob bor. `variant_count` bilan farqi — hali
   * yechim kutayotgan variantlar, ya'ni institutdagi bo'sh ish hajmi.
   */
  solved_variant_count?: number;
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
  semester?: number | null;
  /**
   * Backend hisoblab beradi (`subjects_with_counts()`).
   *
   * Ixtiyoriy: yozuv javoblari annotatsiyasiz obyekt qaytaradi va u yerda
   * maydon yo'q. O'quvchi tomonda esa doim keladi.
   */
  assignment_count?: number;
  variant_count?: number;
  /** Sotuvdagi (chop etilgan) yechimlar soni. */
  solution_count?: number;
  /** Yechimi bor variantlar — «15 / 47» ning birinchi soni. */
  solved_variant_count?: number;
  /** Nechta HAR XIL odam yechim yuklagan. */
  author_count?: number;
  /**
   * Sotuvdagi yechimlarning o'rtacha narxi, DRF o'nlik satri (`"9000.00"`).
   * `null` — hali hech nima sotuvda yo'q, ya'ni o'rtacha ham yo'q.
   */
  average_price?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Materiallar sahifasi boshidagi to'rtta sanoq.
 *
 * Hammasi bitta ochiq so'rovdan (`/catalogue/stats/`) keladi: to'rttasi
 * to'rt joydan olinsa, ular bir-biriga to'g'ri kelmay qolishi mumkin edi.
 */
export interface CatalogueStats {
  universities: number;
  subjects: number;
  assignments: number;
  variants: number;
  /** Sotuvdagi yechimlar. */
  solutions: number;
  /** Talab bor, lekin yechim yo'q variantlar. */
  awaiting_variants: number;
  /** Shu oyda to'langan xaridlar. */
  downloads_this_month: number;
  /**
   * Tasdiqlangan fan arizasi uchun to'lanadigan mukofot (so'm).
   * `0` — mukofot o'chirilgan, sahifa summani umuman aytmaydi.
   */
  subject_request_reward: number;
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
  /**
   * Topshiriq shartining fayli — talaba ko'radigan hujjat.
   *
   * Yechim EMAS: yechim pullik va u `PublicSolution` da. Bo'sh satr —
   * fayl biriktirilmagan.
   */
  file: string;
  /** Ochiq mavzudagi izohlar soni — tab yorlig'idagi raqam. */
  comment_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Topshiriq ostidagi ochiq izoh. */
export interface AssignmentComment {
  id: string;
  assignment: string;
  author: {
    id: string;
    /**
     * Telefon raqami ATAYLAB yo'q: mavzu ochiq va uni har izoh yoniga
     * qo'yish raqamni e'lon qilardi.
     */
    full_name: string;
  };
  body: string;
  /** Joriy foydalanuvchi yozganmi — o'chirish tugmasi shunga qarab chiziladi. */
  is_mine: boolean;
  created_at: string;
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
  /** Chop etilgan yechimlar soni — variantga javob berilganmi. */
  published_solution_count: number;
  /** Shu variantga yangi yechim qabul qilinadimi. */
  accepts_submissions: boolean;
  /** Topshiriq qavati ham hisobga olingan yakuniy javob. */
  submissions_open: boolean;
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
