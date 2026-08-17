/**
 * Foydalanuvchining O'ZI yuklagan yechimlari va sotib olish oqimi.
 *
 * `PublicSolution` (katalogda ko'rinadigan) bilan ADASHTIRMANG: bu yerda
 * moderatsiya holati va rad etish sababi bor, ular faqat muallifga va
 * xodimga ko'rinadi.
 */

export const SOLUTION_STATUSES = [
  'pending',
  'approved',
  'published',
  'rejected',
  'archived',
] as const;
export type SolutionStatus = (typeof SOLUTION_STATUSES)[number];

export const SOLUTION_STATUS_LABELS: Record<SolutionStatus, string> = {
  pending: 'Tekshiruvda',
  approved: 'Tasdiqlangan',
  published: 'Sotuvda',
  rejected: 'Rad etilgan',
  archived: 'Arxivlangan',
};

export interface MySolution {
  id: string;
  variant: string;
  variant_label: string;
  uploader: string;
  title: string;
  description: string;
  file: string;
  price: string;
  status: SolutionStatus;
  reject_reason: string;
  commission_percent: string | null;
  published_at: string | null;
  moderated_by: string | null;
  created_at: string;
  updated_at: string;
}

/** `POST /solutions/` — `multipart/form-data`. */
export interface SolutionUploadRequest {
  variant: string;
  title: string;
  description?: string;
  file: File;
  price: string;
}

export const ORDER_STATUSES = ['pending', 'paid', 'refunded', 'failed'] as const;
export type PurchaseStatus = string;

/** `POST /solutions/{id}/purchase/` javobi. */
export interface Purchase {
  id: string;
  buyer: string;
  seller: string;
  solution: string;
  solution_title: string;
  unit_price: string;
  commission_percent: string;
  commission_amount: string;
  seller_earning: string;
  status: PurchaseStatus;
  wallet_reference: string;
  paid_at: string | null;
  created_at: string;
}

export const REPORT_REASONS = [
  { value: 'copyright', label: 'Mualliflik huquqi buzilgan' },
  { value: 'quality', label: 'Sifat talabga javob bermaydi' },
  { value: 'mismatch', label: 'Variantga mos kelmaydi' },
  { value: 'other', label: 'Boshqa sabab' },
] as const;

export interface SolutionReportRequest {
  reason: string;
  description?: string;
}

export interface SolutionReport {
  id: string;
  solution: string;
  user: string;
  reason: string;
  description: string;
  status: string;
  resolution_note: string;
  created_at: string;
}
