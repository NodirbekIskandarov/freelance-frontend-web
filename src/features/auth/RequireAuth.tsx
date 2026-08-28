'use client';

import { useEffect, type ReactNode } from 'react';

import { selectAuthHydrated, selectIsAuthenticated } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';
import { useLocaleRouter } from '@/i18n/useLocaleRouter';
import { useT } from '@/i18n/useT';

/**
 * Kirishni talab qiladigan sahifalarni o'raydi.
 *
 * Buning o'rniga 401 javobiga tayanish mumkin edi, lekin u
 * `window.location`ni almashtiradi — butun ilova qaytadan yuklanadi va
 * ekran bir lahza oq bo'lib qoladi. Bu yerda esa oddiy klient
 * navigatsiyasi.
 *
 * `hydrated` kutish SHART: aks holda `SessionBootstrap` tokenni tekshirib
 * ulgurmasidan kirgan foydalanuvchi ham login sahifasiga uchib ketardi.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { m } = useT();
  const router = useLocaleRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        {hydrated ? m.ui.redirectingToLogin : 'Yuklanmoqda...'}
      </p>
    );
  }

  return children;
}
