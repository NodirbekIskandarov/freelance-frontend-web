import {
  toAuthTokens,
  type AppUser,
  type AuthResponse,
  type ChangePasswordRequest,
  type ForgotPasswordConfirmRequest,
  type LoginRequest,
  type PhoneCodeRequest,
  type PhoneVerifyRequest,
  type RegisterRequest,
} from '@/shared/types/auth';
import { baseApi, tokenStore } from '@/store/api';
import { setCurrentUser } from '@/store/slices/authSlice';

/**
 * Auth — HAQIQIY backend (`/api/v1/auth/...`), mock emas.
 *
 * Yo'llar oxirida slash bor: Django `APPEND_SLASH` slashsiz manzilni 301
 * bilan qaytaradi va POST tanasi yo'lda yo'qoladi.
 */

const CURRENT_USER_KEY = 'web.auth.user';

/**
 * Backendda "joriy foydalanuvchi" endpoint'i yo'q (`/api/v1/me/` faqat
 * kutubxona uchun). Shu sababli login javobidagi foydalanuvchi saqlanadi
 * va sahifa yangilanganda shundan tiklanadi. Bu yozuv RUXSAT MANBAI EMAS
 * — token yaroqsiz bo'lsa `baseQuery` baribir seansni tozalaydi.
 */
export function readStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AppUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // Storage yopiq bo'lsa jim o'tamiz — seans baribir token bilan ishlaydi.
  }
}

export function clearSession(): void {
  tokenStore.clear();
  storeUser(null);
}

/**
 * Muvaffaqiyatli auth'dan keyingi umumiy ish: token va foydalanuvchini
 * saqlash, store'ni yangilash. Login, register va telefon orqali kirish
 * uchun bir xil.
 *
 * `queryFulfilled` xato bo'lganda REJECT bo'ladi — uni ushlamasak,
 * brauzerda ushlanmagan promise xatosi chiqadi. Xatoni komponent `error`
 * orqali ko'rsatadi, shuning uchun bu yerda jim yutamiz.
 */
async function persistSession(
  queryFulfilled: Promise<{ data: AuthResponse }>,
  dispatch: (action: ReturnType<typeof setCurrentUser>) => void,
): Promise<void> {
  try {
    const { data } = await queryFulfilled;
    tokenStore.setTokens(toAuthTokens(data.tokens));
    storeUser(data.user);
    dispatch(setCurrentUser(data.user));
  } catch {
    // Xato UI'da `error` orqali ko'rsatiladi.
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login/', method: 'POST', body }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        persistSession(queryFulfilled, dispatch),
    }),

    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register/', method: 'POST', body }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        persistSession(queryFulfilled, dispatch),
    }),

    /** SMS kodi yuboriladi — kod bilan kirish va ro'yxatdan o'tish uchun. */
    sendPhoneCode: build.mutation<void, PhoneCodeRequest>({
      query: (body) => ({ url: '/auth/phone/send-code/', method: 'POST', body }),
    }),

    /** Kod tasdiqlanadi va seans ochiladi (yoki yangi akkaunt yaratiladi). */
    verifyPhoneCode: build.mutation<AuthResponse, PhoneVerifyRequest>({
      query: (body) => ({ url: '/auth/phone/verify/', method: 'POST', body }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        persistSession(queryFulfilled, dispatch),
    }),

    changePassword: build.mutation<void, ChangePasswordRequest>({
      query: (body) => ({ url: '/auth/change-password/', method: 'POST', body }),
    }),

    forgotPassword: build.mutation<void, PhoneCodeRequest>({
      query: (body) => ({ url: '/auth/forgot-password/', method: 'POST', body }),
    }),

    confirmForgotPassword: build.mutation<void, ForgotPasswordConfirmRequest>({
      query: (body) => ({ url: '/auth/forgot-password/confirm/', method: 'POST', body }),
    }),

    /** Backend refresh token'ni qora ro'yxatga qo'shadi — 205 qaytaradi. */
    logout: build.mutation<void, { refresh: string }>({
      query: (body) => ({ url: '/auth/logout/', method: 'POST', body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useConfirmForgotPasswordMutation,
  useLogoutMutation,
} = authApi;
