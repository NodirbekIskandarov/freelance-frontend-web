import { DEFAULT_LOCALE, LOCALE_COOKIE, localeFromPathname, type Locale } from '@/i18n/config';

export { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config';
export { LOCALE_SHORT_LABELS as LOCALE_SHORT } from '@/i18n/config';

/**
 * Joriy til — MANZILDAN.
 *
 * Ilgari u `localStorage` da saqlanardi va manzil bilan bog'liq emasdi:
 * bitta havola ikki odamda ikki xil tilda ochilardi. Endi manzil yagona
 * manba, cookie esa faqat KEYINGI tashrifda qaysi tilga yo'naltirishni
 * eslab qolish uchun.
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  return localeFromPathname(window.location.pathname) ?? DEFAULT_LOCALE;
}

/**
 * Tanlovni cookie'ga yozish.
 *
 * Sahifani BU FUNKSIYA almashtirmaydi — buni til tanlagich navigatsiya
 * orqali qiladi. Bu yerda faqat middleware keyingi safar to'g'ri tilga
 * yo'naltirishi uchun iz qoldiriladi.
 */
export function rememberLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;

  // Bir yil, `SameSite=Lax` — bu shaxsiy ma'lumot emas, faqat ko'rsatish tili.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
