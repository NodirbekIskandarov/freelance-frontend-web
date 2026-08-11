'use client';

import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { PUBLIC_NAV_ITEMS, type PublicNavItem } from '@/config/nav';
import { cn } from '@/lib/cn';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';

import { HeaderUserMenu } from './HeaderUserMenu';
import { SiteLogo } from './SiteLogo';
import { ThemeToggle } from './ThemeToggle';

function isNavItemActive(item: PublicNavItem, pathname: string): boolean {
  if (item.href === '/') return pathname === '/';
  if (item.href.startsWith('/#')) return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  active,
  mobile,
  onNavigate,
}: {
  item: PublicNavItem;
  active: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  if (item.comingSoon) {
    return (
      <span
        className={cn(
          'inline-flex cursor-not-allowed items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground/50',
          mobile && 'w-full px-3 py-2.5',
        )}
        title="Tez orada"
      >
        {item.label}
      </span>
    );
  }

  return (
    <a
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'text-muted-foreground hover:text-foreground',
        mobile && 'w-full px-3 py-2.5',
      )}
    >
      {item.label}
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
        <SiteLogo className="shrink-0" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex [&::-webkit-scrollbar]:hidden"
          aria-label="Asosiy menyu"
        >
          {PUBLIC_NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} active={isNavItemActive(item, pathname)} />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ThemeToggle compact />
          {user ? (
            <HeaderUserMenu user={user} />
          ) : (
            <>
              <ButtonLink href="/login" variant="outline">
                Kirish
              </ButtonLink>
              <ButtonLink href="/register" variant="emerald">
                Ro&apos;yxatdan o&apos;tish
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <button
            type="button"
            aria-label="Menyu"
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
          <div className="grid gap-0.5 rounded-2xl border border-border bg-card p-2 shadow-lg dark:border-white/10 dark:bg-zinc-900">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={isNavItemActive(item, pathname)}
                mobile
                onNavigate={() => setOpen(false)}
              />
            ))}

            <div className="my-2 h-px bg-border dark:bg-white/10" />

            <div className="flex flex-col gap-2 p-1">
              {user ? (
                <HeaderUserMenu user={user} mobile />
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    Kirish
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    variant="emerald"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    Ro&apos;yxatdan o&apos;tish
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
