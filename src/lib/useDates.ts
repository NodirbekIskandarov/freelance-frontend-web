'use client';

import { formatDate, formatDateTime } from './format';

/**
 * Sanani ko'rsatish.
 *
 * Ko'rinish TILGA BOG'LIQ EMAS (`format.ts` da sababi yozilgan), lekin
 * chaqiruv joyi o'sha-o'sha qoldi: `useMoney` bilan bir xil naqsh va
 * ertaga tilga bog'liq bo'lib qolsa, chaqiruvchilarga tegish shart
 * bo'lmaydi.
 */
export function useDates() {
  return {
    date: formatDate,
    dateTime: formatDateTime,
  };
}
