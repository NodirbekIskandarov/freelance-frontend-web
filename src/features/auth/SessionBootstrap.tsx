'use client';

import { useEffect } from 'react';

import { tokenStore } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { clearCurrentUser, setCurrentUser } from '@/store/slices/authSlice';

import { readStoredUser } from './authApi';

/**
 * Sahifa to'liq qayta yuklanganda seansni tiklaydi.
 *
 * Redux store har yuklashda bo'sh boshlanadi, token esa `localStorage`da
 * qoladi. Bu komponent bo'lmasa foydalanuvchi kirgan bo'lsa ham header
 * "Kirish" tugmasini ko'rsatib turadi — brauzerda aynan shu kuzatilgan.
 *
 * Backendda "joriy foydalanuvchi" endpoint'i yo'q, shuning uchun
 * foydalanuvchi login javobidan saqlangan nusxadan tiklanadi. Token
 * yaroqsiz bo'lsa birinchi himoyalangan so'rov 401 beradi va
 * `baseQuery` seansni tozalaydi — ya'ni bu nusxa ruxsat bermaydi,
 * faqat ekranni to'ldiradi.
 *
 * Hech narsa render qilmaydi.
 */
export function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hasToken = tokenStore.getAccessToken() !== null;
    const user = hasToken ? readStoredUser() : null;

    if (user) dispatch(setCurrentUser(user));
    else dispatch(clearCurrentUser());
  }, [dispatch]);

  return null;
}
