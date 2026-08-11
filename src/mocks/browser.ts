import { setupWorker } from 'msw/browser';

import { env } from '@/lib/env';
import { createHandlers } from '@/shared/mocks';

// Handler'lar API manziliga bog'lanadi — wildcard ishlatilsa, ular Vite/Next
// dev modul so'rovlarini ham ushlab qolishi mumkin (admin/ loyihasida
// aynan shu sabab bilan xato chiqqan edi).
export const worker = setupWorker(...createHandlers(env.apiUrl));

/**
 * Modul darajasidagi promise — komponent emas, fayl darajasida.
 *
 * React 19'ning StrictMode'i dev rejimida effect'larni ikki marta ishga
 * tushiradi (mount → cleanup → qayta mount). `MockGate`dagi effect buni
 * hisobga olmasa, `worker.start()` ikkinchi marta chaqiriladi va
 * "cannot configure an already enabled network" xatosi bilan yiqiladi
 * — worker allaqachon faol bo'lgani uchun. Bu o'zgaruvchi komponent
 * qayta mount bo'lsa ham saqlanadi (modul faqat bir marta yuklanadi),
 * shuning uchun `worker.start()` sahifa umrida faqat bir marta ketadi.
 */
let startPromise: ReturnType<typeof worker.start> | null = null;

/**
 * Bu modul faqat dinamik import orqali yuklanadi (`providers.tsx`ga
 * qarang), shuning uchun MSW production bundle'iga tushmaydi.
 */
export async function enableMocking(): Promise<void> {
  startPromise ??= worker.start({
    // Mock qilinmagan so'rovlar (rasm, shrift, Next ichki so'rovlari) o'tib ketsin.
    onUnhandledRequest: 'bypass',
  });
  await startPromise;
}
