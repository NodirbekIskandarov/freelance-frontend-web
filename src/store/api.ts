import { createApi } from '@reduxjs/toolkit/query/react';
import { createAppBaseQuery, createLocalStorageTokenStore } from '@/shared/api';

import { env } from '@/lib/env';

export const tokenStore = createLocalStorageTokenStore('web.auth');

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
    onAuthFailure: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  }),
  tagTypes: ['User', 'Product'],
  endpoints: () => ({}),
});
