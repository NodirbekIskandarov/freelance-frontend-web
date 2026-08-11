import type {
  CreateExchangeTaskInput,
  ExchangeOffer,
  ExchangeTask,
} from '@/shared/types/freelance';
import { baseApi } from '@/store/api';

/**
 * Birja — RTK Query o'z o'rnida: sahifa kirishni talab qiladi,
 * indekslanmaydi va ma'lumot foydalanuvchining o'ziga tegishli.
 */
export const exchangeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExchangeTasks: build.query<ExchangeTask[], void>({
      query: () => ({ url: '/exchange/tasks' }),
      providesTags: (result) => [
        { type: 'FreelanceTask' as const, id: 'LIST' },
        ...(result ?? []).map((task) => ({ type: 'FreelanceTask' as const, id: task.id })),
      ],
    }),

    createExchangeTask: build.mutation<ExchangeTask, CreateExchangeTaskInput>({
      query: (body) => ({ url: '/exchange/tasks', method: 'POST', body }),
      invalidatesTags: [{ type: 'FreelanceTask', id: 'LIST' }],
    }),

    getExchangeOffers: build.query<ExchangeOffer[], string>({
      query: (taskId) => ({ url: `/exchange/tasks/${taskId}/offers` }),
      providesTags: (_result, _error, taskId) => [{ type: 'Order', id: `offers-${taskId}` }],
    }),
  }),
});

export const {
  useGetExchangeTasksQuery,
  useCreateExchangeTaskMutation,
  useGetExchangeOffersQuery,
} = exchangeApi;
