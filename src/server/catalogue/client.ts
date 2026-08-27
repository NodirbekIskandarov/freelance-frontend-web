import 'server-only';

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
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 400;

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
         * Til ATAYLAB qat'iy `uz`.
         *
         * Bu sahifalar ISR bilan statik chiziladi va BARCHA tashrif
         * buyuruvchiga bir xil ketadi — ular tanlagan tilga qarab
         * o'zgara olmaydi. Sarlavhani yozib qo'yish natijani
         * aniqlashtiradi: usiz javob server sozlamasiga bog'liq bo'lardi
         * va build muhiti o'zgarsa katalog jimgina boshqa tilga
         * o'tib ketishi mumkin edi.
         *
         * Tilni tanlash mijozdagi so'rovlarda ishlaydi. Katalog
         * sahifalarini ham tilga bo'lish uchun manzilga til segmenti
         * kerak (`/ru/materials/...`) — bu alohida ish.
         */
        headers: { Accept: 'application/json', 'Accept-Language': 'uz' },
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
 * Ro'yxatni to'liq oladi.
 *
 * Katalog sahifalari BARCHA yozuvlarni ko'rsatadi (universitetlar,
 * fanlar), shuning uchun sahifalash bo'ylab yurib chiqamiz. Faqat
 * birinchi sahifani olish katalogni jimgina qirqib qo'yardi — 20 tadan
 * keyingisi hech qayerda ko'rinmasdi.
 */
async function requestAll<T>(path: string, params?: Record<string, string | number>): Promise<T[]> {
  const first = await request<ApiPaginated<T>>(path, { ...params, page: 1, page_size: 100 });
  const items = [...first.results];

  for (let page = 2; page <= first.total_pages; page += 1) {
    const next = await request<ApiPaginated<T>>(path, { ...params, page, page_size: 100 });
    items.push(...next.results);
  }

  return items;
}

export { request, requestAll };
