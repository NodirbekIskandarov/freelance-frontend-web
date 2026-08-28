'use client';

import { interpolate } from './interpolate';
import { useI18n } from './I18nProvider';
import type { Messages } from './messages/uz';

/**
 * Matn olish uchun qisqa yordamchi: `t((m) => m.auth.loginTitle)`.
 *
 * Kalit MATN sifatida emas, FUNKSIYA orqali beriladi — shunda noto'g'ri
 * yozilgan kalitni TypeScript build paytida tutadi. Matnli kalitda
 * (`t('auth.loginTitl')`) xato faqat saytdagi bo'sh joy bo'lib
 * ko'rinardi.
 */
export function useT() {
  const { messages, locale } = useI18n();

  function t(
    pick: (messages: Messages) => string,
    values?: Record<string, string | number>,
  ): string {
    return interpolate(pick(messages), values);
  }

  return { t, m: messages, locale };
}
