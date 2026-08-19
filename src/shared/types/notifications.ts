/**
 * Bildirishnomalar — haqiqiy backend (`/api/v1/me/notifications/`).
 *
 * Turlar ro'yxati uzun (26 ta), lekin ularning har biriga alohida matn
 * yozilmaydi: sarlavha va matn backenddan tayyor keladi. Frontendga
 * faqat KATEGORIYA kerak — ikonka, rang va filtr shunga bog'liq.
 */

export const NOTIFICATION_CATEGORIES = [
  'marketplace',
  'freelance',
  'wallet',
  'moderation',
  'support',
  'account',
] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  marketplace: 'Xaridlar',
  freelance: 'Freelance',
  wallet: 'Hamyon',
  moderation: 'Moderatsiya',
  support: "Qo'llab-quvvatlash",
  account: 'Hisob',
};

export interface Notification {
  id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /**
   * Nimaga tegishli ekani — `reference_type` obyekt turi
   * ("order", "task", "solution"), `reference_id` esa uning UUID'si.
   * Havola shu ikkovidan yig'iladi.
   */
  reference_type: string;
  reference_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  /** Kategoriya kaliti → o'qilmaganlar soni. Bo'sh kategoriyalar kelmaydi. */
  unread_by_category: Record<string, number>;
}

export interface MarkAllReadResponse {
  marked: number;
}

/** WebSocket uchun bir martalik chipta — u qisqa muddat amal qiladi. */
export interface WebSocketTicket {
  ticket: string;
  expires_in: number;
  url: string;
}

export interface NotificationsQuery {
  page?: number;
  page_size?: number;
  category?: NotificationCategory;
  is_read?: boolean;
  type?: string;
}
