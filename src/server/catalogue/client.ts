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

async function request<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${env.catalogueApiUrl.replace(/\/$/, '')}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) throw new CatalogueError(response.status, path);

  const body: unknown = await response.json();
  return (isEnvelope(body) ? body.data : body) as T;
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
