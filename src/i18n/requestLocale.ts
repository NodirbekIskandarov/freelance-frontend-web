import 'server-only';

import { cache } from 'react';

import { DEFAULT_LOCALE, type Locale } from './config';

/**
 * Joriy so'rovning tili — server tomondagi ma'lumot olish uchun.
 *
 * Muammo: katalogni o'qiydigan funksiyalar (`getCatalogueTree` va
 * boshqalar) sahifadan chuqurda chaqiriladi va ularning har biriga
 * tilni parametr qilib uzatish o'nlab imzoni o'zgartirardi — bittasini
 * unutish esa sahifaning bir qismini boshqa tilda qoldirardi.
 *
 * `cache()` React'ning HAR SO'ROV uchun alohida bo'ladigan xotirasi:
 * bu yerda saqlangan qiymat boshqa so'rovga o'tib ketmaydi.
 *
 * DIQQAT: `setRequestLocale` layout'da ham, ma'lumot oladigan HAR
 * sahifada ham chaqiriladi. React layout va sahifani qat'iy ketma-ket
 * chizishga va'da bermaydi, ya'ni faqat layout'ga ishonish sahifa
 * o'zbekcha ma'lumot olib qolishiga olib kelishi mumkin.
 */
const store = cache((): { locale: Locale } => ({ locale: DEFAULT_LOCALE }));

export function setRequestLocale(locale: Locale): void {
  store().locale = locale;
}

export function getRequestLocale(): Locale {
  return store().locale;
}
