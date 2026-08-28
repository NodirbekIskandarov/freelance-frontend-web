import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, isLocale } from '@/i18n/config';

/**
 * Har bir manzilda til bo'lagi bo'lishini ta'minlaydi.
 *
 * `/materials` → `/uz/materials`. Tilsiz manzil qoldirilsa bir sahifa
 * ikki xil manzilda ochilardi: qidiruv tizimlari uchun takror, havolani
 * yuborgan odam uchun esa qaysi tilda ochilishi noma'lum.
 *
 * Til qayerdan olinadi (tartib bilan):
 *   1. Cookie — odam sayt ichida tanlagan til, eng ishonchli manba.
 *   2. `Accept-Language` — brauzer sozlamasi, birinchi tashrif uchun.
 *   3. `uz` — sayt asosan shu tilda.
 */
function detectLocale(request: NextRequest): string {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const header = request.headers.get('accept-language') ?? '';
  // `ru-RU,ru;q=0.9,en;q=0.8` → ['ru-ru', 'ru', 'en'] tartibda tekshiramiz.
  for (const part of header.split(',')) {
    const tag = part.split(';')[0]?.trim().toLowerCase() ?? '';
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  /*
   * 307, doimiy 308 emas: aniqlash cookie'ga bog'liq va brauzer doimiy
   * yo'naltirishni keshlab qo'ysa, til almashtirilganda ham eskisiga
   * qaytaraverardi.
   */
  return NextResponse.redirect(url, 307);
}

export const config = {
  /*
   * Statik fayllar, API yo'llari va Next'ning ichki manzillari
   * chetlab o'tiladi — ularga til bo'lagi qo'shish faqat 404 berardi.
   */
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
