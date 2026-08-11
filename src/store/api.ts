import { createApi } from '@reduxjs/toolkit/query/react';
import { createAppBaseQuery, createLocalStorageTokenStore } from '@/shared/api';

import { env } from '@/lib/env';

export const tokenStore = createLocalStorageTokenStore('web.auth');

/** Kirishni talab qiladigan bo'limlar — `robots.ts` dagi ro'yxat bilan bir xil. */
const PROTECTED_PREFIXES = ['/student', '/freelancer', '/wallet', '/saved', '/appeals'];

/**
 * Bo'sh `endpoints` — bu ataylab.
 * Har bir domen (mahsulotlar, buyurtmalar, auth...) o'z faylida
 * `baseApi.injectEndpoints()` orqali qo'shiladi. Shunda bitta ulkan
 * api fayli o'smaydi va kod bo'linishi (code splitting) saqlanadi.
 *
 * `tagTypes` — kesh invalidatsiyasi uchun. Yangi resurs qo'shilganda
 * shu ro'yxatga ham qo'shiladi.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: createAppBaseQuery({
    baseUrl: env.apiUrl,
    tokens: tokenStore,
    /*
     * Yo'naltirish faqat himoyalangan sahifada. Ochiq sahifada eskirgan
     * token bilan turgan mehmonni `/login`ga uloqtirish — o'qiyotgan
     * materialidan ayirish demak. Token baribir tozalangan, shuning uchun
     * bu yerda hech narsa qilmaslik xavfsiz.
     */
    onAuthFailure: () => {
      if (typeof window === 'undefined') return;

      const onProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
        window.location.pathname.startsWith(prefix),
      );

      if (onProtectedPage) {
        window.location.href = '/login';
      }
    },
  }),
  tagTypes: ['User', 'University', 'Subject', 'Task', 'FreelanceTask', 'Order'],
  endpoints: () => ({}),
});
