'use client';

import { usePathname, useRouter } from 'next/navigation';

import { DEFAULT_LOCALE, localeFromPathname, localizeHref } from './config';

/**
 * `useRouter` ning til qo'shadigan varianti.
 *
 * `router.push('/login')` tilsiz manzilga o'tardi, middleware esa uni
 * cookie bo'yicha yo'naltirardi — natijada rus sahifasidan kirgan odam
 * o'zbekcha sahifada paydo bo'lishi mumkin edi (yoki teskarisi), va
 * yo'lda bitta ortiqcha yo'naltirish bo'lardi.
 */
export function useLocaleRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? '') ?? DEFAULT_LOCALE;

  return {
    locale,
    push: (href: string) => router.push(localizeHref(href, locale)),
    replace: (href: string) => router.replace(localizeHref(href, locale)),
    back: () => router.back(),
    refresh: () => router.refresh(),
  };
}
