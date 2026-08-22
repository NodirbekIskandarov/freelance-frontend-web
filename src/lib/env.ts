/**
 * Muhit o'zgaruvchilari bir joyda tekshiriladi.
 * Noto'g'ri sozlansa, xato ilova ishga tushganda chiqadi — birinchi
 * so'rov 404 bo'lganda emas.
 */

/**
 * Oxiridagi `/` OLIB TASHLANADI.
 *
 * Yo'llar `/auth/login/` ko'rinishida yoziladi, shuning uchun bazaviy
 * manzil `…/api/v1/` bo'lsa `…/api/v1//auth/login/` hosil bo'ladi va
 * server buni 404 qaytaradi (ikkilangan slashni yig'ishtirmaydi).
 * Sozlamadagi bitta ortiqcha belgi butun ilovani ishdan chiqarmasin.
 */
function trimSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL sozlanmagan. `apps/web/.env.local` faylini `.env.example` dan nusxalang.',
  );
}

const apiUrl = trimSlash(rawApiUrl);

/**
 * Ochiq katalog uchun backend manzili.
 *
 * `NEXT_PUBLIC_API_URL` dan ALOHIDA: u mijoz tomonidagi RTK Query
 * uchun. Katalog esa Server Component'da o'qiladi — server so'roviga
 * CORS qo'llanmagani uchun to'liq manzil ishlatiladi.
 */
const catalogueApiUrl = trimSlash(process.env.CATALOGUE_API_URL ?? 'https://api.yopamiz.uz/api/v1');

/**
 * WebSocket manzilining ILDIZI.
 *
 * Backend chipta bilan birga NISBIY yo'l qaytaradi (`/ws/notifications/`),
 * shuning uchun host API manzilidan olinadi: `/api/v1` qirqiladi va
 * sxema `ws`/`wss` ga almashtiriladi.
 */
const wsOrigin = apiUrl.replace(/\/api\/v\d+\/?$/, '').replace(/^http/, 'ws');

export const env = {
  apiUrl,
  catalogueApiUrl,
  wsOrigin,
  isProduction: process.env.NODE_ENV === 'production',
} as const;
