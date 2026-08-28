/**
 * Topshiriq turlari — backend `AssignmentTypeEnum`.
 *
 * Backend beshta qiymat qaytaradi, saytda esa faqat UCHTASI ko'rsatiladi
 * (`ASSIGNMENT_TAB_ORDER`). `course_work` va `other` turidagi topshiriq
 * fan sahifasida umuman chizilmaydi — dizaynda uchta bo'lim bor.
 *
 * Diqqat: bu tanlov ma'lumotni YASHIRADI. Backendda topshiriq noto'g'ri
 * tur bilan saqlansa, u saytda ko'rinmay qoladi. Ro'yxatga yangi tur
 * qo'shilsa, uni shu yerga ham qo'shish kerak.
 */

export const ASSIGNMENT_TYPES = [
  'independent',
  'practical',
  'laboratory',
  'course_work',
  'other',
] as const;
export type AssignmentType = (typeof ASSIGNMENT_TYPES)[number];

/** Fan sahifasidagi bo'limlar — dizayndagi ketma-ketlik. */
export const ASSIGNMENT_TAB_ORDER = ['independent', 'practical', 'laboratory'] as const;

export type VisibleAssignmentType = (typeof ASSIGNMENT_TAB_ORDER)[number];

/** Topshiriq saytda ko'rsatiladigan turdami? */
export function isVisibleAssignmentType(type: string): type is VisibleAssignmentType {
  return (ASSIGNMENT_TAB_ORDER as readonly string[]).includes(type);
}

/**
 * Turning ko'rinadigan nomi.
 *
 * Yorliqlar bu faylda EMAS, tarjima lug'atida: ilgari o'zbekcha nomlar
 * shu yerda turardi va rus tilida ham o'zbekcha chiqardi. Lug'at
 * parametr sifatida beriladi — shunda funksiya serverda ham, mijozda
 * ham bir xil ishlaydi.
 */
export function assignmentTypeLabel(type: string, labels: Record<AssignmentType, string>): string {
  return labels[type as AssignmentType] ?? labels.other;
}
