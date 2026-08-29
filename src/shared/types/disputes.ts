import type { Messages } from '@/i18n/messages/uz';

/**
 * Xarid bo'yicha shikoyat (`/api/v1/disputes/`) va muallifning «hold» puli
 * (`/api/v1/me/sales/held/`).
 *
 * Yechim ustidan shikoyat (`SolutionReport`) bilan ADASHTIRMANG: u «buni
 * sotuvga qo'yish kerak emas» deydi va uni har kim yozadi. Bu esa «men buni
 * sotib oldim va bu men olgan narsa emas» — faqat xaridor yozadi, faqat
 * xariddan keyingi oyna ichida, va natijasi pul harakati.
 */

export const DISPUTE_REASONS = [
  'not_matching',
  'broken_file',
  'differs',
  'stolen',
  'duplicate',
] as const;
export type DisputeReason = (typeof DISPUTE_REASONS)[number];

export function disputeReasonLabel(reason: DisputeReason, messages: Messages): string {
  return messages.dispute.reasons[reason].title;
}

export const DISPUTE_STATUSES = ['pending', 'answered', 'resolved', 'rejected'] as const;
export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

export function disputeStatusLabel(status: DisputeStatus, messages: Messages): string {
  return messages.dispute.statuses[status];
}

export const DISPUTE_RESOLUTIONS = [
  'full_refund',
  'partial_refund',
  'replace',
  'dismissed',
] as const;
export type DisputeResolution = (typeof DISPUTE_RESOLUTIONS)[number];

export interface DisputeEvidence {
  id: string;
  file: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  order: string;
  solution: string;
  solution_title: string;
  unit_price: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  /** Muallif javob berishi kerak bo'lgan muddat. */
  respond_deadline: string;
  author_response: string;
  author_responded_at: string | null;
  resolution: DisputeResolution | '';
  resolution_note: string;
  refunded_amount: string;
  resolved_at: string | null;
  evidence: DisputeEvidence[];
  created_at: string;
}

/** `POST /disputes/` — dalil fayllari bilan `multipart/form-data`. */
export interface DisputeCreateRequest {
  order: string;
  reason: DisputeReason;
  description: string;
  evidence?: File[];
}

export interface DisputeStats {
  total: number;
  open: number;
  resolved: number;
  rejected: number;
  /** Xaridlarning necha foizi shikoyatga aylangani. */
  dispute_rate: string;
  average_hours: string;
  buyer_favoured_percent: string;
}

/** Muallif ulushi hali balansga tushmagan bitta sotuv. */
export interface HeldSale {
  id: string;
  solution: string;
  solution_title: string;
  variant_label: string;
  unit_price: string;
  seller_earning: string;
  paid_at: string;
  releases_at: string;
  /** Bo'sh — nizo yo'q. To'lgan bo'lsa pul soat bilan emas, qaror bilan ochiladi. */
  dispute_status: DisputeStatus | '';
}

export interface HeldEarnings {
  total: string;
  count: number;
  disputed_total: string;
  disputed_count: number;
  window_hours: number;
  results: HeldSale[];
}

/**
 * Xariddan keyin shikoyat qilish oynasi yopilganmi.
 *
 * Server baribir tekshiradi; bu faqat yopilgan xaridda tugmani umuman
 * ko'rsatmaslik uchun — bosilib, «muddat o'tdi» xatosini olish, javobi
 * allaqachon ma'lum savol.
 */
export function disputeWindowLeft(purchasedAt: string, windowHours: number): number {
  const closesAt = new Date(purchasedAt).getTime() + windowHours * 3_600_000;
  return closesAt - Date.now();
}
