'use client';

import { useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SessionBootstrap } from '@/features/auth/SessionBootstrap';
import { makeStore, type AppStore } from '@/store';

/**
 * Redux Provider — Client Component bo'lishi shart, chunki context
 * va state Server Component'da ishlamaydi.
 *
 * Store `useRef` ichida bir marta yaratiladi: har renderda `makeStore()`
 * chaqirilsa, state qayta tug'ilib turadi.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  storeRef.current ??= makeStore();

  return (
    <Provider store={storeRef.current}>
      <SessionBootstrap />
      {children}
    </Provider>
  );
}
