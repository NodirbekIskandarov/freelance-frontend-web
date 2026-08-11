import type { AppUser, AuthResponse, LoginRequest, RegisterRequest } from '@/shared/types/auth';
import { baseApi, tokenStore } from '@/store/api';
import { setCurrentUser } from '@/store/slices/authSlice';

/**
 * Muvaffaqiyatli auth'dan keyingi umumiy ish: tokenlarni saqlash va
 * store'ni yangilash. Login va register uchun bir xil.
 *
 * `queryFulfilled` xato bo'lganda REJECT bo'ladi — uni ushlamasak,
 * brauzerda ushlanmagan promise xatosi chiqadi (401 da aynan shu
 * kuzatildi). Xatoni komponent `error` orqali ko'rsatadi, shuning
 * uchun bu yerda jim yutamiz.
 */
async function persistSession(
  queryFulfilled: Promise<{ data: AuthResponse }>,
  dispatch: (action: ReturnType<typeof setCurrentUser>) => void,
): Promise<void> {
  try {
    const { data } = await queryFulfilled;
    tokenStore.setTokens(data);
    dispatch(setCurrentUser(data.user));
  } catch {
    // Xato UI'da `error` orqali ko'rsatiladi.
  }
}

/**
 * Auth mutatsiyalari — bu yerda RTK Query o'z o'rnida: sahifa
 * interaktiv, natija indekslanmaydi, kesh va loading holati kerak.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        persistSession(queryFulfilled, dispatch),
    }),

    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        persistSession(queryFulfilled, dispatch),
    }),

    /** Sahifa yangilanganda seansni tiklaydi. */
    getMe: build.query<AppUser, void>({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
