/**
 * Tillar ro'yxati va URL bilan bog'liq qoidalar.
 *
 * Til URL'ning BIRINCHI bo'lagida turadi (`/uz/materials`, `/ru/materials`).
 * Cookie yoki sarlavhada saqlash ham mumkin edi, lekin unda bir manzil ikki
 * xil tilda ochilardi: qidiruv tizimlari uchun ham, havolani do'stiga
 * yuborgan odam uchun ham noto'g'ri.
 */

export const LOCALES = ['uz', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

/** Sayt o'zbek tilida yozilgan — noma'lum holatda shunga qaytamiz. */
export const DEFAULT_LOCALE: Locale = 'uz';

/** Tanlov brauzerda shu nom bilan saqlanadi (keyingi tashrifda eslab qolinadi). */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Tilni URL boshidan ajratib olish. Topilmasa `null`. */
export function localeFromPathname(pathname: string): Locale | null {
  const first = pathname.split('/')[1];
  return isLocale(first) ? first : null;
}

/**
 * Manzilga til qo'shish.
 *
 * Tashqi havolalar (`http…`, `mailto:`, `#…`) tegilmaydi — ularga til
 * qo'shish manzilni buzardi.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href;

  const existing = localeFromPathname(href);
  if (existing === locale) return href;
  if (existing) return `/${locale}${href.slice(existing.length + 1) || '/'}`;

  return href === '/' ? `/${locale}` : `/${locale}${href}`;
}

/** Manzildan til bo'lagini olib tashlash — til almashtirgichga kerak. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPathname(pathname);
  if (!locale) return pathname;

  return pathname.slice(locale.length + 1) || '/';
}

/** `<html lang>` va `Accept-Language` uchun to'liq kod. */
export const LOCALE_TAGS: Record<Locale, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
};

/** Til almashtirgichdagi yozuvlar — har biri O'Z tilida. */
export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
};
