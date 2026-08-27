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
  semester?: number;
  /** Foydalanuvchining o'z izohi — moderator uchun kontekst. Ixtiyoriy. */
  note?: string;
}

export interface AssignmentRequestInput {
  subject: string;
  title: string;
  /** `independent` | `practical` | `laboratory` — katalog shu bo'yicha bo'linadi. */
  type: string;
  description?: string;
  /** Variantsiz topshiriqda YUBORILMAYDI. */
  variant_count?: number;
  file?: File;
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
      /*
       * Fayl biriktirilgan bo'lsa `FormData`, aks holda oddiy JSON.
       *
       * Har doim `FormData` yuborib bo'lmaydi: undagi hamma narsa matnga
       * aylanadi va `variant_count` ni tashlab ketish "bo'sh matn" bo'lib
       * ketardi, backend esa uni raqam deb kutadi. `fetchBaseQuery`
       * `FormData` ni ko'rsa `Content-Type` ni o'zi qo'ymaydi — chegara
       * (boundary) brauzer tomonidan qo'shiladi.
       */
      query: ({ file, ...rest }) => {
        if (!file) {
          return { url: '/assignment-requests/', method: 'POST', body: rest };
        }

        const form = new FormData();
        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined) form.append(key, String(value));
        }
        form.append('file', file);

        return { url: '/assignment-requests/', method: 'POST', body: form };
      },
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
      Omit<MyRequestsQuery, 'status'> & {
        /** Topshiriqning barcha variantlari bo'yicha — bitta so'rovda. */
        variant__assignment?: string;
      }
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

    /**
     * Variantsiz topshiriqqa so'rov.
     *
     * Katalog bunday topshiriqda variantlar to'rini chizmaydi, ya'ni
     * mijozda variant identifikatori yo'q. Backend uni o'zi hal qiladi:
     * yagona variant birinchi foydalanishda ochiladi.
     */
    requestAssignmentSolution: build.mutation<VariantRequestResult, string>({
      query: (assignmentId) => ({
        url: `/assignments/${assignmentId}/request/`,
        method: 'POST',
      }),
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
  useRequestAssignmentSolutionMutation,
} = requestsApi;
