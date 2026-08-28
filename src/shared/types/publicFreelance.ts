import type { Messages } from '@/i18n/messages/uz';

/** Sahifalangan ro'yxatlarning umumiy query parametrlari. */
interface ApiListQuery {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

/**
 * Ochiq freelancer katalogi va freelancer bo'lish arizasi — haqiqiy
 * backend shakli (`/api/v1/freelance/...`).
 */

export const WORK_DIRECTIONS = [
  'subject',
  'programming',
  'coursework',
  'independent',
  'diploma',
  'lab',
  'drawing',
  'translation',
  'content',
  'other',
] as const;
export type WorkDirection = (typeof WORK_DIRECTIONS)[number];

/** Yorliqlar lug'atdan — bu fayllar serverda ham ishlatiladi. */
export function workDirectionLabel(direction: WorkDirection, messages: Messages): string {
  const labels: Record<WorkDirection, string> = {
    subject: messages.freelance.dirSubject,
    programming: messages.freelance.dirProgramming,
    coursework: messages.freelance.dirCoursework,
    independent: messages.freelance.dirIndependent,
    diploma: messages.freelance.dirDiploma,
    lab: messages.freelance.dirLab,
    drawing: messages.freelance.dirDrawing,
    translation: messages.freelance.dirTranslation,
    content: messages.freelance.dirContent,
    other: messages.freelance.dirOther,
  };

  return labels[direction];
}

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'professional', 'expert'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export function experienceLevelLabel(level: ExperienceLevel, messages: Messages): string {
  const labels: Record<ExperienceLevel, string> = {
    beginner: messages.freelance.expBeginner,
    intermediate: messages.freelance.expIntermediate,
    professional: messages.freelance.expProfessional,
    expert: messages.freelance.expExpert,
  };

  return labels[level];
}

export const AVAILABILITIES = ['available', 'busy'] as const;
export type Availability = (typeof AVAILABILITIES)[number];

export function availabilityLabel(value: Availability, messages: Messages): string {
  return value === 'available' ? messages.freelance.available : messages.freelance.busy;
}

export interface PublicFreelancer {
  id: string;
  user: string;
  full_name: string;
  avatar: string | null;
  direction: WorkDirection;
  experience_level: ExperienceLevel;
  skills: string[];
  bio: string;
  city: string;
  portfolio_url: string;
  price_from: string | null;
  availability: Availability;
  rating: string;
  completed_jobs: number;
  approved_at: string | null;
}

export interface PublicFreelancersQuery extends ApiListQuery {
  direction?: WorkDirection;
  experience_level?: ExperienceLevel;
  availability?: Availability;
  city?: string;
}

export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const DOCUMENT_TYPES = ['passport', 'id_card'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'Pasport',
  id_card: 'ID karta',
};

/** Foydalanuvchi o'z arizasini ko'rgandagi shakl. */
export interface FreelancerApplication {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  contact_phone: string;
  telegram: string;
  document_type: DocumentType;
  city: string;
  university: string;
  faculty: string;
  course: number | null;
  major: string;
  about: string;
  motivation: string;
  availability_note: string;
  direction: WorkDirection;
  experience_level: ExperienceLevel;
  skills: string[];
  portfolio_url: string;
  status: ApplicationStatus;
  reject_reason: string;
  reviewed_at: string | null;
  /** Ko'rib chiqish taxminiy muddati (kun). */
  review_days: number;
  created_at: string;
}

/**
 * Ariza yuborish tanasi.
 *
 * `skills` MASSIV — ilgari mock'da vergul bilan ajratilgan satr edi.
 * Hujjat fayli hozircha yuborilmaydi: `document_file` `multipart` talab
 * qiladi va formada fayl tanlash hali yo'q.
 */
export interface FreelancerApplicationRequest {
  first_name: string;
  last_name: string;
  contact_phone: string;
  telegram?: string;
  document_type: DocumentType;
  passport_series?: string;
  passport_number?: string;
  id_card_number?: string;
  city: string;
  university: string;
  faculty?: string;
  course?: number | null;
  major?: string;
  about: string;
  motivation?: string;
  availability_note?: string;
  direction: WorkDirection;
  experience_level: ExperienceLevel;
  skills: string[];
  portfolio_url?: string;
  data_confirmed: boolean;
  documents_confirmed: boolean;
  rules_accepted: boolean;
}
