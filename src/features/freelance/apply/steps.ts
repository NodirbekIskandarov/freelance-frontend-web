import type { FreelancerApplicationDraft } from '@/shared/types/freelancerApplication';

/**
 * Bosqichlar va ularning tekshiruvi — sof ma'lumot, React'siz.
 *
 * Har bosqich o'z maydonlarini o'zi tekshiradi. Sarlavhalar va tekshiruv
 * bir joyda turgani uchun yangi bosqich qo'shish bitta massiv elementini
 * qo'shish demak: forma komponentiga tegilmaydi.
 */

export type DraftErrors = Partial<Record<keyof FreelancerApplicationDraft, string>>;

export interface ApplyStep {
  title: string;
  /** Stepper'da ko'rinadigan qisqa nom. */
  shortTitle: string;
  validate: (draft: FreelancerApplicationDraft) => DraftErrors;
}

function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

/** `undefined` qiymatli kalitlarni tashlab, faqat haqiqiy xatolarni qoldiradi. */
function compact(errors: Record<string, string | undefined>): DraftErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as DraftErrors;
}

export const APPLY_STEPS: ApplyStep[] = [
  {
    title: "Shaxsiy ma'lumotlar",
    shortTitle: 'Shaxsiy',
    validate: (draft) =>
      compact({
        firstName: required(draft.firstName, 'Ismni kiriting'),
        lastName: required(draft.lastName, 'Familiyani kiriting'),
        phone: required(draft.phone, 'Telefon raqamni kiriting'),
        phoneVerified: draft.phoneVerified ? undefined : 'Telefon raqamni tasdiqlang',
      }),
  },
  {
    title: "Hujjat ma'lumotlari",
    shortTitle: 'Hujjat',
    validate: (draft) =>
      draft.documentType === 'passport'
        ? compact({
            passportSeries: required(draft.passportSeries, 'Seriyani kiriting'),
            passportNumber: required(draft.passportNumber, 'Raqamni kiriting'),
          })
        : compact({
            idCardNumber: required(draft.idCardNumber, 'ID karta raqamini kiriting'),
          }),
  },
  {
    title: "Ta'lim va manzil",
    shortTitle: "Ta'lim",
    validate: (draft) =>
      compact({
        city: required(draft.city, 'Yashash joyini kiriting'),
        university: required(draft.university, "O'qish joyini kiriting"),
        faculty: required(draft.faculty, 'Fakultetni kiriting'),
      }),
  },
  {
    title: "Qo'shimcha ma'lumotlar",
    shortTitle: "Qo'shimcha",
    validate: (draft) =>
      compact({
        about: required(draft.about, "O'zingiz haqingizda qisqacha yozing"),
      }),
  },
  {
    title: "Freelancer ma'lumotlari",
    shortTitle: 'Mutaxassislik',
    validate: (draft) =>
      compact({
        skills: required(draft.skills, "Ko'nikmalaringizni kiriting"),
      }),
  },
  {
    title: 'Tasdiqlash',
    shortTitle: 'Tasdiqlash',
    validate: (draft) =>
      compact({
        dataConfirmed: draft.dataConfirmed ? undefined : "Ma'lumotlar to'g'riligini tasdiqlang",
        documentsConfirmed: draft.documentsConfirmed
          ? undefined
          : 'Hujjatlar haqiqiyligini tasdiqlang',
        rulesAccepted: draft.rulesAccepted ? undefined : 'Platforma qoidalariga rozilik bering',
      }),
  },
];

export const EMPTY_DRAFT: FreelancerApplicationDraft = {
  firstName: '',
  lastName: '',
  phone: '',
  phoneVerified: false,
  telegram: '',
  documentType: 'passport',
  passportSeries: '',
  passportNumber: '',
  idCardNumber: '',
  city: '',
  university: '',
  faculty: '',
  course: '',
  major: '',
  about: '',
  motivation: '',
  availability: '',
  direction: 'programming',
  experienceLevel: 'intermediate',
  skills: '',
  portfolioUrl: '',
  dataConfirmed: false,
  documentsConfirmed: false,
  rulesAccepted: false,
};
