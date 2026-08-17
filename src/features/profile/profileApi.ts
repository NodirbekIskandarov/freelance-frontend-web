import type { AppUser, UserProfile } from '@/shared/types/auth';
import { baseApi } from '@/store/api';
import { setCurrentUser } from '@/store/slices/authSlice';

/**
 * Profil — HAQIQIY backend (`/api/v1/profile/`).
 *
 * `GET /profile/` joriy foydalanuvchini to'liq qaytaradi (login javobi
 * bilan bir xil `CurrentUser`), shuning uchun seansni tiklashda
 * `localStorage` dagi nusxaga tayanish shart emas: token bor bo'lsa
 * haqiqiy holat serverdan olinadi.
 */

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  birth_date?: string | null;
  gender?: string;
  bio?: string;
  telegram?: string;
  course?: number | null;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<AppUser, void>({
      query: () => ({ url: '/profile/' }),
      providesTags: ['User'],
      /*
       * Store bilan sinxron: header, kabinet menyusi va rol tekshiruvi
       * `auth` slice'idan o'qiydi. Bu bo'lmasa profil yangilangach
       * ekranning bir qismi eski ma'lumot bilan qolib ketardi.
       */
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch {
          // Xato `baseQuery` darajasida hal qilinadi (401 → seans tozalanadi).
        }
      },
    }),

    updateProfile: build.mutation<AppUser, ProfileUpdateRequest>({
      query: (body) => ({ url: '/profile/', method: 'PATCH', body }),
      invalidatesTags: ['User'],
    }),

    /**
     * Avatar `multipart/form-data` bilan yuboriladi.
     *
     * `FormData` ATAYLAB qo'lda quriladi va `Content-Type` sarlavhasi
     * BERILMAYDI: brauzer uni `boundary` bilan birga o'zi qo'yadi.
     * Qo'lda yozilsa `boundary` tushib qoladi va server tanani
     * o'qiy olmaydi.
     */
    uploadAvatar: build.mutation<UserProfile, File>({
      query: (file) => {
        const body = new FormData();
        body.append('avatar', file);
        return { url: '/profile/avatar/', method: 'POST', body };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } = profileApi;
