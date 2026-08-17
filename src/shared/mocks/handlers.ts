import { delay, http, HttpResponse } from 'msw';

import type { Appeal, CreateAppealInput, SavedItem, Wallet } from '../types/account';
import {
  WORK_DIRECTION_LABELS,
  type CreateExchangeTaskInput,
  type ExchangeOffer,
  type ExchangeTask,
} from '../types/freelance';
import type { FreelancerApplicationResponse } from '../types/freelancerApplication';
import type {
  FreelancerDashboard,
  FreelancerEarnings,
  FreelancerOrder,
} from '../types/freelancerCabinet';
import type { DownloadItem, StudentDashboard, StudentOrder } from '../types/orders';
import { mockAppeals, mockSavedItems, mockWallet } from './account';
import { mockExchangeOffers, mockExchangeTasks } from './exchange';
import {
  mockFreelancerDashboard,
  mockFreelancerEarnings,
  mockFreelancerOrders,
} from './freelancerCabinet';
import { mockDownloads, mockStudentDashboard, mockStudentOrders } from './student';

/** Tarmoq kechikishini taqlid qiladi — loading holatlari real ko'rinsin. */
const LATENCY_MS = 300;

/** Mock SMS kodi — foydalanuvchiga formada ochiq ko'rsatiladi. */
const DEMO_SMS_CODE = '111111';

/**
 * Handler'lar API manziliga bog'lab yaratiladi — `createHandlers(baseUrl)`.
 *
 * Wildcard (`*`) yo'llar ATAYLAB ishlatilmaydi: `admin/` loyihasida
 * `*[/]users/:id` naqshi Vite'ning dev modul so'rovini ushlab qolib,
 * "Failed to fetch dynamically imported module" xatosiga olib kelgan edi.
 *
 * Auth handler'lari OLIB TASHLANDI — kirish, ro'yxatdan o'tish, telefon
 * tasdiqlash va parol tiklash endi haqiqiy backendga ketadi
 * (`/api/v1/auth/...`). Ular qolganda mock soxta token qaytarib,
 * haqiqiy endpoint'lar 401 bilan yiqilardi. Bu yerda qolgan yo'llar —
 * backendda hali mavjud bo'lmagan bo'limlar (kabinet, birja, hamyon).
 */
export function createHandlers(baseUrl: string) {
  const path = (suffix: string) => `${baseUrl.replace(/\/$/, '')}/${suffix}`;

  /*
   * Nusxa, urug'ning o'zi emas: yaratilgan yozuv shu ro'yxatga qo'shiladi
   * va keyingi `GET`da qaytadi. Sahifa yangilanganda urug' holatiga
   * qaytadi — bu mock uchun kutilgan xatti-harakat.
   */
  const tasks: ExchangeTask[] = [...mockExchangeTasks];
  const savedItems: SavedItem[] = [...mockSavedItems];
  const appeals: Appeal[] = [...mockAppeals];

  return [
    http.get(path('student/dashboard'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<StudentDashboard>(mockStudentDashboard);
    }),

    http.get(path('student/orders'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<StudentOrder[]>(mockStudentOrders);
    }),

    http.get(path('student/downloads'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<DownloadItem[]>(mockDownloads);
    }),

    http.get(path('account/saved'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<SavedItem[]>(savedItems);
    }),

    http.delete(path('account/saved/:itemId'), async ({ params }) => {
      await delay(LATENCY_MS);

      const index = savedItems.findIndex((item) => item.id === String(params.itemId));
      if (index === -1) {
        return HttpResponse.json({ message: 'Element topilmadi' }, { status: 404 });
      }

      savedItems.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),

    http.get(path('account/wallet'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<Wallet>(mockWallet);
    }),

    http.get(path('account/appeals'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<Appeal[]>(appeals);
    }),

    http.post(path('account/appeals'), async ({ request }) => {
      await delay(LATENCY_MS);

      const body = (await request.json()) as CreateAppealInput;
      const created: Appeal = {
        id: `ap-${Date.now()}`,
        reference: `MRJ-${3100 + appeals.length}`,
        subject: body.subject,
        message: body.message,
        status: 'open',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        reply: null,
      };

      appeals.unshift(created);
      return HttpResponse.json<Appeal>(created, { status: 201 });
    }),

    http.get(path('freelancer/dashboard'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<FreelancerDashboard>(mockFreelancerDashboard);
    }),

    http.get(path('freelancer/orders'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<FreelancerOrder[]>(mockFreelancerOrders);
    }),

    http.get(path('freelancer/earnings'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<FreelancerEarnings>(mockFreelancerEarnings);
    }),

    http.get(path('exchange/tasks'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<ExchangeTask[]>(tasks);
    }),

    http.post(path('exchange/tasks'), async ({ request }) => {
      await delay(LATENCY_MS);

      const body = (await request.json()) as CreateExchangeTaskInput;
      const created: ExchangeTask = {
        id: `extask-${Date.now()}`,
        referenceCode: `BRJ-${1000 + tasks.length + 1}`,
        title: body.title,
        direction: body.direction,
        directionLabel: WORK_DIRECTION_LABELS[body.direction],
        taskFile: body.fileName ? { fileName: body.fileName, fileSize: 180_000 } : null,
        deadline: body.deadline,
        comment: body.comment ?? null,
        status: 'yangi',
        offersCount: 0,
        agreedPrice: null,
        createdAt: new Date().toISOString(),
      };

      // Ro'yxat boshiga — birja `createdAt` kamayish tartibida ko'rsatiladi.
      tasks.unshift(created);
      return HttpResponse.json<ExchangeTask>(created, { status: 201 });
    }),

    http.post(path('freelancer-applications/phone-code'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json({ demoCode: DEMO_SMS_CODE });
    }),

    http.post(path('freelancer-applications/phone-verify'), async ({ request }) => {
      await delay(LATENCY_MS);

      const body = (await request.json()) as { code?: string };
      if (body.code !== DEMO_SMS_CODE) {
        return HttpResponse.json({ message: "Kod noto'g'ri" }, { status: 400 });
      }

      return HttpResponse.json({ verified: true });
    }),

    http.post(path('freelancer-applications'), async () => {
      await delay(LATENCY_MS * 2);
      return HttpResponse.json<FreelancerApplicationResponse>(
        {
          id: `app-${Date.now()}`,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          reviewDays: 3,
        },
        { status: 201 },
      );
    }),

    http.get(path('exchange/tasks/:taskId/offers'), async ({ params }) => {
      await delay(LATENCY_MS);
      const taskId = String(params.taskId);
      return HttpResponse.json<ExchangeOffer[]>(
        mockExchangeOffers.filter((offer) => offer.taskId === taskId),
      );
    }),
  ];
}
