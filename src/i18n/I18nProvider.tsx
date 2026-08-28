'use client';

import { createContext, use, type ReactNode } from 'react';

import type { Locale } from './config';
import type { Messages } from './messages/uz';

/**
 * Tarjimalarni daraxt bo'ylab tarqatish.
 *
 * Xabarlar SERVERDA yuklanadi va provider orqali pastga uzatiladi. Har
 * bir mijoz komponenti o'zi yuklasa, ikkala tilning lug'ati ham bundle'ga
 * tushardi — kerak bo'lmagani ham.
 */
interface I18nValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, messages, children }: I18nValue & { children: ReactNode }) {
  return <I18nContext value={{ locale, messages }}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = use(I18nContext);

  if (!value) {
    // Provider'siz ishlatilsa jim ingliz/o'zbek aralashmasi chiqishidan
    // ko'ra darrov to'xtagani yaxshi — sabab shu yerda ko'rinadi.
    throw new Error('useI18n faqat <I18nProvider> ichida ishlaydi.');
  }

  return value;
}

/** Faqat xabarlar kerak bo'lganda — eng ko'p ishlatiladigan shakl. */
export function useMessages(): Messages {
  return useI18n().messages;
}

/** Faqat joriy til — havolalarni tuzish va sana formatlash uchun. */
export function useLocale(): Locale {
  return useI18n().locale;
}
