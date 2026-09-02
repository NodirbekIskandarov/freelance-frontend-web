import type { ApiPaginated } from '@/shared/types/catalogue';
import type {
  Dispute,
  DisputeCreateRequest,
  DisputeStats,
  HeldEarnings,
} from '@/shared/types/disputes';
import type { Sale, SalesQuery } from '@/shared/types/sales';
import { baseApi } from '@/store/api';

/**
 * Xarid bo'yicha shikoyat — HAQIQIY backend.
 *
 * Shikoyat pulni harakatga keltiradi, shuning uchun u yuborilganda hamyon
 * ham eskiradi: muallif ulushi qaror chiqmaguncha ushlab turiladi va bu
 * uning «hold» ro'yxatida darhol ko'rinishi kerak.
 */
export const disputesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitDispute: build.mutation<Dispute, DisputeCreateRequest>({
      query: ({ evidence, ...rest }) => {
        // Fayl bo'lmasa JSON: `FormData` da har maydon satrga aylanadi va
        // bo'sh ro'yxat ham «bor» bo'lib ketardi.
        if (!evidence?.length) {
          return { url: '/disputes/', method: 'POST', body: rest };
        }

        const form = new FormData();
        form.append('order', rest.order);
        form.append('reason', rest.reason);
        form.append('description', rest.description);
        // Bir xil nom bilan bir nechta fayl — backend `getlist` bilan oladi.
        for (const file of evidence) form.append('evidence', file);
        return { url: '/disputes/', method: 'POST', body: form };
      },
      invalidatesTags: ['Dispute', 'Library', 'Order', 'Wallet'],
    }),

    getMyDisputes: build.query<ApiPaginated<Dispute>, { page?: number; page_size?: number } | void>(
      {
        query: (params) => ({ url: '/me/disputes/', params: params ?? undefined }),
        providesTags: ['Dispute'],
      },
    ),

    /** Muallifga kelgan shikoyatlar — javob berish uchun. */
    getDisputesAgainstMe: build.query<
      ApiPaginated<Dispute>,
      { page?: number; page_size?: number } | void
    >({
      query: (params) => ({ url: '/me/sales/disputes/', params: params ?? undefined }),
      providesTags: ['Dispute'],
    }),

    respondToDispute: build.mutation<Dispute, { id: string; text: string }>({
      query: ({ id, ...body }) => ({
        url: `/disputes/${id}/respond/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dispute'],
    }),

    getDisputeStats: build.query<DisputeStats, void>({
      query: () => ({ url: '/disputes/stats/' }),
      providesTags: [{ type: 'Dispute', id: 'STATS' }],
    }),

    /** Muallifning hali balansga tushmagan puli — hamyondagi qisqa karta. */
    getHeldEarnings: build.query<HeldEarnings, void>({
      query: () => ({ url: '/me/sales/held/' }),
      providesTags: ['Dispute', 'Wallet'],
    }),

    /**
     * Butun sotuv tarixi — «Sotuvlarim» bo'limi.
     *
     * `/me/sales/held/` dan alohida: u faqat hozir ushlab turilganini
     * beradi va sotuvchi «o'tgan oy sotganim nima bo'ldi» degan savolga
     * javob topa olmasdi.
     */
    getMySales: build.query<ApiPaginated<Sale>, SalesQuery | void>({
      query: (params) => ({ url: '/me/sales/', params: params ?? undefined }),
      providesTags: ['Dispute', 'Wallet'],
    }),
  }),
});

export const {
  useSubmitDisputeMutation,
  useGetMyDisputesQuery,
  useGetDisputesAgainstMeQuery,
  useRespondToDisputeMutation,
  useGetDisputeStatsQuery,
  useGetHeldEarningsQuery,
  useGetMySalesQuery,
} = disputesApi;
