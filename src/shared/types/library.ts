import type { PublicUploader } from './catalogue';

/**
 * Foydalanuvchining kutubxonasi — sotib olingan yechimlar
 * (`/api/v1/me/library/`).
 *
 * Ro'yxat va tafsilot shakllari ATAYLAB farq qiladi: ro'yxatda faqat
 * jadval uchun kerak maydonlar bor, yuklab olinadigan `file` esa
 * faqat tafsilotda beriladi. Ya'ni fayl havolasi ro'yxat so'roviga
 * qo'shilib ketmaydi.
 */

export interface LibraryItem {
  id: string;
  solution_id: string;
  title: string;
  variant_label: string;
  /** Sotib olingan paytdagi narx — hozirgi narx o'zgargan bo'lishi mumkin. */
  price_paid: string;
  average_rating: string;
  purchased_at: string;
  created_at: string;
}

export interface SolutionPreview {
  id: string;
  file: string;
  caption: string;
  position: number;
}

export interface LibrarySolution {
  id: string;
  variant: string;
  variant_label: string;
  title: string;
  description: string;
  /** Yuklab olinadigan fayl — faqat egasiga beriladi. */
  file: string;
  previews: SolutionPreview[];
  price: string;
  average_rating: string;
  review_count: number;
  download_count: number;
  uploader: PublicUploader;
  created_at: string;
}

export interface LibraryItemDetail {
  id: string;
  solution: LibrarySolution;
  /** Sotib olingan paytdagi sarlavha — keyin o'zgargan bo'lishi mumkin. */
  purchased_title: string;
  price_paid: string;
  purchased_at: string;
  created_at: string;
}

export const LIBRARY_ORDERING_OPTIONS = [
  { value: '-purchased_at', label: 'Avval yangilari' },
  { value: 'purchased_at', label: 'Avval eskilari' },
  { value: 'title', label: 'Nomi (A–Z)' },
] as const;
