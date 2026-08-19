import type { WorkDirection } from './publicFreelance';

/**
 * Freelance birjasi — haqiqiy backend (`/api/v1/freelance/...`).
 *
 * Bitta topshiriqning ikki tomoni bor: mijoz uni joylaydi
 * (`/me/freelance/tasks/`), freelancer esa qabul qiladi
 * (`/me/freelance/jobs/`). Shakl ikkalasida bir xil — farq faqat
 * foydalanuvchi qaysi tomonda turishida.
 */

export const TASK_STATUSES = [
  'open',
  'in_progress',
  'delivered',
  'completed',
  'cancelled',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Ochiq',
  in_progress: 'Bajarilmoqda',
  delivered: 'Topshirildi',
  completed: 'Yakunlandi',
  cancelled: 'Bekor qilindi',
};

export const OFFER_STATUSES = ['pending', 'accepted', 'declined', 'withdrawn'] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  pending: 'Kutilmoqda',
  accepted: 'Qabul qilindi',
  declined: 'Rad etildi',
  withdrawn: 'Qaytarib olindi',
};

/** Muddat tanlovi kunlarda — backend `enum` sifatida qabul qiladi. */
export const DEADLINE_OPTIONS = [1, 3, 5, 7, 14, 30] as const;
export type DeadlineDays = (typeof DEADLINE_OPTIONS)[number];

/** Topshiriq tomonlari — faqat ism ko'rsatiladi. */
export interface Party {
  id: string;
  full_name: string;
}

export interface ExchangeTask {
  id: string;
  reference: string;
  title: string;
  direction: WorkDirection;
  direction_display: string;
  description: string;
  deadline_days: number;
  budget: string | null;
  status: TaskStatus;
  offer_count: number;
  client: Party | null;
  freelancer: Party | null;
  agreed_price: string | null;
  agreed_deadline_days: number | null;
  started_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string;
  created_at: string;
}

/** Tafsilotda fayl va komissiya ham keladi. */
export interface ExchangeTaskDetail extends ExchangeTask {
  task_file: string | null;
  delivery_file: string | null;
  delivery_note: string;
  commission_percent: string | null;
  commission_amount: string | null;
  freelancer_earning: string | null;
}

export interface ExchangeOffer {
  id: string;
  task: string;
  freelancer: Party;
  freelancer_rating: string;
  freelancer_completed_jobs: number;
  message: string;
  price: string;
  deadline_days: number;
  status: OfferStatus;
  created_at: string;
}

export interface ExchangeTaskWriteRequest {
  title: string;
  direction: WorkDirection;
  description?: string;
  deadline_days: DeadlineDays;
  budget?: string;
  /** Fayl bo'lsa so'rov `multipart/form-data`ga o'tadi. */
  task_file?: File;
}

export interface ExchangeOfferCreateRequest {
  message: string;
  price: string;
  deadline_days: DeadlineDays;
}

/**
 * Yakunlangan ish uchun sharh.
 *
 * Sharhni MIJOZ yozadi va u FREELANCERga tegishli — shuning uchun
 * ro'yxat `/freelance/freelancers/{id}/reviews/` da, yozish esa
 * `/freelance/tasks/{id}/review/` da.
 */
export interface ExchangeReview {
  id: string;
  task: string;
  task_title: string;
  client: string;
  client_name: string;
  client_avatar: string;
  freelancer: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ExchangeReviewWriteRequest {
  rating: number;
  comment?: string;
}

export interface TaskDeliverRequest {
  note?: string;
  file?: File;
}
