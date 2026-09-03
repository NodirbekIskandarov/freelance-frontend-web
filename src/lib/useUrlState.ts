'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Holatni manzil qatoridagi so'rov parametri bilan sinxronlaydi.
 *
 * Manzilning O'ZI holat: alohida `useState` yo'q. Ikkita manba bo'lganda
 * ular bir-biridan uzoqlashib qolardi — masalan «orqaga» bosilganda
 * manzil o'zgarib, ekran eski qiymatda qolardi.
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
 * `useSyncExternalStore`, EFFEKT EMAS — saytda tema bilan bir xil naqsh.
 * Sahifalar serverda statik chiziladi va u yerda manzil qatori yo'q.
 * Birinchi renderda o'qilsa React «server rendered text didn't match»
 * deb butun daraxtni tashlab qaytadan chizardi — chuqur havola bilan
 * kelingan har safar. `getServerSnapshot` aynan shu holat uchun: server
 * `null` ko'radi, mijoz esa hydration tugagach haqiqiy qiymatga o'tadi.
 */

/** `replaceState` hech qanday hodisa chiqarmaydi — o'zimiz tarqatamiz. */
const URL_EVENT = 'yopamiz:url-state';

function subscribe(onChange: () => void): () => void {
  window.addEventListener(URL_EVENT, onChange);
  // «Orqaga» va «oldinga» — brauzer o'zi xabar beradi.
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener(URL_EVENT, onChange);
    window.removeEventListener('popstate', onChange);
  };
}

export function useUrlState(
  key: string,
  fallback: string,
  options: { isValid?: (value: string) => boolean } = {},
): [string, (next: string) => void] {
  const { isValid } = options;

  const raw = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    // Serverda manzil qatori yo'q. `null` — «hali noma'lum».
    () => null,
  );

  // Manzilni istalgan odam qo'lda yozishi mumkin — noto'g'ri qiymat
  // ekranni bo'sh qoldirmasin.
  const value = raw !== null && (!isValid || isValid(raw)) ? raw : fallback;

  const update = useCallback(
    (next: string) => {
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
      window.dispatchEvent(new Event(URL_EVENT));
    },
    [fallback, key],
  );

  return [value, update];
}
