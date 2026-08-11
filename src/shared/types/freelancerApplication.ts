/**
 * Freelancer bo'lish uchun ariza.
 *
 * Ariza `pending` holatida adminga tushadi — `admin/` loyihasidagi
 * "Freelancer arizalari" bo'limi aynan shu ma'lumotni ko'rsatadi.
 */

export const DOCUMENT_TYPES = ['passport', 'id_card'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'Pasport',
  id_card: 'ID karta',
};

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'professional', 'expert'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Boshlang'ich — 1 yilgacha",
  intermediate: "O'rta — 1-3 yil",
  professional: 'Professional — 3-5 yil',
  expert: 'Ekspert — 5 yildan ortiq',
};

export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface FreelancerApplicationDraft {
  firstName: string;
  lastName: string;
  phone: string;
  phoneVerified: boolean;
  telegram: string;

  documentType: DocumentType;
  passportSeries: string;
  passportNumber: string;
  idCardNumber: string;

  city: string;
  university: string;
  faculty: string;
  course: string;
  major: string;

  about: string;
  motivation: string;
  availability: string;

  direction: string;
  experienceLevel: ExperienceLevel;
  skills: string;
  portfolioUrl: string;

  dataConfirmed: boolean;
  documentsConfirmed: boolean;
  rulesAccepted: boolean;
}

export interface FreelancerApplicationResponse {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  /** Admin tekshiruvining taxminiy muddati — muvaffaqiyat ekranida ko'rsatiladi. */
  reviewDays: number;
}
