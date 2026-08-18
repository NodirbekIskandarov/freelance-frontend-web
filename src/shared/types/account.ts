/**
 * Foydalanuvchi kabineti — haqiqiy backend (`/api/v1/me/...`).
 *
 * Pul maydonlari SATR: DRF `DecimalField` shunday qaytaradi va uni
 * `number`ga o'tkazib qaytarish katta summalarda aniqlikni yo'qotardi.
 */

export const ORDER_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Kutilmoqda',
  paid: "To'langan",
  failed: 'Amalga oshmadi',
  refunded: 'Qaytarilgan',
};

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
  'escrow_hold',
  'escrow_release',
  'escrow_refund',
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  topup: "To'ldirish",
  purchase: 'Xarid',
  sale: 'Sotuv',
  refund: 'Qaytarish',
  withdrawal: 'Yechib olish',
  adjustment: 'Tuzatish',
  escrow_hold: 'Kafolatga olindi',
  escrow_release: 'Kafolatdan berildi',
  escrow_refund: 'Kafolatdan qaytarildi',
};

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

export const APPEAL_TOPIC_LABELS: Record<AppealTopic, string> = {
  payment: "To'lov",
  solution: 'Yechim',
  account: 'Hisob',
  freelance: 'Freelance',
  suggestion: 'Taklif',
  other: 'Boshqa',
};

export const APPEAL_STATUSES = ['open', 'in_review', 'resolved'] as const;
export type AppealStatus = (typeof APPEAL_STATUSES)[number];

export const APPEAL_STATUS_LABELS: Record<AppealStatus, string> = {
  open: 'Yangi',
  in_review: "Ko'rib chiqilmoqda",
  resolved: 'Hal qilindi',
};

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
