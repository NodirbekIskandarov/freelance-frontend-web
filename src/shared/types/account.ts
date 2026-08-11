/** Foydalanuvchi saqlab qo'ygan element — material yoki freelancer. */
export const SAVED_ITEM_TYPES = ['material', 'freelancer'] as const;
export type SavedItemType = (typeof SAVED_ITEM_TYPES)[number];

export const SAVED_ITEM_TYPE_LABELS: Record<SavedItemType, string> = {
  material: 'Material',
  freelancer: 'Freelancer',
};

export interface SavedItem {
  id: string;
  type: SavedItemType;
  title: string;
  subtitle: string;
  /** Elementga o'tish yo'li. */
  href: string;
  savedAt: string;
}

export const WALLET_TRANSACTION_TYPES = ['topup', 'purchase', 'refund'] as const;
export type WalletTransactionType = (typeof WALLET_TRANSACTION_TYPES)[number];

export const WALLET_TRANSACTION_LABELS: Record<WalletTransactionType, string> = {
  topup: "To'ldirish",
  purchase: 'Xarid',
  refund: 'Qaytarish',
};

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  description: string;
  /** Musbat — balans oshgan, manfiy — kamaygan. */
  amount: number;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

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
  subject: string;
  message: string;
  status: AppealStatus;
  createdAt: string;
  /** Qo'llab-quvvatlash javobi — hali berilmagan bo'lsa `null`. */
  reply: string | null;
}

export interface CreateAppealInput {
  subject: string;
  message: string;
}
