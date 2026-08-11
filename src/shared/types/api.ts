/**
 * Umumiy, domenga bog'liq bo'lmagan API shakllari (sahifalash, xato tanasi,
 * token juftligi). Domen tiplari (`AppUser`, `University`...) o'z fayllarida:
 * `shared/types/auth.ts`, `shared/types/materials.ts`.
 */

/** Ro'yxat endpoint'lari uchun sahifalash meta ma'lumoti. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Sahifalangan javob. */
export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

/** Ro'yxat so'rovlarining umumiy query parametrlari. */
export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Backend qaytaradigan xato tanasi. */
export interface ApiErrorBody {
  message: string;
  /** Maydon nomi -> xato matnlari. Form validatsiyasi uchun. */
  errors?: Record<string, string[]>;
  code?: string;
}

/** Auth endpoint'lari qaytaradigan token juftligi. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
