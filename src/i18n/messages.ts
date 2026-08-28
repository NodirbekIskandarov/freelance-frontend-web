import 'server-only';

import { DEFAULT_LOCALE, type Locale } from './config';
import type { Messages } from './messages/uz';

export type { Messages };

/**
 * Xabarlarni SERVERDA yuklash.
 *
 * `import()` — statik `import` emas: shunda faqat so'ralgan tilning
 * lug'ati o'qiladi. Ikkalasini ham yuklash bundle'ni ikki barobar
 * kattalashtirardi va ulardan biri hech qachon ishlatilmasdi.
 */
const loaders: Record<Locale, () => Promise<Messages>> = {
  uz: () => import('./messages/uz').then((module) => module.uz),
  ru: () => import('./messages/ru').then((module) => module.ru),
};

export async function getMessages(locale: Locale): Promise<Messages> {
  return (loaders[locale] ?? loaders[DEFAULT_LOCALE])();
}
