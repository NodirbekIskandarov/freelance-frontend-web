import type { ReactNode } from 'react';

import { SiteLogo } from '@/components/layout/SiteLogo';
import { Link } from '@/i18n/Link';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

/**
 * Auth sahifalari uchun sodda qobiq — sarlavha va footer'siz.
 * Diqqat faqat formada bo'lishi kerak.
 *
 * Tip qo'lda yozilgan: `LayoutProps<T>` bitta aniq yo'lni kutadi, bu
 * layout esa route group ostidagi bir necha yo'lga (/login, /register)
 * xizmat qiladi.
 */
export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = await getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 shrink-0 items-center px-4 sm:px-6">
        <SiteLogo />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">{children}</main>

      <footer className="shrink-0 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        <Link href="/legal" className="transition-colors hover:text-foreground">
          {m.auth.termsLink}
        </Link>
      </footer>
    </div>
  );
}
