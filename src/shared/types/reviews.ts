import type { PublicUploader } from './catalogue';

/**
 * Yechim sharhlari.
 *
 * Sharh qoldirish uchun yechim SOTIB OLINGAN bo'lishi shart va bitta
 * foydalanuvchi bitta yechimga bitta sharh yozadi — shuning uchun UI
 * "yozish" va "tahrirlash" o'rtasida mavjud sharhga qarab tanlaydi.
 */

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export interface Review {
  id: string;
  solution: string;
  user: PublicUploader;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWriteRequest {
  rating: number;
  comment?: string;
}
