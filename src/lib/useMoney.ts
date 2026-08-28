'use client';

import { useT } from '@/i18n/useT';

import { formatDecimalSom, formatSom } from './format';

/**
 * Pul summasini joriy tilda ko'rsatish.
 *
 * `formatSom` ni to'g'ridan-to'g'ri chaqirish ham mumkin, lekin unda
 * valyuta so'zini har safar qo'lda uzatish kerak bo'lardi — bitta
 * joyda unutilsa, sahifada aralash til paydo bo'lardi.
 */
export function useMoney() {
  const { m } = useT();
  const currency = m.common.currency;

  return {
    som: (value: number) => formatSom(value, currency),
    decimalSom: (value: string | null) => formatDecimalSom(value, currency),
  };
}
