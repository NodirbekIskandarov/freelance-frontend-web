import type { Messages } from '@/i18n/messages/uz';

/**
 * Foydalanuvchi kabineti — haqiqiy backend (`/api/v1/me/...`).
 *
 * Pul maydonlari SATR: DRF `DecimalField` shunday qaytaradi va uni
 * `number`ga o'tkazib qaytarish katta summalarda aniqlikni yo'qotardi.
 */

export const ORDER_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function orderStatusLabel(status: OrderStatus, messages: Messages): string {
  const labels: Record<OrderStatus, string> = {
    pending: messages.student.statusPending,
    paid: messages.student.statusPaid,
    failed: messages.student.statusFailed,
    refunded: messages.student.statusRefunded,
  };

  return labels[status];
}

export interface MyOrder {
  id: string;
  reference: string;
  solution: string;
  solution_title: string;
  variant_label: string;
  assignment_title: string;
  subject_name: string;
  university_name: string;
  university_short_name: string;
  unit_price: string;
  status: OrderStatus;
  paid_at: string | null;
  created_at: string;
}

export interface MyBuyingStats {
  orders: number;
  paid: number;
  pending: number;
  failed: number;
  spent_total: string;
  library_items: number;
  saved: number;
  reviews_written: number;
}

export interface MySellingStats {
  total: number;
  pending: number;
  published: number;
  rejected: number;
  sales: number;
  earned_total: string;
}

export interface MyDashboard {
  buying: MyBuyingStats;
  selling: MySellingStats;
  recent_orders: MyOrder[];
}

export const TRANSACTION_TYPES = [
  'topup',
  'purchase',
  'sale',
  'refund',
  'withdrawal',
  'adjustment',
  // Tasdiqlangan katalog arizasi uchun platforma to'lovi. Ilgari bu
  // ro'yxatda YO'Q edi va bunday yozuv turi bo'sh chiqardi.
  'reward',
  'escrow_hold',
  'escrow_release',
  'escrow_refund',
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/*
  Yorliqlar TARJIMA LUG'ATIDA (`m.txn`), bu yerda emas.

  Ilgari ular shu faylda qat'iy o'zbekcha yozilgan edi va rus tilida ham
  o'zbekcha chiqardi — `assignmentTypeLabel` da allaqachon tuzatilgan
  o'sha xato.
*/

/**
 * Tranzaksiya balansni oshiradimi.
 *
 * Tur bo'yicha ajratish NOTO'G'RI edi: `adjustment` ikkala tomonga ham
 * ishlaydi va musbat tuzatish qizil minus bo'lib ko'rinardi. Backend
 * summani o'z ishorasi bilan qaytaradi (`"-50000.00"`), shuning uchun
 * yagona ishonchli manba — shu ishora.
 */
export function isCreditTransaction(amount: string): boolean {
  return !amount.trimStart().startsWith('-');
}

/** Ishorasiz summa — belgi alohida chiziladi. */
export function absoluteAmount(amount: string): string {
  return amount.replace('-', '');
}

export interface WalletTotals {
  topped_up: string;
  earned: string;
  spent: string;
  withdrawn: string;
  pending_withdrawal: string;
  /**
   * Sotilgan, lekin hali yetib kelmagan pul.
   *
   * `balance` ning ICHIDA EMAS — ulush sotuvchiga o'tmagan. Shuning uchun
   * uni balansdan ayirish ham, qo'shish ham noto'g'ri: bu alohida raqam.
   */
  held: string;
  held_count: number;
  /** Eng yaqin ochilish. Nizodagi ulushlar hisobga olinmaydi. */
  next_release_at: string | null;
}

export interface Wallet {
  id: string;
  balance: string;
  is_frozen: boolean;
  totals: WalletTotals;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: string;
  balance_after: string;
  description: string;
  reference_type: string;
  reference_id: string;
  created_at: string;
}

export const WITHDRAWAL_METHODS = ['card', 'phone'] as const;
export type WithdrawalMethod = (typeof WITHDRAWAL_METHODS)[number];

export const WITHDRAWAL_METHOD_LABELS: Record<WithdrawalMethod, string> = {
  card: 'Bank kartasi',
  phone: 'Telefon raqami',
};

export const WITHDRAWAL_STATUSES = ['pending', 'paid', 'rejected'] as const;
export type WithdrawalStatus = (typeof WITHDRAWAL_STATUSES)[number];

export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  pending: 'Kutilmoqda',
  paid: "To'langan",
  rejected: 'Rad etilgan',
};

export interface WithdrawalRequest {
  id: string;
  reference: string;
  amount: string;
  method: WithdrawalMethod;
  destination: string;
  destination_name: string;
  status: WithdrawalStatus;
  admin_note: string;
  processed_at: string | null;
  created_at: string;
}

export interface WithdrawalCreateRequest {
  amount: string;
  method: WithdrawalMethod;
  destination: string;
  destination_name?: string;
}

export interface SavedSolution {
  id: string;
  solution: string;
  solution_title: string;
  solution_status: string;
  price: string;
  average_rating: string;
  variant_label: string;
  assignment_title: string;
  subject_name: string;
  university_name: string;
  university_short_name: string;
  created_at: string;
}

export const APPEAL_TOPICS = [
  'payment',
  'solution',
  'account',
  'freelance',
  'suggestion',
  'other',
] as const;
export type AppealTopic = (typeof APPEAL_TOPICS)[number];

/** Yorliqlar lug'atdan — bu fayl matn saqlagani uchun rus tilida o'zbekcha chiqarardi. */
export function appealTopicLabel(topic: AppealTopic, messages: Messages): string {
  const labels: Record<AppealTopic, string> = {
    payment: messages.appeals.topicPayment,
    solution: messages.appeals.topicSolution,
    account: messages.appeals.topicAccount,
    freelance: messages.appeals.topicFreelance,
    suggestion: messages.appeals.topicSuggestion,
    other: messages.appeals.topicOther,
  };

  return labels[topic];
}

export const APPEAL_STATUSES = ['open', 'in_review', 'resolved'] as const;
export type AppealStatus = (typeof APPEAL_STATUSES)[number];

export function appealStatusLabel(status: AppealStatus, messages: Messages): string {
  const labels: Record<AppealStatus, string> = {
    open: messages.appeals.statusOpen,
    in_review: messages.appeals.statusInReview,
    resolved: messages.appeals.statusResolved,
  };

  return labels[status];
}

export interface Appeal {
  id: string;
  reference: string;
  topic: AppealTopic;
  subject: string;
  message: string;
  status: AppealStatus;
  reply: string;
  replied_at: string | null;
  created_at: string;
}

export interface AppealCreateRequest {
  topic?: AppealTopic;
  subject: string;
  message: string;
}
