/**
 * Topshiriq turlari — backend `AssignmentTypeEnum`.
 *
 * Fan sahifasidagi tablar shu ro'yxatdan chiziladi. `course_work` va
 * `other` ham mavjud, lekin ular alohida tab emas: dizaynda uchta tab
 * bor, qolganlari «Boshqa» ostida yig'iladi.
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

/** Tab tartibi — dizayndagi ketma-ketlik. */
export const ASSIGNMENT_TAB_ORDER: AssignmentType[] = [
  'independent',
  'practical',
  'laboratory',
  'course_work',
  'other',
];

export function assignmentTypeLabel(type: string): string {
  return ASSIGNMENT_TYPE_LABELS[type as AssignmentType] ?? ASSIGNMENT_TYPE_LABELS.other;
}
