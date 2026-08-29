'use client';

import { useEffect, useState } from 'react';

/**
 * Joriy vaqt — belgilangan oraliqda yangilanadigan holat sifatida.
 *
 * `Date.now()` ni to'g'ridan-to'g'ri renderda chaqirish ikki muammo: React
 * qoidasi buziladi (bir xil render har xil natija berardi) va qolgan vaqt
 * ekranda qotib qolardi — sahifa qayta chizilmaguncha «02:47» o'zgarmasdi.
 *
 * Sukut oraliq — bir daqiqa: shikoyat oynasi soatlar bilan o'lchanadi va
 * sekundiga qayta chizish behuda ish bo'lardi.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
