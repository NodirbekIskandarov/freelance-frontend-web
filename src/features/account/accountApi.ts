import type {
  Appeal,
  AppealCreateRequest,
  MyDashboard,
  MyOrder,
  OrderStatus,
  SavedSolution,
  Wallet,
  WalletTransaction,
  WithdrawalCreateRequest,
  WithdrawalRequest,
  TransactionType,
  WithdrawalStatus,
} from '@/shared/types/account';
import type { ApiPaginated } from '@/shared/types/catalogue';
import type { PublicFreelancer } from '@/shared/types/publicFreelance';
import { baseApi } from '@/store/api';

export interface SavedFreelancer {
  id: string;
  freelancer: PublicFreelancer;
  created_at: string;
}

interface ListQuery {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

/**
 * Foydalanuvchi kabineti — HAQIQIY backend (`/api/v1/me/...`).
 *
 * Saqlanganlar ikki alohida ro'yxat: yechimlar va freelancerlar. Ular
 * bitta ro'yxatga birlashtirilmagan, chunki o'chirish yo'li ham
 * alohida (`/me/saved/solutions/{id}/` va `/me/saved/freelancers/{id}/`)
 * va o'chirish kaliti — SAQLANGAN YOZUV emas, obyektning o'zi.
 */
export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyDashboard: build.query<MyDashboard, void>({
      query: () => ({ url: '/me/dashboard/' }),
      providesTags: ['Order', 'Library', 'Saved'],
    }),

    getMyOrders: build.query<ApiPaginated<MyOrder>, ListQuery & { status?: OrderStatus }>({
      query: (params) => ({ url: '/me/orders/', params }),
      providesTags: ['Order'],
    }),

    getWallet: build.query<Wallet, void>({
      query: () => ({ url: '/me/wallet/' }),
      providesTags: ['Wallet'],
    }),

    getWalletTransactions: build.query<
      ApiPaginated<WalletTransaction>,
      ListQuery & { type?: TransactionType }
    >({
      query: (params) => ({ url: '/me/wallet/transactions/', params }),
      providesTags: ['Wallet'],
    }),

    getWithdrawals: build.query<
      ApiPaginated<WithdrawalRequest>,
      ListQuery & { status?: WithdrawalStatus }
    >({
      query: (params) => ({ url: '/me/wallet/withdrawals/', params }),
      providesTags: ['Withdrawal'],
    }),

    createWithdrawal: build.mutation<WithdrawalRequest, WithdrawalCreateRequest>({
      query: (body) => ({ url: '/me/wallet/withdrawals/', method: 'POST', body }),
      // Balans ham o'zgaradi: so'ralgan summa kutish holatiga o'tadi.
      invalidatesTags: ['Withdrawal', 'Wallet'],
    }),

    getSavedSolutions: build.query<ApiPaginated<SavedSolution>, ListQuery>({
      query: (params) => ({ url: '/me/saved/solutions/', params }),
      providesTags: ['Saved'],
    }),

    saveSolution: build.mutation<SavedSolution, string>({
      query: (solution) => ({ url: '/me/saved/solutions/', method: 'POST', body: { solution } }),
      invalidatesTags: ['Saved'],
    }),

    unsaveSolution: build.mutation<void, string>({
      query: (solutionId) => ({
        url: `/me/saved/solutions/${solutionId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Saved'],
    }),

    getSavedFreelancers: build.query<ApiPaginated<SavedFreelancer>, ListQuery>({
      query: (params) => ({ url: '/me/saved/freelancers/', params }),
      providesTags: ['Saved'],
    }),

    saveFreelancer: build.mutation<SavedFreelancer, string>({
      query: (freelancer) => ({
        url: '/me/saved/freelancers/',
        method: 'POST',
        body: { freelancer },
      }),
      invalidatesTags: ['Saved'],
    }),

    unsaveFreelancer: build.mutation<void, string>({
      query: (freelancerId) => ({
        url: `/me/saved/freelancers/${freelancerId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Saved'],
    }),

    getAppeals: build.query<ApiPaginated<Appeal>, ListQuery & { status?: string; topic?: string }>({
      query: (params) => ({ url: '/me/appeals/', params }),
      providesTags: ['Appeal'],
    }),

    /**
     * Bitta murojaat — ro'yxat javobi allaqachon `message` va `reply`ni
     * to'liq beradi, shuning uchun ro'yxat ekranida bu so'rov kerak emas.
     * Havola bo'yicha to'g'ridan-to'g'ri ochish uchun qoldirilgan.
     */
    getAppeal: build.query<Appeal, string>({
      query: (id) => ({ url: `/me/appeals/${id}/` }),
      providesTags: (_result, _error, id) => [{ type: 'Appeal', id }],
    }),

    createAppeal: build.mutation<Appeal, AppealCreateRequest>({
      /*
       * Fayl biriktirilgan bo'lsa `FormData`, aks holda oddiy JSON.
       *
       * Har doim `FormData` yuborib bo'lmaydi: undagi hamma narsa matnga
       * aylanadi. `fetchBaseQuery` `FormData` ni ko'rsa `Content-Type` ni
       * o'zi qo'ymaydi — chegara (boundary) brauzer tomonidan qo'shiladi.
       */
      query: ({ attachments, ...rest }) => {
        if (!attachments?.length) {
          return { url: '/me/appeals/', method: 'POST', body: rest };
        }

        const form = new FormData();
        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined) form.append(key, String(value));
        }
        for (const file of attachments) form.append('attachments', file);

        return { url: '/me/appeals/', method: 'POST', body: form };
      },
      invalidatesTags: ['Appeal'],
    }),
  }),
});

export const {
  useGetMyDashboardQuery,
  useGetMyOrdersQuery,
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useGetWithdrawalsQuery,
  useCreateWithdrawalMutation,
  useGetSavedSolutionsQuery,
  useSaveSolutionMutation,
  useUnsaveSolutionMutation,
  useGetSavedFreelancersQuery,
  useSaveFreelancerMutation,
  useUnsaveFreelancerMutation,
  useGetAppealsQuery,
  useGetAppealQuery,
  useCreateAppealMutation,
} = accountApi;
