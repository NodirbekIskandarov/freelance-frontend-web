import type { ApiPaginated } from '@/shared/types/catalogue';
import type { LibraryItem, LibraryItemDetail } from '@/shared/types/library';
import { baseApi } from '@/store/api';

/**
 * Kutubxona — HAQIQIY backend (`/api/v1/me/library/`), mock emas.
 *
 * Fayl havolasi faqat tafsilot so'rovida keladi, shuning uchun
 * "yuklab olish" bosilganda alohida so'rov ketadi.
 */
export const libraryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLibrary: build.query<
      ApiPaginated<LibraryItem>,
      { page?: number; page_size?: number; ordering?: string; search?: string }
    >({
      query: (params) => ({ url: '/me/library/', params }),
      providesTags: ['Library'],
    }),

    getLibraryItem: build.query<LibraryItemDetail, string>({
      query: (solutionId) => ({ url: `/me/library/${solutionId}/` }),
      providesTags: (_result, _error, id) => [{ type: 'Library', id }],
    }),
  }),
});

export const { useGetLibraryQuery, useLazyGetLibraryItemQuery } = libraryApi;
