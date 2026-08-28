'use client';

import { LOCALE_TAGS } from '@/i18n/config';
import { useT } from '@/i18n/useT';

import { formatDate, formatDateTime } from './format';

/**
 * Sanani joriy tilda ko'rsatish.
 *
 * `useMoney` bilan bir xil naqsh: til kalitini har chaqiruvda qo'lda
 * uzatish o'nlab joyda takrorlanardi va bittasini unutish sanani
 * boshqa tilda qoldirardi.
 */
export function useDates() {
  const { locale } = useT();
  const tag = LOCALE_TAGS[locale];

  return {
    date: (value: string | null | undefined) => formatDate(value, tag),
    dateTime: (value: string | null | undefined) => formatDateTime(value, tag),
  };
}
