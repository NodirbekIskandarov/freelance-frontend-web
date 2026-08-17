'use client';

import { useEffect } from 'react';

import { useGetProfileQuery } from '@/features/profile/profileApi';
import { tokenStore } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { clearCurrentUser } from '@/store/slices/authSlice';

/**
 * Sahifa to'liq qayta yuklanganda seansni tiklaydi.
 *
 * Redux store har yuklashda bo'sh boshlanadi, token esa `localStorage`da
 * qoladi. Bu komponent bo'lmasa foydalanuvchi kirgan bo'lsa ham header
 * "Kirish" tugmasini ko'rsatib turadi — brauzerda aynan shu kuzatilgan.
 *
 * Foydalanuvchi `GET /profile/` dan olinadi, saqlangan nusxadan emas:
 * profil boshqa qurilmada o'zgargan bo'lishi mumkin, token yaroqsiz
 * bo'lsa esa so'rov 401 beradi va `baseQuery` seansni o'zi tozalaydi.
 * `getProfile` store'ni ham to'ldiradi (`profileApi` ga qarang).
 *
 * Hech narsa render qilmaydi.
 */
export function SessionBootstrap() {
  const dispatch = useAppDispatch();

  // Token yo'q bo'lsa serverga so'rov yubormaymiz — mehmon uchun ortiqcha 401.
  const hasToken = typeof window !== 'undefined' && tokenStore.getAccessToken() !== null;

  useGetProfileQuery(undefined, { skip: !hasToken });

  useEffect(() => {
    if (!hasToken) dispatch(clearCurrentUser());
  }, [hasToken, dispatch]);

  return null;
}
