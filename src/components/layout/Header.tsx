'use client';

import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { PUBLIC_NAV_ITEMS, type PublicNavItem } from '@/config/nav';
import { useI18n } from '@/i18n/I18nProvider';
import { Link } from '@/i18n/Link';
import { localizeHref, stripLocale, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages/uz';
import { cn } from '@/lib/cn';
import { selectAuthHydrated, selectCurrentUser } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';

import { HeaderUserMenu } from './HeaderUserMenu';
import { SiteLogo } from './SiteLogo';
import { NotificationBell } from '@/features/notifications/NotificationBell';

import { LocaleToggle } from './LocaleToggle';
import { ThemeToggle } from './ThemeToggle';

function isNavItemActive(item: PublicNavItem, pathname: string): boolean {
  // Manzilda til bo'lagi bor (`/uz/materials`), menyudagi yo'l esa
  // tilsiz — solishtirishdan oldin bo'lakni olib tashlaymiz.
  const path = stripLocale(pathname);

  if (item.href === '/') return path === '/';
  if (item.href.startsWith('/#')) return false;
  return path === item.href || path.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  active,
  mobile,
  onNavigate,
  messages,
  locale,
}: {
  item: PublicNavItem;
  active: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  messages: Messages;
  locale: Locale;
}) {
  const label = item.label(messages);

  if (item.comingSoon) {
    return (
      <span
        className={cn(
          'inline-flex cursor-not-allowed items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground/50',
          mobile && 'w-full px-3 py-2.5',
        )}
        title={messages.common.comingSoon}
      >
        {label}
      </span>
    );
  }

  const className = cn(
    'inline-flex items-center rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
    active
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : 'text-muted-foreground hover:text-foreground',
    mobile && 'w-full px-3 py-2.5',
  );

  /*
   * Langar havolasi (`/#xizmatlar`) oddiy `<a>` bo'lib qoladi: `next/link`
   * bilan sahifa ichidagi langarga o'tish ishlamasdi.
   */
  if (item.href.startsWith('/#')) {
    return (
      <a href={localizeHref(item.href, locale)} onClick={onNavigate} className={className}>
        {label}
      </a>
    );
  }

  /*
   * Qolgan yo'llar — `next/link`.
   *
   * Ilgari bular ham `<a>` edi va har menyu bosilishi BUTUN ilovani
   * qaytadan yuklardi: Redux do'koni qayta tug'ilib, `SessionBootstrap`
   * yana `GET /profile/` yuborardi, qo'ng'iroq esa yana xabar sanog'ini
   * va WebSocket chiptasini so'rardi. To'rtta menyu bosilishida
   * o'lchangan: 5 ta `/profile/`, 5 ta `summary/`, 12 ta `ws-ticket/`.
   */
  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { locale, messages } = useI18n();
  const user = useAppSelector(selectCurrentUser);
  /*
   * Token `localStorage` dan O'QILGUNCHA hech kim ko'rsatilmaydi.
   *
   * Ilgari bu tekshiruv yo'q edi va kirgan odam har sahifa yuklanishida
   * bir lahza «Kirish / Ro'yxatdan o'tish» ni ko'rardi — tizimdan
   * chiqarib yuborilgandek. `hydrated` bayrog'i aynan shuning uchun
   * qo'shilgan edi, lekin sarlavha undan foydalanmasdi.
   */
  const hydrated = useAppSelector(selectAuthHydrated);
  const [open, setOpen] = useState(false);

  /*
   * Boshqa sahifaga o'tilganda menyu yopiladi — effektda emas, RENDER
   * paytida.
   *
   * Effekt bilan yopilsa yangi sahifa avval ochiq menyu bilan chizilib,
   * keyin qayta chizilardi: bir kadr davomida menyu ko'rinib turardi.
   * React bu naqshni ataylab qo'llab-quvvatlaydi — holat o'zgarishi
   * ekranga chiqishdan oldin qayta render bilan yutiladi.
   */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
        <SiteLogo className="shrink-0" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex [&::-webkit-scrollbar]:hidden"
          aria-label={messages.nav.mainMenu}
        >
          {PUBLIC_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isNavItemActive(item, pathname)}
              messages={messages}
              locale={locale}
            />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {/* Til va tema yonma-yon: ikkalasi ham ko'rinish sozlamasi. */}
          <LocaleToggle compact />
          <ThemeToggle compact />
          {!hydrated ? (
            /* Kim ekani hali noma'lum. Bo'sh joy emas, XUDDI SHU
               o'lchamdagi joy: aks holda tugmalar paydo bo'lganda
               sarlavha silkinib ketardi. */
            <span aria-hidden className="h-10 w-[13.5rem] rounded-lg bg-muted/50" />
          ) : user ? (
            <>
              <NotificationBell />
              <HeaderUserMenu user={user} />
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="outline">
                {messages.header.login}
              </ButtonLink>
              <ButtonLink href="/register" variant="emerald">
                {messages.header.register}
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <LocaleToggle compact />
          <ThemeToggle compact />
          <button
            type="button"
            aria-label={messages.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-border/60 md:hidden', open ? 'block' : 'hidden')}>
        <div className="mx-auto max-w-[90rem] px-4 pt-2 pb-5 sm:px-6">
          <div className="grid gap-0.5 rounded-2xl border border-border bg-card p-2 dark:border-white/10 dark:bg-zinc-900">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isNavItemActive(item, pathname)}
                mobile
                onNavigate={() => setOpen(false)}
                messages={messages}
                locale={locale}
              />
            ))}

            <div className="my-2 h-px bg-border dark:bg-white/10" />

            <div className="flex flex-col gap-2 p-1">
              {!hydrated ? (
                <span aria-hidden className="h-11 rounded-lg bg-muted/50" />
              ) : user ? (
                <HeaderUserMenu user={user} mobile />
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    {messages.header.login}
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    variant="emerald"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    {messages.header.register}
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
