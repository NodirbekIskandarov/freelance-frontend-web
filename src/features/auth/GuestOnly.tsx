'use client';

import { useEffect, type ReactNode } from 'react';

import { useLocaleRouter } from '@/i18n/useLocaleRouter';
import { useT } from '@/i18n/useT';
import { useAppSelector } from '@/store/hooks';
import { selectAuthHydrated, selectIsAuthenticated } from '@/store/slices/authSlice';

/**
 * Faqat MEHMON uchun sahifalar — kirish va ro'yxatdan o'tish.
 *
 * `RequireAuth` ning teskarisi. Ilgari tizimga kirgan odam ham bu
 * sahifalarni ochaverardi: u yerda «Kod yuborish» bosilsa yangi seans
 * boshlanib, ochiq turgan kabinetdagi ishi yo'qolishi mumkin edi. Google
 * tugmasi ham o'sha yerda qayta ishga tushardi.
 *
 * BOSH SAHIFAGA yuboriladi, kabinetga emas: odam bu manzilga ataylab
 * kelgan bo'lishi shart emas — eski xatcho'p yoki tashqi havola ham
 * bo'lishi mumkin, va u yerdan boshlanadigan tabiiy joy bosh sahifa.
 *
 * `hydrated` kutish SHART: aks holda `SessionBootstrap` tokenni
 * tekshirib ulgurmasidan sahifa bir lahza chizilib, keyin uchib ketardi.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { m } = useT();
  const router = useLocaleRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace('/');
  }, [hydrated, isAuthenticated, router]);

  /*
   * Kirgan foydalanuvchiga forma UMUMAN ko'rsatilmaydi — yo'naltirish
   * bir kadr ketsa ham, o'sha kadrda «Kirish» formasi ko'rinib qolishi
   * odamni tizimdan chiqib ketganman deb o'ylashga majbur qilardi.
   */
  if (!hydrated || isAuthenticated) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        {hydrated ? m.auth.alreadySignedIn : m.common.loading}
      </p>
    );
  }

  return children;
}
