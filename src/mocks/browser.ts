import { handlers } from '@/shared/mocks';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...handlers);

/**
 * Backend tayyor bo'lguncha so'rovlarni Service Worker ushlab qoladi.
 * Bu modul faqat mock yoqilganda dinamik import qilinadi — production
 * bundle'ga MSW umuman tushmaydi.
 */
export async function enableMocking(): Promise<void> {
  await worker.start({
    // Mock qilinmagan so'rovlar (rasm, shrift, Next ichki so'rovlari) o'tib ketsin.
    onUnhandledRequest: 'bypass',
  });
}
