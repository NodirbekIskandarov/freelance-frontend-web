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

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  independent: 'Mustaqil ishlar',
  practical: 'Amaliy ishlar',
  laboratory: 'Laboratoriya ishlari',
  course_work: 'Kurs ishlari',
  other: 'Boshqa',
};

/** Fan sahifasidagi bo'limlar — dizayndagi ketma-ketlik. */
export const ASSIGNMENT_TAB_ORDER = ['independent', 'practical', 'laboratory'] as const;

export type VisibleAssignmentType = (typeof ASSIGNMENT_TAB_ORDER)[number];

/** Topshiriq saytda ko'rsatiladigan turdami? */
export function isVisibleAssignmentType(type: string): type is VisibleAssignmentType {
  return (ASSIGNMENT_TAB_ORDER as readonly string[]).includes(type);
}

export function assignmentTypeLabel(type: string): string {
  return ASSIGNMENT_TYPE_LABELS[type as AssignmentType] ?? ASSIGNMENT_TYPE_LABELS.other;
}
