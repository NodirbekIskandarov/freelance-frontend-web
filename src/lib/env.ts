/**
 * Muhit o'zgaruvchilari bir joyda tekshiriladi.
 * Noto'g'ri sozlansa, xato ilova ishga tushganda chiqadi — birinchi
 * so'rov 404 bo'lganda emas.
 */

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL sozlanmagan. `apps/web/.env.local` faylini `.env.example` dan nusxalang.',
  );
}

export const env = {
  apiUrl,
  isProduction: process.env.NODE_ENV === 'production',
} as const;
