'use client';

import NextLink, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

import { DEFAULT_LOCALE, localeFromPathname, localizeHref } from './config';

/**
 * `next/link` ning til qo'shadigan varianti.
 *
 * Har bir `href` ga qo'lda `/uz` yozish 78 ta joyda takrorlanardi va
 * bittasini unutish sahifani boshqa tilga otib yuborardi. Bu yerda til
 * MANZILDAN o'qiladi, ya'ni komponentga uzatish shart emas va u server
 * komponentlari ichida ham ishlaydi.
 *
 * Tashqi havolalar (`https://…`, `mailto:`, `tel:`) tegilmaydi.
 */
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'href'> &
  Omit<LinkProps, 'href'> & {
    href: string;
    children?: ReactNode;
  };

export const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, ...props }, ref) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? '') ?? DEFAULT_LOCALE;

  return <NextLink ref={ref} href={localizeHref(href, locale)} {...props} />;
});

export default Link;
