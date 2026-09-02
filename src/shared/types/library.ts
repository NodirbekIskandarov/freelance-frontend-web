import type { Messages } from '@/i18n/messages/uz';

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
  /** Shikoyat XARIDGA yoziladi — bir yechimni ikki marta olgan bo'lish mumkin. */
  order_id: string;
  /** Bo'sh — shikoyat yo'q. Bo'lsa tugma o'rniga holat ko'rsatiladi. */
  dispute_status: string;
  /**
   * Shikoyat oynasi qachon yopiladi — SERVERDAN.
   *
   * Mijozda «xarid + 24 soat» deb hisoblab bo'lmaydi: muddat sozlamaga
   * bog'liq va har buyurtma o'zi sotilgan qoidani olib yuradi. Eski
   * buyurtmalarda `null` bo'lishi mumkin.
   */
  dispute_deadline: string | null;
  /** O'sha buyurtmaga berilgan muddat, soatda. */
  dispute_window_hours: number | null;
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
  { value: '-purchased_at', label: (m: Messages) => m.library.sortNewest },
  { value: 'purchased_at', label: (m: Messages) => m.library.sortOldest },
  { value: 'title', label: (m: Messages) => m.library.sortTitle },
] as const;
