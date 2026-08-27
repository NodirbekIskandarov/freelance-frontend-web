import type { CodeSent, LoginMethods, LoginMethodKind } from '@/shared/types/identities';
import { baseApi } from '@/store/api';

/**
 * Kirish usullari.
 *
 * Hammasi joriy foydalanuvchi ustida ishlaydi — yo'llarda identifikator
 * yo'q. Odam o'zining eshiklarini boshqaradi, birovnikini emas.
 */
export const identitiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLoginMethods: build.query<LoginMethods, void>({
      query: () => ({ url: '/me/login-methods/' }),
      providesTags: ['LoginMethod'],
    }),

    startPhoneLink: build.mutation<CodeSent, { phone: string }>({
      query: (body) => ({ url: '/me/login-methods/phone/', method: 'POST', body }),
    }),

    confirmPhoneLink: build.mutation<LoginMethods, { phone: string; code: string }>({
      query: (body) => ({
        url: '/me/login-methods/phone/confirm/',
        method: 'POST',
        body,
      }),
      // Profil ham o'zgaradi (telefon ko'rsatiladi), shuning uchun `User` ham.
      invalidatesTags: ['LoginMethod', 'User'],
    }),

    startEmailLink: build.mutation<CodeSent, { email: string }>({
      query: (body) => ({ url: '/me/login-methods/email/', method: 'POST', body }),
    }),

    confirmEmailLink: build.mutation<LoginMethods, { email: string; code: string }>({
      query: (body) => ({
        url: '/me/login-methods/email/confirm/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LoginMethod', 'User'],
    }),

    linkGoogle: build.mutation<LoginMethods, { id_token: string }>({
      query: (body) => ({ url: '/me/login-methods/google/', method: 'POST', body }),
      invalidatesTags: ['LoginMethod', 'User'],
    }),

    unlinkMethod: build.mutation<LoginMethods, { kind: LoginMethodKind }>({
      query: (body) => ({ url: '/me/login-methods/unlink/', method: 'POST', body }),
      invalidatesTags: ['LoginMethod', 'User'],
    }),
  }),
});

export const {
  useGetLoginMethodsQuery,
  useStartPhoneLinkMutation,
  useConfirmPhoneLinkMutation,
  useStartEmailLinkMutation,
  useConfirmEmailLinkMutation,
  useLinkGoogleMutation,
  useUnlinkMethodMutation,
} = identitiesApi;
