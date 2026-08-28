'use client';

import { LayoutDashboard, LogOut } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useState } from 'react';

import { clearSession, useLogoutMutation } from '@/features/auth/authApi';
import { cabinetPathFor } from '@/features/auth/cabinetPath';
import { cn } from '@/lib/cn';
import { displayName, type AppUser } from '@/shared/types/auth';
import { baseApi, tokenStore } from '@/store/api';
import { clearCurrentUser } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { useLocaleRouter } from '@/i18n/useLocaleRouter';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function HeaderUserMenu({ user, mobile = false }: { user: AppUser; mobile?: boolean }) {
  const dispatch = useAppDispatch();
  const router = useLocaleRouter();
  const [open, setOpen] = useState(false);
  const [logout] = useLogoutMutation();

  const name = displayName(user);

  function handleLogout() {
    /*
     * Server refresh token'ni qora ro'yxatga qo'shadi. Javobini
     * KUTMAYMIZ: chiqish lokal holatga bog'liq bo'lishi kerak — tarmoq
     * uzilgan bo'lsa ham foydalanuvchi chiqa olishi shart.
     */
    const refresh = tokenStore.getRefreshToken();
    if (refresh) void logout({ refresh });

    // Uchala qadam ham zarur: token saqlanib qolsa `SessionBootstrap`
    // keyingi yuklashda foydalanuvchini qaytarib qo'yadi; RTK Query keshi
    // tozalanmasa esa oldingi foydalanuvchi ma'lumoti ekranda qoladi.
    clearSession();
    dispatch(clearCurrentUser());
    dispatch(baseApi.util.resetApiState());

    setOpen(false);
    router.push('/');
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href={cabinetPathFor(user)}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <LayoutDashboard className="size-4" />
          Kabinet
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Chiqish
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:bg-muted"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          {initialsOf(name)}
        </span>
        <span className="max-w-[120px] truncate text-sm font-medium text-foreground">
          {name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg',
            )}
          >
            <Link
              href={cabinetPathFor(user)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <LayoutDashboard className="size-4" />
              Kabinet
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
              Chiqish
            </button>
          </div>
        </>
      )}
    </div>
  );
}
