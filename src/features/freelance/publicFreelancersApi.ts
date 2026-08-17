import type { ApiPaginated } from '@/shared/types/catalogue';
import type {
  FreelancerApplication,
  FreelancerApplicationRequest,
  PublicFreelancer,
  PublicFreelancersQuery,
} from '@/shared/types/publicFreelance';
import { baseApi } from '@/store/api';

/**
 * Ochiq freelancer katalogi va freelancer bo'lish arizasi — HAQIQIY
 * backend (`/freelance/...`).
 *
 * Ariza telefonini tasdiqlash `/auth/phone/...` dan ALOHIDA: bu yerda
 * aloqa raqami tasdiqlanadi, u kirish raqamidan boshqa bo'lishi mumkin.
 */
export const publicFreelanceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublicFreelancers: build.query<ApiPaginated<PublicFreelancer>, PublicFreelancersQuery>({
      query: (params) => ({ url: '/freelance/freelancers/', params }),
      providesTags: ['PublicFreelancer'],
    }),

    getPublicFreelancer: build.query<PublicFreelancer, string>({
      query: (id) => ({ url: `/freelance/freelancers/${id}/` }),
      providesTags: (_result, _error, id) => [{ type: 'PublicFreelancer', id }],
    }),

    /**
     * Foydalanuvchining o'z arizasi.
     *
     * Ariza yuborilmagan bo'lsa backend 404 qaytaradi — bu XATO EMAS,
     * "hali ariza yo'q" degani. Komponent shuni holat sifatida o'qiydi.
     */
    getMyApplication: build.query<FreelancerApplication, void>({
      query: () => ({ url: '/freelance/applications/' }),
      providesTags: ['FreelancerApplication'],
    }),

    submitApplication: build.mutation<FreelancerApplication, FreelancerApplicationRequest>({
      query: (body) => ({ url: '/freelance/applications/', method: 'POST', body }),
      invalidatesTags: ['FreelancerApplication', 'User'],
    }),

    sendApplicationPhoneCode: build.mutation<{ demo_code?: string }, { phone: string }>({
      query: (body) => ({
        url: '/freelance/applications/phone/send-code/',
        method: 'POST',
        body,
      }),
    }),

    verifyApplicationPhone: build.mutation<{ verified?: boolean }, { phone: string; code: string }>(
      {
        query: (body) => ({ url: '/freelance/applications/phone/verify/', method: 'POST', body }),
      },
    ),
  }),
});

export const {
  useGetPublicFreelancersQuery,
  useGetPublicFreelancerQuery,
  useGetMyApplicationQuery,
  useSubmitApplicationMutation,
  useSendApplicationPhoneCodeMutation,
  useVerifyApplicationPhoneMutation,
} = publicFreelanceApi;
