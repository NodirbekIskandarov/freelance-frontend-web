'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

/**
 * Til almashgandan keyin tema klassini qaytadan qo'yadi.
 *
 * Muammo: til manzilning birinchi bo'lagi, ya'ni `[locale]` root
 * layout'ning parametri. `/uz/...` dan `/ru/...` ga o'tilganda React
 * butun qobiqni qayta chizadi va `<html>` atributlarini SERVER
 * qiymatiga qaytaradi. Tema klassi esa serverda yo'q — u brauzerda,
 * `<body>` boshidagi skript tomonidan qo'yiladi. Natijada qorong'i
 * rejim til almashtirilganda o'z-o'zidan yorug'ga o'tib ketardi.
 *
 * Skriptning o'zi qayta ishga tushmaydi (`window` saqlanadi, sahifa
 * to'liq yuklanmaydi), shuning uchun uni shu yerdan chaqiramiz.
 *
 * `useLayoutEffect`, `useEffect` emas: u DOM o'zgargandan keyin, lekin
 * brauzer CHIZISHIDAN oldin ishlaydi — shu sababli klass bir kadrga ham
 * yo'qolib ko'rinmaydi. Serverda bu hook ogohlantirish beradi, shuning
 * uchun u yerda oddiy `useEffect` ishlatiladi (u hech qachon
 * chaqirilmaydi — komponent serverda hech narsa chizmaydi).
 */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function ThemeSync() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    window.__applyTheme?.();
  }, [pathname]);

  return null;
}
