import type {
  FreelancerDashboard,
  FreelancerEarnings,
  FreelancerOrder,
} from '@/shared/types/freelancerCabinet';
import { baseApi } from '@/store/api';

export const freelancerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFreelancerDashboard: build.query<FreelancerDashboard, void>({
      query: () => ({ url: '/freelancer/dashboard' }),
      providesTags: ['Order'],
    }),

    getFreelancerOrders: build.query<FreelancerOrder[], void>({
      query: () => ({ url: '/freelancer/orders' }),
      providesTags: ['Order'],
    }),

    getFreelancerEarnings: build.query<FreelancerEarnings, void>({
      query: () => ({ url: '/freelancer/earnings' }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetFreelancerDashboardQuery,
  useGetFreelancerOrdersQuery,
  useGetFreelancerEarningsQuery,
} = freelancerApi;
