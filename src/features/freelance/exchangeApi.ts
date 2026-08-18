import type { ApiPaginated } from '@/shared/types/catalogue';
import type {
  ExchangeOffer,
  ExchangeOfferCreateRequest,
  ExchangeTask,
  ExchangeTaskDetail,
  ExchangeTaskWriteRequest,
  OfferStatus,
  TaskDeliverRequest,
  TaskStatus,
} from '@/shared/types/exchange';
import type { WorkDirection } from '@/shared/types/publicFreelance';
import { baseApi } from '@/store/api';

interface MineQuery {
  page?: number;
  page_size?: number;
  ordering?: string;
  status?: TaskStatus;
  direction?: WorkDirection;
}

/** Ochiq e'lonlar ro'yxatida `status` filtri yo'q — u har doim `open`. */
interface OpenQuery {
  page?: number;
  page_size?: number;
  ordering?: string;
  direction?: WorkDirection;
  deadline_days?: number;
  search?: string;
}

/**
 * Faylli so'rovni `multipart/form-data`ga aylantiradi.
 *
 * `fetch` FormData'ga `Content-Type`ni chegara (boundary) bilan o'zi
 * qo'yadi, shuning uchun sarlavhani qo'lda berish mumkin emas —
 * berilsa, chegara yo'qolib backend bo'sh forma ko'radi.
 */
function toBody<T extends object>(payload: T): FormData | T {
  const hasFile = Object.values(payload).some((value) => value instanceof File);
  if (!hasFile) return payload;

  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null || value === '') continue;
    form.append(key, value instanceof File ? value : String(value));
  }
  return form;
}

/**
 * Freelance birjasi — HAQIQIY backend.
 *
 * Uch xil ro'yxat bir xil `ExchangeTask` shaklini qaytaradi:
 *   `/freelance/tasks/`      — ochiq e'lonlar (freelancer ko'radi)
 *   `/me/freelance/tasks/`   — o'zim joylagan topshiriqlar (mijoz)
 *   `/me/freelance/jobs/`    — o'zim qabul qilgan ishlar (freelancer)
 * Farq faqat foydalanuvchi qaysi tomonda turishida.
 */
export const exchangeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOpenTasks: build.query<ApiPaginated<ExchangeTask>, OpenQuery>({
      query: (params) => ({ url: '/freelance/tasks/', params }),
      providesTags: [{ type: 'FreelanceTask', id: 'OPEN' }],
    }),

    getMyTasks: build.query<ApiPaginated<ExchangeTask>, MineQuery>({
      query: (params) => ({ url: '/me/freelance/tasks/', params }),
      providesTags: [{ type: 'FreelanceTask', id: 'MINE' }],
    }),

    getMyJobs: build.query<ApiPaginated<ExchangeTask>, MineQuery>({
      query: (params) => ({ url: '/me/freelance/jobs/', params }),
      providesTags: [{ type: 'FreelanceTask', id: 'JOBS' }],
    }),

    getMyOffers: build.query<
      ApiPaginated<ExchangeOffer>,
      { page?: number; page_size?: number; ordering?: string; status?: OfferStatus }
    >({
      query: (params) => ({ url: '/me/freelance/offers/', params }),
      providesTags: [{ type: 'FreelanceTask', id: 'OFFERS' }],
    }),

    getTask: build.query<ExchangeTaskDetail, string>({
      query: (id) => ({ url: `/freelance/tasks/${id}/` }),
      providesTags: (_result, _error, id) => [{ type: 'FreelanceTask', id }],
    }),

    getTaskOffers: build.query<ApiPaginated<ExchangeOffer>, string>({
      query: (id) => ({ url: `/freelance/tasks/${id}/offers/` }),
      providesTags: (_result, _error, id) => [{ type: 'FreelanceTask', id: `offers-${id}` }],
    }),

    createTask: build.mutation<ExchangeTask, ExchangeTaskWriteRequest>({
      query: (body) => ({ url: '/freelance/tasks/create/', method: 'POST', body: toBody(body) }),
      invalidatesTags: [
        { type: 'FreelanceTask', id: 'MINE' },
        { type: 'FreelanceTask', id: 'OPEN' },
      ],
    }),

    /** Faqat muallif va faqat topshiriq hali ochiq bo'lganda. */
    editTask: build.mutation<ExchangeTask, { id: string } & Partial<ExchangeTaskWriteRequest>>({
      query: ({ id, ...body }) => ({
        url: `/freelance/tasks/${id}/edit/`,
        method: 'PATCH',
        body: toBody(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'FreelanceTask', id },
        { type: 'FreelanceTask', id: 'MINE' },
      ],
    }),

    submitOffer: build.mutation<ExchangeOffer, { taskId: string } & ExchangeOfferCreateRequest>({
      query: ({ taskId, ...body }) => ({
        url: `/freelance/tasks/${taskId}/offers/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'FreelanceTask', id: `offers-${taskId}` },
        { type: 'FreelanceTask', id: 'OFFERS' },
        { type: 'FreelanceTask', id: 'OPEN' },
      ],
    }),

    /**
     * Mijoz taklifni qabul qiladi: kelishilgan summa balansdan yechilib,
     * ish topshirilguncha kafolatda ushlab turiladi, qolgan takliflar
     * rad etiladi. Shu sabab `Wallet` ham eskiradi.
     */
    acceptOffer: build.mutation<ExchangeOffer, { id: string; taskId: string }>({
      query: ({ id }) => ({ url: `/freelance/offers/${id}/`, method: 'POST' }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'FreelanceTask', id: taskId },
        { type: 'FreelanceTask', id: `offers-${taskId}` },
        { type: 'FreelanceTask', id: 'MINE' },
        'Wallet',
      ],
    }),

    /** Freelancer o'z taklifini qaytarib oladi. */
    withdrawOffer: build.mutation<void, { id: string; taskId: string }>({
      query: ({ id }) => ({ url: `/freelance/offers/${id}/`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'FreelanceTask', id: `offers-${taskId}` },
        { type: 'FreelanceTask', id: 'OFFERS' },
      ],
    }),

    deliverTask: build.mutation<ExchangeTask, { id: string } & TaskDeliverRequest>({
      query: ({ id, ...body }) => ({
        url: `/freelance/tasks/${id}/deliver/`,
        method: 'POST',
        body: toBody(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'FreelanceTask', id },
        { type: 'FreelanceTask', id: 'JOBS' },
      ],
    }),

    /** Yakunlash kafolatdagi summani freelancerga o'tkazadi. */
    completeTask: build.mutation<ExchangeTask, string>({
      query: (id) => ({ url: `/freelance/tasks/${id}/complete/`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'FreelanceTask', id },
        { type: 'FreelanceTask', id: 'MINE' },
        'Wallet',
      ],
    }),

    cancelTask: build.mutation<ExchangeTask, { id: string; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/freelance/tasks/${id}/cancel/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'FreelanceTask', id },
        { type: 'FreelanceTask', id: 'MINE' },
        'Wallet',
      ],
    }),
  }),
});

export const {
  useGetOpenTasksQuery,
  useGetMyTasksQuery,
  useGetMyJobsQuery,
  useGetMyOffersQuery,
  useGetTaskQuery,
  useGetTaskOffersQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useSubmitOfferMutation,
  useAcceptOfferMutation,
  useWithdrawOfferMutation,
  useDeliverTaskMutation,
  useCompleteTaskMutation,
  useCancelTaskMutation,
} = exchangeApi;
