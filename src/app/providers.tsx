'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SessionBootstrap } from '@/features/auth/SessionBootstrap';
import { makeStore, type AppStore } from '@/store';

/**
 * Redux Provider — Client Component bo'lishi shart, chunki context
 * va state Server Component'da ishlamaydi.
 *
 * Store bir marta yaratiladi: har renderda `makeStore()` chaqirilsa,
 * state qayta tug'ilib turardi.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  /*
   * Lazy `useState`, `useRef` emas.
   *
   * `ref.current ??= makeStore()` render paytida ref'ga yozadi — React buni
   * taqiqlaydi, chunki qat'iy rejimda render ikki marta bajariladi va
   * do'kon ikki marta yaratilib, biri tashlab yuborilardi. Lazy
   * initializer esa komponent nusxasiga bir marta chaqiriladi.
   */
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      <SessionBootstrap />
      {children}
    </Provider>
  );
}
