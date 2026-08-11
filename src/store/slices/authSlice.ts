import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppUser } from '@/shared/types/auth';

import type { RootState } from '..';

interface AuthState {
  user: AppUser | null;
  /**
   * `localStorage`dan token o'qilib bo'lganini bildiradi.
   * Bu bo'lmasa, sahifa yuklanishida bir lahza "mehmon" holati
   * ko'rsatilib, keyin foydalanuvchiga almashib qoladi (UI sakrashi).
   */
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  hydrated: false,
};

/**
 * Faqat UI holatini saqlaydi — tarmoq so'rovlari bu yerda emas.
 * Login/register/logout mutatsiyalari `features/auth/authApi.ts`da,
 * ular muvaffaqiyatli bo'lgach shu slice'ni yangilaydi. Bitta joy —
 * bitta mas'uliyat: tarmoq va holat aralashmaydi.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<AppUser | null>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    clearCurrentUser(state) {
      state.user = null;
      state.hydrated = true;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null;
export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;
