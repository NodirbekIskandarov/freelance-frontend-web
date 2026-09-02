import 'server-only';

import { LOCALE_TAGS } from '@/i18n/config';
import { getRequestLocale } from '@/i18n/requestLocale';
import { env } from '@/lib/env';
import type { ApiPaginated } from '@/shared/types/catalogue';

/**
 * Katalog uchun server-side HTTP qatlami.
 *
 * `import 'server-only'` — bu modul mijoz komponentiga tasodifan
 * import qilinsa, build vaqtida XATO beradi.
 *
 * Nega RTK Query emas: bu sahifalar Google uchun. RTK Query hook'i
 * mijozda ishlaydi va bot bo'sh HTML ko'radi.
 */

/**
 * Katalog qanchalik tez-tez yangilanishi (soniya).
 *
 * Admin yangi fan qo'shganda sayt qayta build qilinmasdan, bir necha
 * daqiqada yangilanadi. `0` (har so'rovda) statik sahifalarni butunlay
 * o'chirib yuborardi, `false` (abadiy kesh) esa yangi kontentni faqat
 * deploy'dan keyin ko'rsatardi.
 */
const REVALIDATE_SECONDS = 300;

/**
 * Backend har javobni konvertga o'raydi:
 * `{ "success": true, "data": …, "errors": null }`.
 * Diqqat: Swagger buni ko'rsatmaydi — konvert middleware'da qo'shiladi.
 */
function isEnvelope(value: unknown): value is { success: boolean; data: unknown } {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.success === 'boolean' && 'data' in candidate;
}

export class CatalogueError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
  ) {
    super(`Katalog so'rovi muvaffaqiyatsiz: ${path} → ${status}`);
    this.name = 'CatalogueError';
  }
}

/**
 * Bitta so'rov uchun kutish chegarasi va qayta urinishlar.
 *
 * Sabab: katalog sahifalari build vaqtida yuzlab so'rov yuboradi va
 * bittasining uzilishi BUTUN build'ni to'xtatardi (tekshirilgan: deploy
 * paytida backend qayta ishga tushayotganda `ConnectTimeoutError`). Uch
 * urinish o'sib boruvchi kutish bilan — vaqtinchalik uzilishni yopadi,
 * haqiqiy nosozlikni esa baribir yuzaga chiqaradi.
 *
 * 4xx qayta urinilmaydi: yo'q sahifa qayta so'raganda ham paydo
 * bo'lmaydi, faqat build'ni cho'zadi.
 */
const REQUEST_TIMEOUT_MS = 15_000;
/*
 * Besh urinish, sekundlarga cho'ziladigan kutish bilan.
 *
 * Uch urinish (400ms → 1.6s) qisqa uzilishga yetardi, lekin build
 * paytidagi YUKLAMAGA emas: ikki til qo'shilgach so'rovlar soni ikki
 * barobar oshdi va backend qaytargan uzoq davom etuvchi 502 to'lqinini
 * bu oyna qoplay olmasdi.
 */
const MAX_ATTEMPTS = 5;
const RETRY_BASE_DELAY_MS = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${env.catalogueApiUrl.replace(/\/$/, '')}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        /*
         * Til MANZILDAN keladi.
         *
         * Ilgari bu yerda qat'iy `uz` turardi: sahifalar ISR bilan
         * statik chizilardi va hammaga bir xil ketardi. Endi har til
         * o'z manzilida (`/uz/materials`, `/ru/materials`) va ikkalasi
         * ham alohida statik chiziladi, ya'ni fan va institut nomlari
         * ham tarjima qilingan holda keladi.
         *
         * Sarlavha `fetch` keshining kalitiga kiradi, shuning uchun
         * ikki til bir-birining javobini olib qo'ymaydi.
         */
        headers: {
          Accept: 'application/json',
          'Accept-Language': LOCALE_TAGS[getRequestLocale()],
        },
        next: { revalidate: REVALIDATE_SECONDS },
        // `AbortSignal.timeout` — osilib qolgan ulanish butun build'ni
        // ushlab turmasligi uchun. Node 18+ da mavjud.
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        const error = new CatalogueError(response.status, path);
        // Mijoz xatosi — javob o'zgarmaydi, qayta urinish behuda.
        if (response.status < 500) throw error;
        lastError = error;
      } else {
        const body: unknown = await response.json();
        return (isEnvelope(body) ? body.data : body) as T;
      }
    } catch (error) {
      if (error instanceof CatalogueError && error.status < 500) throw error;
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) await delay(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
  }

  throw lastError instanceof Error ? lastError : new CatalogueError(0, path);
}

/**
 * Bir vaqtning o'zida nechta sahifa so'raladi.
 *
 * To'rtta: sahifalar ketma-ket olinganda ular bir-birini kutib turardi va
 * 1400 ta topshiriq o'n to'rtta navbatdagi so'rovga aylanardi. Hammasini
 * birdaniga otish esa boshqa chekka — build paytida ikki til va o'nlab
 * sahifa qo'shilib, backendga bir lahzada yuzlab so'rov tushardi.
 */
const PAGE_CONCURRENCY = 4;

/** Ro'yxatni bir vaqtda ko'pi bilan `PAGE_CONCURRENCY` ta bo'lib oladi. */
async function fetchPages<T>(
  path: string,
  params: Record<string, string | number> | undefined,
  pages: number[],
): Promise<T[]> {
  const items: T[] = [];

  for (let start = 0; start < pages.length; start += PAGE_CONCURRENCY) {
    const batch = pages.slice(start, start + PAGE_CONCURRENCY);
    const results = await Promise.all(
      batch.map((page) => request<ApiPaginated<T>>(path, { ...params, page, page_size: 100 })),
    );
    for (const result of results) items.push(...result.results);
  }

  return items;
}

/**
 * Ro'yxatni to'liq oladi.
 *
 * Katalog sahifalari BARCHA yozuvlarni ko'rsatadi (universitetlar,
 * fanlar), shuning uchun sahifalash bo'ylab yurib chiqamiz. Faqat
 * birinchi sahifani olish katalogni jimgina qirqib qo'yardi — 20 tadan
 * keyingisi hech qayerda ko'rinmasdi.
 *
 * Birinchi sahifa YOLG'IZ olinadi: nechta sahifa borligini undan bilamiz.
 * Qolganlari esa parallel, chunki ular bir-biriga bog'liq emas —
 * ketma-ket kutish katalog o'sgani sari chiziqli sekinlashardi.
 */
async function requestAll<T>(path: string, params?: Record<string, string | number>): Promise<T[]> {
  const first = await request<ApiPaginated<T>>(path, { ...params, page: 1, page_size: 100 });

  if (first.total_pages <= 1) return first.results;

  const rest = Array.from({ length: first.total_pages - 1 }, (_, index) => index + 2);
  return [...first.results, ...(await fetchPages<T>(path, params, rest))];
}

export { request, requestAll };
