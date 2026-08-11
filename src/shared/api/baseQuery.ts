import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

import type { AuthTokens } from '../types/api';
import type { TokenStore } from './tokenStore';

export type AppBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
>;

export interface CreateBaseQueryOptions {
  /** Masalan: `https://api.example.com/v1` */
  baseUrl: string;
  tokens: TokenStore;
  /** `baseUrl`ga nisbatan refresh endpoint yo'li. */
  refreshPath?: string;
  /** Refresh ham ishlamaganda chaqiriladi — odatda logout + login sahifasiga yo'naltirish. */
  onAuthFailure?: () => void;
}

/** Refresh javobi kutilgan shaklga mos kelishini tekshiradi. */
function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.accessToken === 'string' && typeof candidate.refreshToken === 'string';
}

/**
 * Token qo'shadigan va 401 da bir marta refresh qilib so'rovni qaytadan
 * yuboradigan base query.
 *
 * Bir vaqtda bir nechta so'rov 401 olsa, refresh faqat bir marta ketadi —
 * qolganlari o'sha promise'ni kutadi (single-flight). Aks holda har bir
 * so'rov alohida refresh yuborib, refresh token'ni bekor qilib qo'yishi mumkin.
 */
/**
 * 401 javobi "seans tugadi" degani BO'LMAGAN yo'llar.
 * Bu ro'yxatdagi so'rovlar refresh/redirect oqimiga tushmaydi.
 */
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'] as const;

export function createAppBaseQuery({
  baseUrl,
  tokens,
  refreshPath = '/auth/refresh',
  onAuthFailure,
}: CreateBaseQueryOptions): AppBaseQuery {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const accessToken = tokens.getAccessToken();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  let refreshInFlight: Promise<boolean> | null = null;

  const runRefresh = async (
    api: Parameters<AppBaseQuery>[1],
    extraOptions: Parameters<AppBaseQuery>[2],
  ): Promise<boolean> => {
    const refreshToken = tokens.getRefreshToken();
    if (!refreshToken) return false;

    const result = await rawBaseQuery(
      { url: refreshPath, method: 'POST', body: { refreshToken } },
      api,
      extraOptions,
    );

    if (result.error || !isAuthTokens(result.data)) {
      return false;
    }

    tokens.setTokens(result.data);
    return true;
  };

  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    const requestUrl = typeof args === 'string' ? args : args.url;
    const isUnauthorized = result.error?.status === 401;

    /*
     * Auth endpoint'laridan kelgan 401 — bu "seans tugadi" emas, "login
     * yoki parol xato". Ularni refresh + redirect oqimidan chetlab
     * o'tkazish SHART: aks holda noto'g'ri parol kiritilganda
     * `onAuthFailure` sahifani qayta yuklaydi va foydalanuvchi endigina
     * to'ldirgan forma tozalanib ketadi. Brauzerda aynan shu kuzatilgan.
     */
    const isAuthRequest = AUTH_PATHS.some((authPath) => requestUrl.startsWith(authPath));

    if (!isUnauthorized || isAuthRequest) {
      return result;
    }

    // Refresh allaqachon ketayotgan bo'lsa — yangisini boshlamay, o'shani kutamiz.
    refreshInFlight ??= runRefresh(api, extraOptions).finally(() => {
      refreshInFlight = null;
    });

    const refreshed = await refreshInFlight;

    if (!refreshed) {
      tokens.clear();
      onAuthFailure?.();
      return result;
    }

    result = await rawBaseQuery(args, api, extraOptions);
    return result;
  };
}
