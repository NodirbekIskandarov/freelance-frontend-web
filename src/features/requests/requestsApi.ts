import type { ApiPaginated } from '@/shared/types/catalogue';
import type {
  MyAssignmentRequest,
  MyRequestsQuery,
  MySolutionRequest,
  MySubjectRequest,
  MyUniversityRequest,
  UniversityRequestInput,
} from '@/shared/types/myRequests';
import { baseApi } from '@/store/api';

/**
 * Foydalanuvchi yuboradigan arizalar: katalogda yo'q institut, fan yoki
 * topshiriqni qo'shishni so'rash — hamda ularning holatini kuzatish.
 *
 * Yuborish `POST /…-requests/` orqali, ko'rish esa `/me/requests/…`
 * orqali. Ariza yuborilgach o'z ro'yxati eskiradi, shuning uchun
 * `invalidatesTags` mos turdagi ro'yxatni nishonga oladi.
 */

export interface SubjectRequestInput {
  university: string;
  name: string;
  course?: number;
}

export interface AssignmentRequestInput {
  subject: string;
  title: string;
  description?: string;
  variant_count?: number;
}

export interface RequestResult {
  id: string;
  status: string;
  created_at: string;
}

/** `POST /variants/{id}/request/` javobi. */
export interface VariantRequestResult {
  id: string;
  variant: string;
  user: string;
  /** Variantga qancha talab borligi — yuklovchilarga ko'rinadi. */
  request_count: number;
  created_at: string;
}

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitUniversityRequest: build.mutation<RequestResult, UniversityRequestInput>({
      query: (body) => ({ url: '/university-requests/', method: 'POST', body }),
      invalidatesTags: [{ type: 'MyRequest', id: 'UNIVERSITY' }],
    }),

    submitSubjectRequest: build.mutation<RequestResult, SubjectRequestInput>({
      query: (body) => ({ url: '/subject-requests/', method: 'POST', body }),
      invalidatesTags: [{ type: 'MyRequest', id: 'SUBJECT' }],
    }),

    submitAssignmentRequest: build.mutation<RequestResult, AssignmentRequestInput>({
      query: (body) => ({ url: '/assignment-requests/', method: 'POST', body }),
      invalidatesTags: [{ type: 'MyRequest', id: 'ASSIGNMENT' }],
    }),

    getMyUniversityRequests: build.query<ApiPaginated<MyUniversityRequest>, MyRequestsQuery>({
      query: (params) => ({ url: '/me/requests/universities/', params }),
      providesTags: [{ type: 'MyRequest', id: 'UNIVERSITY' }],
    }),

    getMySubjectRequests: build.query<ApiPaginated<MySubjectRequest>, MyRequestsQuery>({
      query: (params) => ({ url: '/me/requests/subjects/', params }),
      providesTags: [{ type: 'MyRequest', id: 'SUBJECT' }],
    }),

    getMyAssignmentRequests: build.query<ApiPaginated<MyAssignmentRequest>, MyRequestsQuery>({
      query: (params) => ({ url: '/me/requests/assignments/', params }),
      providesTags: [{ type: 'MyRequest', id: 'ASSIGNMENT' }],
    }),

    /** Variant so'rovlarida holat filtri yo'q — ular tasdiqlanmaydi. */
    getMySolutionRequests: build.query<
      ApiPaginated<MySolutionRequest>,
      Omit<MyRequestsQuery, 'status'>
    >({
      query: (params) => ({ url: '/me/requests/variants/', params }),
      providesTags: [{ type: 'MyRequest', id: 'VARIANT' }],
    }),

    /**
     * "Menga ham shu variant kerak" — yechimi yo'q variantga talab
     * bildiradi. Bitta foydalanuvchi bitta variantga bir marta.
     */
    requestVariantSolution: build.mutation<VariantRequestResult, string>({
      query: (variantId) => ({ url: `/variants/${variantId}/request/`, method: 'POST' }),
      invalidatesTags: [{ type: 'MyRequest', id: 'VARIANT' }],
    }),
  }),
});

export const {
  useSubmitUniversityRequestMutation,
  useGetMyUniversityRequestsQuery,
  useGetMySubjectRequestsQuery,
  useGetMyAssignmentRequestsQuery,
  useGetMySolutionRequestsQuery,
  useSubmitSubjectRequestMutation,
  useSubmitAssignmentRequestMutation,
  useRequestVariantSolutionMutation,
} = requestsApi;
