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
