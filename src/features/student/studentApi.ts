import type { DownloadItem, StudentDashboard, StudentOrder } from '@/shared/types/orders';
import { baseApi } from '@/store/api';

/**
 * Kabinet ma'lumotlari RTK Query orqali — bu sahifalar autentifikatsiya
 * ortida, indekslanmaydi, va kesh/qayta yuklash mantiqi kerak.
 * Katalogdan farqli o'laroq bu yerda SSR shart emas.
 */
export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStudentDashboard: build.query<StudentDashboard, void>({
      query: () => ({ url: '/student/dashboard' }),
      providesTags: ['Order'],
    }),

    getStudentOrders: build.query<StudentOrder[], void>({
      query: () => ({ url: '/student/orders' }),
      providesTags: ['Order'],
    }),

    getStudentDownloads: build.query<DownloadItem[], void>({
      query: () => ({ url: '/student/downloads' }),
    }),
  }),
});

export const { useGetStudentDashboardQuery, useGetStudentOrdersQuery, useGetStudentDownloadsQuery } =
  studentApi;
