import type { ApiPaginated } from '@/shared/types/catalogue';
import type { Review, ReviewWriteRequest } from '@/shared/types/reviews';
import { baseApi } from '@/store/api';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Ochiq ro'yxat — sotib olmagan foydalanuvchi ham ko'radi. */
    getSolutionReviews: build.query<
      ApiPaginated<Review>,
      { solutionId: string; page?: number; page_size?: number; ordering?: string }
    >({
      query: ({ solutionId, ...params }) => ({
        url: `/solutions/${solutionId}/reviews/`,
        params,
      }),
      providesTags: (_result, _error, { solutionId }) => [{ type: 'Review', id: solutionId }],
    }),

    createReview: build.mutation<Review, { solutionId: string } & ReviewWriteRequest>({
      query: ({ solutionId, ...body }) => ({
        url: `/solutions/${solutionId}/review/`,
        method: 'POST',
        body,
      }),
      /*
       * Kutubxona ham yangilanadi: sharh yozilgach yechimning o'rtacha
       * reytingi o'zgaradi va u ro'yxatda ko'rinib turadi.
       */
      invalidatesTags: (_result, _error, { solutionId }) => [
        { type: 'Review', id: solutionId },
        'Library',
      ],
    }),

    updateReview: build.mutation<Review, { id: string; solutionId: string } & ReviewWriteRequest>({
      query: ({ id, solutionId: _solutionId, ...body }) => ({
        url: `/reviews/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { solutionId }) => [
        { type: 'Review', id: solutionId },
        'Library',
      ],
    }),
  }),
});

export const { useGetSolutionReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation } =
  reviewsApi;
