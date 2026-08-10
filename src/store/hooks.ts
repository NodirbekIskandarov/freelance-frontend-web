import { useDispatch, useSelector, useStore } from 'react-redux';

import type { AppDispatch, AppStore, RootState } from './index';

/**
 * Tiplangan hook'lar. Komponentlarda `useDispatch` o'rniga shular
 * ishlatiladi — aks holda har joyda qo'lda tip yozish kerak bo'ladi.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
