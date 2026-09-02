'use client';

import { useEffect, useState } from 'react';

/**
 * Foydalanuvchi harakatni kamaytirishni so'raganmi.
 *
 * Animatsiyalarning O'ZI CSS'da (`globals.css`) va ular
 * `prefers-reduced-motion` bilan o'zi o'chadi — bu hook faqat
 * ANIMATSIYA EMAS, XATTI-HARAKAT uchun kerak: masalan bannerning
 * slaydlarni o'zi almashtirishi. Uni CSS to'xtata olmaydi.
 *
 * Serverda va birinchi chizishda `false`: `matchMedia` faqat brauzerda
 * bor, va boshlang'ich qiymatni taxmin qilish server chizgan HTML bilan
 * mos kelmay hydration ogohlantirishini chiqarardi.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}
