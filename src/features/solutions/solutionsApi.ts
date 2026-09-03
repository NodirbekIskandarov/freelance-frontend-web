import type { ApiPaginated, PublicSolution } from '@/shared/types/catalogue';
import type {
  MySolution,
  Purchase,
  SolutionReport,
  SolutionReportRequest,
  SolutionStatus,
  SolutionUploadRequest,
} from '@/shared/types/solutions';
import { baseApi } from '@/store/api';

/**
 * Yechimlar — yuklash, sotib olish va shikoyat.
 *
 * Hammasi haqiqiy backend. `GET /solutions/` — foydalanuvchining O'ZI
 * yuklagan yechimlari (katalog emas): katalog `/variants/{id}/solutions/`
 * orqali olinadi va u ochiq.
 */
export const solutionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMySolutions: build.query<
      ApiPaginated<MySolution>,
      {
        page?: number;
        page_size?: number;
        status?: SolutionStatus;
        variant?: string;
        /** Topshiriqning barcha variantlari — bitta so'rovda. */
        variant__assignment?: string;
        ordering?: string;
      }
    >({
      query: (params) => ({ url: '/solutions/', params }),
      providesTags: ['MySolution'],
    }),

    /**
     * Fayl bilan yuboriladi, shuning uchun `FormData`.
     * `Content-Type` ATAYLAB berilmaydi — brauzer uni `boundary` bilan
     * o'zi qo'yadi, qo'lda yozilsa `boundary` tushib qoladi.
     */
    uploadSolution: build.mutation<MySolution, SolutionUploadRequest>({
      query: ({ file, ...fields }) => {
        const body = new FormData();
        body.append('file', file);
        for (const [key, value] of Object.entries(fields)) {
          if (value !== undefined) body.append(key, String(value));
        }
        return { url: '/solutions/', method: 'POST', body };
      },
      invalidatesTags: ['MySolution'],
    }),

    /**
     * Variantning sotuvdagi yechimlari — TIRIK ro'yxat.
     *
     * Fan sahifasi ISR bilan statik chiziladi va yechimlar ro'yxati o'sha
     * chizish paytidagi holatni ko'rsatadi. Moderator yangi yechimni
     * sotuvga chiqarganda u sahifada besh daqiqagacha ko'rinmasdi —
     * sotuvchi esa kabinetida «Sotuvda» yozuvini ko'rib turardi.
     *
     * Server ro'yxati o'chirilmaydi: u qidiruv tizimlari uchun HTML'da
     * qoladi va birinchi chizishni to'ldiradi. Bu so'rov faqat TANLANGAN
     * variant uchun ketadi va kelganda ro'yxatning ustidan yoziladi.
     */
    getVariantSolutions: build.query<ApiPaginated<PublicSolution>, string>({
      // `page_size` katta: variantdagi yechimlar o'nlab bo'lmaydi, sahifalash
      // esa ro'yxatni jimgina qirqib qo'yardi.
      query: (variantId) => ({
        url: `/variants/${variantId}/solutions/`,
        params: { page_size: 100 },
      }),
    }),

    /** Katalogdagi ochiq tafsilot — faqat e'lon qilingan yechimlar. */
    getPublicSolution: build.query<PublicSolution, string>({
      query: (id) => ({ url: `/solutions/${id}/` }),
    }),

    /**
     * Sotib olish hamyon orqali o'tadi va kutubxonaga doimiy kirish beradi.
     * O'z yechimini yoki allaqachon sotib olinganini olib bo'lmaydi —
     * backend bunda xato qaytaradi.
     */
    purchaseSolution: build.mutation<Purchase, string>({
      query: (id) => ({ url: `/solutions/${id}/purchase/`, method: 'POST' }),
      invalidatesTags: ['Library', 'Wallet'],
    }),

    reportSolution: build.mutation<SolutionReport, { id: string } & SolutionReportRequest>({
      query: ({ id, ...body }) => ({ url: `/solutions/${id}/report/`, method: 'POST', body }),
    }),
  }),
});

export const {
  useGetMySolutionsQuery,
  useUploadSolutionMutation,
  useGetVariantSolutionsQuery,
  useGetPublicSolutionQuery,
  usePurchaseSolutionMutation,
  useReportSolutionMutation,
} = solutionsApi;
