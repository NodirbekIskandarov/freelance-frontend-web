import type { Appeal, CreateAppealInput, SavedItem, Wallet } from '@/shared/types/account';
import { baseApi } from '@/store/api';

export const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSavedItems: build.query<SavedItem[], void>({
      query: () => ({ url: '/account/saved' }),
      providesTags: ['Saved'],
    }),

    removeSavedItem: build.mutation<void, string>({
      query: (itemId) => ({ url: `/account/saved/${itemId}`, method: 'DELETE' }),
      /*
       * Optimistik yangilash: saqlanganlar ro'yxatidan o'chirish — bekor
       * qilish oson bo'lgan, xavfsiz amal. Serverni kutish elementning
       * yarim soniya "osilib" turishiga olib kelardi.
       */
      onQueryStarted: async (itemId, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          accountApi.util.updateQueryData('getSavedItems', undefined, (draft) => {
            const index = draft.findIndex((item) => item.id === itemId);
            if (index !== -1) draft.splice(index, 1);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    getWallet: build.query<Wallet, void>({
      query: () => ({ url: '/account/wallet' }),
      providesTags: ['Wallet'],
    }),

    getAppeals: build.query<Appeal[], void>({
      query: () => ({ url: '/account/appeals' }),
      providesTags: ['Appeal'],
    }),

    createAppeal: build.mutation<Appeal, CreateAppealInput>({
      query: (body) => ({ url: '/account/appeals', method: 'POST', body }),
      invalidatesTags: ['Appeal'],
    }),
  }),
});

export const {
  useGetSavedItemsQuery,
  useRemoveSavedItemMutation,
  useGetWalletQuery,
  useGetAppealsQuery,
  useCreateAppealMutation,
} = accountApi;
