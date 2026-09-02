import type { DisputeStatus } from './disputes';

/**
 * Sotuvning holati — SOTUVCHI savoliga javob beradi: «pulim qayerda».
 *
 * Bu buyurtma statusi emas. Buyurtma «to'lov o'tdimi» degan savolga javob
 * beradi va uning holatlari boshqa: sotuvchi uchun to'langan buyurtma hali
 * pul emas, u ushlab turilgan pul.
 */
export const SALE_STATUSES = [
  'held',
  'released',
  'disputed',
  'refunded',
  'partially_refunded',
] as const;

export type SaleStatus = (typeof SALE_STATUSES)[number];

export interface Sale {
  id: string;
  /** `ORD-0A86B287` — qo'llab-quvvatlashga ko'rsatiladigan havola. */
  order_reference: string;
  solution: string;
  solution_title: string;
  variant_label: string;
  /** Xaridor NIQOBLANGAN: sotuvchiga uning ismi ham, raqami ham berilmaydi. */
  buyer_masked: string;
  unit_price: string;
  commission_amount: string;
  seller_earning: string;
  /** Nizo qaytarish bilan tugagan bo'lsa — qancha qaytarilgani. */
  refunded_amount: string | null;
  status: SaleStatus;
  paid_at: string;
  releases_at: string | null;
  released_at: string | null;
  /** Shu sotuvga qo'llanilgan qoida. Sozlama o'zgarsa ham o'zgarmaydi. */
  hold_window_hours: number | null;
  dispute_status: DisputeStatus | '';
  dispute_id: string | null;
}

export interface SalesQuery {
  status?: SaleStatus;
  search?: string;
  page?: number;
  page_size?: number;
}
