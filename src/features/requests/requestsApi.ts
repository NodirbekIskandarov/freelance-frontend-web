import { baseApi } from '@/store/api';

/**
 * Foydalanuvchi yuboradigan arizalar: katalogda yo'q fan yoki
 * topshiriqni qo'shishni so'rash.
 *
 * Backendda faqat `POST` bor — yuborilgan arizani ko'rish yoki
 * tasdiqlash endpoint'i hali yo'q, shuning uchun UI'da ham "yuborildi"
 * xabaridan boshqasi ko'rsatilmaydi.
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
    submitSubjectRequest: build.mutation<RequestResult, SubjectRequestInput>({
      query: (body) => ({ url: '/subject-requests/', method: 'POST', body }),
    }),

    submitAssignmentRequest: build.mutation<RequestResult, AssignmentRequestInput>({
      query: (body) => ({ url: '/assignment-requests/', method: 'POST', body }),
    }),

    /**
     * "Menga ham shu variant kerak" — yechimi yo'q variantga talab
     * bildiradi. Bitta foydalanuvchi bitta variantga bir marta.
     */
    requestVariantSolution: build.mutation<VariantRequestResult, string>({
      query: (variantId) => ({ url: `/variants/${variantId}/request/`, method: 'POST' }),
    }),
  }),
});

export const {
  useSubmitSubjectRequestMutation,
  useSubmitAssignmentRequestMutation,
  useRequestVariantSolutionMutation,
} = requestsApi;
