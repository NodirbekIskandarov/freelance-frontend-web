import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { baseApi } from './api';
import { authReducer } from './slices/authSlice';

/**
 * Store fabrikasi — modul darajasidagi singleton EMAS.
 *
 * Next.js serverda bitta jarayonda ko'p so'rovni qayta ishlaydi. Agar store
 * global bo'lsa, bir foydalanuvchining ma'lumoti ikkinchisiga oqib o'tadi.
 * Shuning uchun har render uchun yangi store yaratiladi.
 */
export function makeStore() {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  // refetchOnFocus / refetchOnReconnect ishlashi uchun kerak.
  setupListeners(store.dispatch);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
