import { delay, http, HttpResponse } from 'msw';

import type { AuthTokens } from '../types/api';
import type { AppUser, AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import {
  WORK_DIRECTION_LABELS,
  type CreateExchangeTaskInput,
  type ExchangeOffer,
  type ExchangeTask,
} from '../types/freelance';
import type { DownloadItem, StudentDashboard, StudentOrder } from '../types/orders';
import { mockUsers } from './data';
import { mockExchangeOffers, mockExchangeTasks } from './exchange';
import { mockDownloads, mockStudentDashboard, mockStudentOrders } from './student';

/** Tarmoq kechikishini taqlid qiladi — loading holatlari real ko'rinsin. */
const LATENCY_MS = 300;

const tokens: AuthTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

function stripPassword(user: (typeof mockUsers)[number]): AppUser {
  const { password: _password, ...rest } = user;
  return rest;
}

/**
 * Handler'lar API manziliga bog'lab yaratiladi — `createHandlers(baseUrl)`.
 *
 * Wildcard (`*`) yo'llar ATAYLAB ishlatilmaydi: `admin/` loyihasida
 * `*[/]users/:id` naqshi Vite'ning dev modul so'rovini ushlab qolib,
 * "Failed to fetch dynamically imported module" xatosiga olib kelgan edi.
 * To'liq manzilga bog'langanda handler faqat haqiqiy API so'rovlarini ushlaydi.
 */
export function createHandlers(baseUrl: string) {
  const path = (suffix: string) => `${baseUrl.replace(/\/$/, '')}/${suffix}`;

  /*
   * Nusxa, urug'ning o'zi emas: yaratilgan topshiriq shu ro'yxatga
   * qo'shiladi va keyingi `GET`da qaytadi — POST'dan keyin ro'yxat
   * yangilanishini mock ham to'g'ri ko'rsatadi. Sahifa yangilanganda
   * urug' holatiga qaytadi, bu mock uchun kutilgan xatti-harakat.
   */
  const tasks: ExchangeTask[] = [...mockExchangeTasks];

  return [
    http.post(path('auth/login'), async ({ request }) => {
      await delay(LATENCY_MS);

      const body = (await request.json()) as Partial<LoginRequest>;
      const user = mockUsers.find((candidate) => candidate.phone === body.phone);

      if (!user || user.password !== body.password) {
        return HttpResponse.json(
          { message: "Telefon raqam yoki parol noto'g'ri" },
          { status: 401 },
        );
      }

      return HttpResponse.json<AuthResponse>({ ...tokens, user: stripPassword(user) });
    }),

    http.post(path('auth/register'), async ({ request }) => {
      await delay(LATENCY_MS);

      const body = (await request.json()) as Partial<RegisterRequest>;
      if (mockUsers.some((candidate) => candidate.phone === body.phone)) {
        return HttpResponse.json(
          { message: 'Bu telefon raqam bilan foydalanuvchi allaqachon mavjud' },
          { status: 409 },
        );
      }

      const user: AppUser = {
        id: String(mockUsers.length + 1),
        publicId: `USR-${100000 + mockUsers.length + 1}`,
        fullName: body.fullName ?? '',
        phone: body.phone ?? '',
        email: null,
        avatarUrl: null,
        status: 'student',
        createdAt: new Date(0).toISOString(),
      };

      return HttpResponse.json<AuthResponse>({ ...tokens, user });
    }),

    http.post(path('auth/refresh'), async () => {
      await delay(LATENCY_MS);
      return HttpResponse.json<AuthTokens>(tokens);
    }),

    /*
     * Token tekshiruvi ataylab: `SessionBootstrap` eskirgan token bilan
     * qanday yo'l tutishini shusiz sinab bo'lmaydi — mock hamma vaqt
     * foydalanuvchi qaytarsa, 401 shoxi hech qachon ishlamaydi.
     */
    http.get(path('auth/me'), async ({ request }) => {
      await delay(LATENCY_MS);

      if (request.headers.get('Authorization') !== `Bearer ${tokens.accessToken}`) {
        return HttpResponse.json({ message: 'Seans tugagan' }, { status: 401 });
      }

      const user = mockUsers[0];
      if (!user) return HttpResponse.json({ message: 'Foydalanuvchi topilmadi' }, { status: 404 });
      return HttpResponse.json<AppUser>(stripPassword(user));
    }),

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

    http.get(path('exchange/tasks/:taskId/offers'), async ({ params }) => {
      await delay(LATENCY_MS);
      const taskId = String(params.taskId);
      return HttpResponse.json<ExchangeOffer[]>(
        mockExchangeOffers.filter((offer) => offer.taskId === taskId),
      );
    }),
  ];
}
