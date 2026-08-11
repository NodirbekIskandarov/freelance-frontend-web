'use client';

import { useEffect } from 'react';

import { clearCurrentUser, selectAuthHydrated, setCurrentUser } from '@/store/slices/authSlice';
import { tokenStore } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useGetMeQuery } from './authApi';

/**
 * Sahifa to'liq qayta yuklanganda seansni tiklaydi.
 *
 * Redux store har yuklashda bo'sh boshlanadi, token esa `localStorage`da
 * qoladi. Bu komponent bo'lmasa foydalanuvchi kirgan bo'lsa ham header
 * "Kirish" tugmasini ko'rsatib turadi — brauzerda aynan shu kuzatilgan.
 *
 * Hech narsa render qilmaydi: faqat store'ni to'ldiradi.
 */
export function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectAuthHydrated);

  // Token yo'q bo'lsa serverga so'rov yubormaymiz — mehmon uchun ortiqcha 401.
  const hasToken = typeof window !== 'undefined' && tokenStore.getAccessToken() !== null;

  const { data, isError } = useGetMeQuery(undefined, { skip: !hasToken || hydrated });

  useEffect(() => {
    if (!hasToken) {
      dispatch(clearCurrentUser());
      return;
    }
    if (data) dispatch(setCurrentUser(data));
    else if (isError) dispatch(clearCurrentUser());
  }, [hasToken, data, isError, dispatch]);

  return null;
}
