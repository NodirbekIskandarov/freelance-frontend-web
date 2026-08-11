import type {
  FreelancerApplicationDraft,
  FreelancerApplicationResponse,
} from '@/shared/types/freelancerApplication';
import { baseApi } from '@/store/api';

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendPhoneCode: build.mutation<{ demoCode: string }, { phone: string }>({
      query: (body) => ({ url: '/freelancer-applications/phone-code', method: 'POST', body }),
    }),

    verifyPhoneCode: build.mutation<{ verified: boolean }, { phone: string; code: string }>({
      query: (body) => ({ url: '/freelancer-applications/phone-verify', method: 'POST', body }),
    }),

    submitApplication: build.mutation<FreelancerApplicationResponse, FreelancerApplicationDraft>({
      query: (body) => ({ url: '/freelancer-applications', method: 'POST', body }),
      // Ariza tasdiqlansa foydalanuvchi statusi o'zgaradi — profilni yangilaymiz.
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
  useSubmitApplicationMutation,
} = applicationApi;
