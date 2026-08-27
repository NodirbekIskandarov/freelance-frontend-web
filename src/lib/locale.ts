export const LOCALES = ['uz', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'uz';

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
};

/** Tanlagichdagi qisqa yorliq — navbarda joy tor. */
export const LOCALE_SHORT: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
};

const STORAGE_KEY = 'yopamiz.locale';
const LOCALE_EVENT = 'yopamiz:locale';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Tanlangan til.
 *
 * `localStorage` VA cookie'da saqlanadi. Ikkisi ham kerak: birinchisini
 * mijoz o'qiydi, ikkinchisi esa server so'rovlariga ilashadi — Next.js
 * Server Component brauzer xotirasini ko'rmaydi.
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Shaxsiy rejimda `localStorage` o'qish ham xato berishi mumkin.
  }

  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Saqlab bo'lmasa ham joriy seans uchun til o'zgaradi.
  }

  // `max-age` bir yil, `SameSite=Lax` — bu shaxsiy ma'lumot emas, faqat
  // ko'rsatish tili.
  document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;

  window.dispatchEvent(new Event(LOCALE_EVENT));
}

export function subscribeToLocale(onChange: () => void): () => void {
  window.addEventListener(LOCALE_EVENT, onChange);
  // Boshqa yorliqdagi o'zgarish ham yetib kelsin.
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(LOCALE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}
