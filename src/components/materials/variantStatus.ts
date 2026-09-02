import type { Messages } from '@/i18n/messages/uz';
import type { Variant } from '@/shared/types/catalogue';

export interface VariantWithCount extends Variant {
  solutionCount: number;
}

/**
 * Bitta odam bitta variantga nechta yechim yubora oladi.
 *
 * Backenddagi `MAX_SOLUTIONS_PER_USER_PER_VARIANT` bilan bir xil. Mijozda
 * takrorlangani — chegaraga yetganda tugmani o'chirib qo'yish uchun:
 * uchinchi urinishda faylni yuklab bo'lib, keyin xato olish yomon.
 * Haqiqiy chek baribir serverda.
 */
export const MAX_UPLOADS_PER_VARIANT = 2;

export type VariantStatus = 'available' | 'requested' | 'empty';

/**
 * Ko'rsatiladigan so'rovlar soni — shu seansda qo'shilgani bilan birga.
 *
 * `request_count` sahifa statik chizilgan paytdagi qiymat: sahifa ISR bilan
 * besh daqiqada bir yangilanadi, ya'ni hozirgina bosilgan so'rov unda YO'Q.
 * Natijada tugma «So'rov yuborildi» deb turar, karta esa «Tayyor emas»
 * bo'lib qolaverardi — odam bosdimi-yo'qmi bilmasdi.
 *
 * Faqat SHU seansdagi bosishlar qo'shiladi. Serverdan kelgan «siz allaqachon
 * so'ragansiz» belgisi qo'shilmaydi: eski so'rov statik sanoqqa allaqachon
 * kirgan va uni yana qo'shish ikki marta sanash bo'lardi.
 */
export function requestCountOf(variant: VariantWithCount, justRequested: boolean): number {
  return variant.request_count + (justRequested ? 1 : 0);
}

export function statusOf(variant: VariantWithCount, justRequested: boolean): VariantStatus {
  if (variant.solutionCount > 0) return 'available';
  if (requestCountOf(variant, justRequested) > 0) return 'requested';
  return 'empty';
}

export const STATUS_LABELS = (m: Messages): Record<VariantStatus, string> => ({
  available: m.variants.statusAvailable,
  requested: m.variants.statusRequested,
  empty: m.variants.statusEmpty,
});

export const DOT: Record<VariantStatus, string> = {
  available: 'bg-emerald-500',
  requested: 'bg-amber-500',
  empty: 'bg-zinc-500/60',
};

export const BADGE: Record<VariantStatus, string> = {
  available: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  requested: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  empty: 'bg-muted text-muted-foreground',
};
