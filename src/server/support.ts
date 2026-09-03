import 'server-only';

import type { SupportTerms } from '@/shared/types/support';

import { request } from './catalogue/client';

/**
 * Yordam markazi aytadigan shartlar.
 *
 * Katalog mijozi orqali: u ochiq endpointlar uchun yozilgan va kutish
 * chegarasi, qayta urinish, ISR keshi — hammasi allaqachon o'sha yerda.
 * Yordam sahifasi ham xuddi shunday ochiq va statik chiziladi.
 */
export async function getSupportTerms(): Promise<SupportTerms> {
  return request<SupportTerms>('/support/terms/');
}

/**
 * Xuddi shu shartlar, lekin YIQILMAYDIGAN holda.
 *
 * Yordam sahifasi bu ma'lumotsiz ma'nosiz — u yerda xato ko'rinishi
 * KERAK. Bosh sahifa esa shartlarsiz ham to'liq ishlaydi: mukofot
 * qatorlari chizilmaydi, kafolat matni umumiy shaklda qoladi. Butun
 * bosh sahifani bitta yordamchi so'rov tufayli yiqitish mumkin emas.
 */
export async function getSupportTermsSafe(): Promise<SupportTerms | null> {
  try {
    return await getSupportTerms();
  } catch {
    return null;
  }
}
