import type { ApiPaginated } from '@/shared/types/catalogue';
import type {
  MarkAllReadResponse,
  Notification,
  NotificationsQuery,
  NotificationSummary,
  WebSocketTicket,
} from '@/shared/types/notifications';
import { baseApi } from '@/store/api';

/**
 * Bildirishnomalar — haqiqiy backend.
 *
 * O'qilgan deb belgilash va o'chirish ro'yxatni serverdan qayta
 * so'ramaydi: javob allaqachon yangi holatni beradi, shuning uchun kesh
 * `updateQueryData` bilan joyida tuzatiladi. Aks holda har bosishda
 * butun ro'yxat qayta yuklanib, foydalanuvchi o'qigan joyini yo'qotardi.
 */
export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<ApiPaginated<Notification>, NotificationsQuery>({
      query: (params) => ({ url: '/me/notifications/', params }),
      providesTags: ['Notification'],
    }),

    getNotificationSummary: build.query<NotificationSummary, void>({
      query: () => ({ url: '/me/notifications/summary/' }),
      providesTags: [{ type: 'Notification', id: 'SUMMARY' }],
    }),

    markNotificationRead: build.mutation<Notification, { id: string; query: NotificationsQuery }>({
      query: ({ id }) => ({ url: `/me/notifications/${id}/read/`, method: 'POST' }),
      async onQueryStarted({ id, query }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', query, (draft) => {
            const item = draft.results.find((row) => row.id === id);
            if (item) item.is_read = true;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      // Sanoq serverda hisoblanadi — uni faqat qayta so'rab bilamiz.
      invalidatesTags: [{ type: 'Notification', id: 'SUMMARY' }],
    }),

    markAllNotificationsRead: build.mutation<MarkAllReadResponse, void>({
      query: () => ({ url: '/me/notifications/read-all/', method: 'POST' }),
      invalidatesTags: ['Notification', { type: 'Notification', id: 'SUMMARY' }],
    }),

    deleteNotification: build.mutation<void, { id: string; query: NotificationsQuery }>({
      query: ({ id }) => ({ url: `/me/notifications/${id}/`, method: 'DELETE' }),
      async onQueryStarted({ id, query }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', query, (draft) => {
            draft.results = draft.results.filter((row) => row.id !== id);
            draft.count = Math.max(0, draft.count - 1);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: 'Notification', id: 'SUMMARY' }],
    }),

    /**
     * WebSocket chiptasi — bir martalik va qisqa muddatli, shuning uchun
     * bu MUTATSIYA: keshlanishi kerak emas, har ulanishda yangisi olinadi.
     */
    getWebSocketTicket: build.mutation<WebSocketTicket, void>({
      query: () => ({ url: '/me/notifications/ws-ticket/', method: 'POST' }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationSummaryQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useGetWebSocketTicketMutation,
} = notificationsApi;
