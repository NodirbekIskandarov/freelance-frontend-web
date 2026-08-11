'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SessionBootstrap } from '@/features/auth/SessionBootstrap';
import { makeStore, type AppStore } from '@/store';

/**
 * Shart shu modulning o'zida hisoblanadi: `process.env.NODE_ENV` build
 * paytida literal qiymatga almashadi, shunda production'da bu `false`
 * bo'lib qoladi va quyidagi dinamik import erishib bo'lmas shoxga tushadi —
 * MSW production bundle'iga umuman kirmaydi.
 */
const USE_MOCKS =
  process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

/**
 * Mock worker tayyor bo'lgunicha kutadi.
 *
 * Kutish shart: worker ishga tushmasidan yuborilgan so'rov ushlanmay,
 * mavjud bo'lmagan backendga ketadi va xato bilan qaytadi.
 */
function MockGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!USE_MOCKS);

  useEffect(() => {
    if (!USE_MOCKS) return;

    let cancelled = false;

    void import('@/mocks/browser')
      .then(({ enableMocking }) => enableMocking())
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  return children;
}

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
      <MockGate>
        <SessionBootstrap />
        {children}
      </MockGate>
    </Provider>
  );
}
