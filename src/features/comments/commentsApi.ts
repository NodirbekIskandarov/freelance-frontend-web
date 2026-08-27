import type { ApiPaginated, AssignmentComment } from '@/shared/types/catalogue';
import { baseApi } from '@/store/api';

/**
 * Topshiriq izohlari.
 *
 * O'qish ochiq — mavzu katalog sahifasining bir qismi va kirmagan tashrif
 * buyuruvchi ham nima yozilganini ko'rishi kerak. Yozish va o'chirish
 * hisob talab qiladi.
 */
export const commentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssignmentComments: build.query<
      ApiPaginated<AssignmentComment>,
      { assignmentId: string; page?: number; page_size?: number }
    >({
      query: ({ assignmentId, ...params }) => ({
        url: `/assignments/${assignmentId}/comments/`,
        params,
      }),
      providesTags: (_result, _error, { assignmentId }) => [{ type: 'Comment', id: assignmentId }],
    }),

    postAssignmentComment: build.mutation<
      AssignmentComment,
      { assignmentId: string; body: string }
    >({
      query: ({ assignmentId, body }) => ({
        url: `/assignments/${assignmentId}/comments/`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (_result, _error, { assignmentId }) => [
        { type: 'Comment', id: assignmentId },
      ],
    }),

    /**
     * `assignmentId` javobda kerak emas, lekin keshni bekor qilish uchun
     * kerak: o'chirish javobi bo'sh (204) va qaysi mavzu eskirganini
     * boshqa yo'l bilan bilib bo'lmaydi.
     */
    deleteAssignmentComment: build.mutation<void, { id: string; assignmentId: string }>({
      query: ({ id }) => ({ url: `/comments/${id}/`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { assignmentId }) => [
        { type: 'Comment', id: assignmentId },
      ],
    }),
  }),
});

export const {
  useGetAssignmentCommentsQuery,
  usePostAssignmentCommentMutation,
  useDeleteAssignmentCommentMutation,
} = commentsApi;
