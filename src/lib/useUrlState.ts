'use client';

import { useCallback, useState } from 'react';

/**
 * Holatni manzil qatoridagi so'rov parametri bilan sinxronlaydi.
 *
 * Nima uchun `history.replaceState`, Next.js `router.replace` emas:
 * `router.replace` marshrutni qayta yuritadi va statik sahifada RSC
 * yukini qaytadan so'raydi — tab almashtirish uchun bu ortiqcha
 * borish-kelish va ko'zga tashlanadigan sakrash. Brauzer API'si esa
 * manzilni hech nimani qayta yuklamasdan almashtiradi.
 *
 * `replaceState`, `pushState` emas: filtr va tab tarixga yozilsa,
 * «orqaga» tugmasi sahifadan chiqish o'rniga oldingi tabga qaytarardi
 * va undan chiqish uchun necha marta bosish kerakligi bilinmasdi.
 *
 * Boshlang'ich qiymat manzildan BIR MARTA o'qiladi (lazy initializer):
 * keyingi o'qishlar holatni manba deb biladi, aks holda tashqi
 * o'zgarish bilan ichki holat bir-birini quvlab qolardi.
 */
export function useUrlState(
  key: string,
  fallback: string,
  options: { isValid?: (value: string) => boolean } = {},
): [string, (next: string) => void] {
  const { isValid } = options;

  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') return fallback;

    const found = new URLSearchParams(window.location.search).get(key);
    if (!found) return fallback;
    // Manzilni istalgan odam qo'lda yozishi mumkin — noto'g'ri qiymat
    // holatga tushib, ekranni bo'sh qoldirmasin.
    if (isValid && !isValid(found)) return fallback;
    return found;
  });

  const update = useCallback(
    (next: string) => {
      setValue(next);

      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      // Standart qiymat manzilga yozilmaydi: `?tur=independent` degan
      // qo'shimchasiz havola tozaroq va ulashishga qulayroq.
      if (next === fallback) {
        params.delete(key);
      } else {
        params.set(key, next);
      }

      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        query ? `${window.location.pathname}?${query}` : window.location.pathname,
      );
    },
    [fallback, key],
  );

  return [value, update];
}
