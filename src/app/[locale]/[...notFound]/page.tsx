import { notFound } from 'next/navigation';

/**
 * Mos kelmagan manzillarni 404 ga yo'naltiradi.
 *
 * Next mos kelmagan URL uchun FAQAT ildizdagi `app/not-found.tsx` ni
 * ishlatadi — bizda esa ildiz `[locale]` ostida va u yerda qobiq
 * (til, tema, do'kon) bor. Shu sababli hamma narsani ushlaydigan
 * marshrut qo'yiladi: u `notFound()` chaqiradi va shu bilan
 * `[locale]/not-found.tsx` to'liq qobiq ichida chiziladi.
 *
 * Aniqroq marshrutlar birinchi tekshiriladi, ya'ni bu sahifa faqat
 * boshqa hech biri mos kelmaganda ishga tushadi.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
