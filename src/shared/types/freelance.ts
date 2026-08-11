/**
 * Freelance domeni — mutaxassis profillari va birjaga joylanadigan
 * topshiriqlar. Eski ilovadagi `types/freelance.ts` va
 * `types/freelance-exchange.ts` fayllari shu yerda birlashtirilgan:
 * ikkalasi ham bitta oqimning qismlari (freelancer topiladi → topshiriq
 * beriladi → taklif keladi), shuning uchun ularni ajratish sun'iy bo'lardi.
 */

export const FREELANCER_BADGES = ['top', 'pro', 'new'] as const;
export type FreelancerBadge = (typeof FREELANCER_BADGES)[number];

export const FREELANCER_BADGE_LABELS: Record<FreelancerBadge, string> = {
  top: 'Top',
  pro: 'Pro',
  new: 'Yangi',
};

export const FREELANCER_LEVELS = ['intern', 'middle', 'senior', 'expert'] as const;
export type FreelancerLevel = (typeof FREELANCER_LEVELS)[number];

export const FREELANCER_LEVEL_LABELS: Record<FreelancerLevel, string> = {
  intern: 'Intern',
  middle: 'Middle',
  senior: 'Senior',
  expert: 'Expert',
};

export const FREELANCER_AVAILABILITIES = ['available', 'busy'] as const;
export type FreelancerAvailability = (typeof FREELANCER_AVAILABILITIES)[number];

export const FREELANCER_AVAILABILITY_LABELS: Record<FreelancerAvailability, string> = {
  available: "Bo'sh",
  busy: 'Band',
};

export interface FreelancerProfile {
  id: string;
  slug: string;
  name: string;
  badge: FreelancerBadge;
  level: FreelancerLevel;
  rating: number;
  reviews: number;
  primarySkill: string;
  skills: string[];
  completedWorks: number;
  successRate: number;
  priceFrom: number;
  isOnline: boolean;
  availability: FreelancerAvailability;
  /** Band bo'lganda nima ustida ishlayotgani — kartada tushuntirish uchun. */
  activeOrderTitle?: string;
  joinedAt: string;
  bio: string;
  universityId: string;
  universitySlug: string;
  universityShortName: string;
  universityFullName: string;
  /** Avatar rasmi yo'q — ism harflaridan yasaladi. */
  avatarGradient: string;
}

/**
 * Ish yo'nalishlari — birjada ham, ariza formasida ham shu ro'yxat.
 * Eski ilovada `work-directions.ts` va `FreelancerCategory` ikki xil
 * ro'yxat edi va ular bir-biriga to'liq mos kelmasdi; bitta manba
 * qoldirildi.
 */
export const WORK_DIRECTIONS = [
  { value: 'fan', label: 'Fanlar', description: "Fan bo'yicha topshiriq, vazifa, mashq" },
  {
    value: 'programming',
    label: 'Dasturlash fanlari',
    description: 'Dasturlash, algoritm, kod yozish',
  },
  { value: 'coursework', label: 'Kurs ishlari', description: 'Kurs ishi, referat, taqdimot' },
  { value: 'independent', label: 'Mustaqil ishlar', description: 'Mustaqil ish, siyosat, reja' },
  {
    value: 'diploma',
    label: 'Diplom ishlari',
    description: 'Diplom, magistrlik, dissertatsiya qismi',
  },
  { value: 'lab', label: 'Laboratoriya ishlari', description: 'Lab ishi, hisobot, tajriba' },
  { value: 'drawing', label: 'Chizmachilik', description: 'Chizma, AutoCAD, sxema' },
  { value: 'translation', label: 'Tarjima', description: 'Tarjima va tahrir' },
  { value: 'content', label: 'Matn va kontent', description: 'Insho, matn, tahrir' },
  { value: 'boshqa', label: 'Boshqa ishlar', description: 'Boshqa akademik topshiriqlar' },
] as const;

export type WorkDirectionValue = (typeof WORK_DIRECTIONS)[number]['value'];

export const WORK_DIRECTION_LABELS = Object.fromEntries(
  WORK_DIRECTIONS.map((item) => [item.value, item.label]),
) as Record<WorkDirectionValue, string>;

export const EXCHANGE_TASK_STATUSES = [
  'yangi',
  'takliflar_kelyapti',
  'kelishuvda',
  'shartnoma_yaratildi',
  'tolov_kutilmoqda',
  'jarayonda',
  'yakunlandi',
  'bekor_qilindi',
] as const;
export type ExchangeTaskStatus = (typeof EXCHANGE_TASK_STATUSES)[number];

export const EXCHANGE_STATUS_LABELS: Record<ExchangeTaskStatus, string> = {
  yangi: 'Yangi',
  takliflar_kelyapti: 'Takliflar kelyapti',
  kelishuvda: 'Kelishuvda',
  shartnoma_yaratildi: 'Shartnoma yaratildi',
  tolov_kutilmoqda: "To'lov kutilmoqda",
  jarayonda: 'Jarayonda',
  yakunlandi: 'Yakunlandi',
  bekor_qilindi: 'Bekor qilindi',
};

/** Muddat tanlovi kunlarda — birja formasi va taklif formasi uchun bitta ro'yxat. */
export const DEADLINE_OPTIONS = ['1', '3', '5', '7', '14', '30'] as const;
export type DeadlineOption = (typeof DEADLINE_OPTIONS)[number];

export function formatDeadlineDays(deadline: string): string {
  return `${deadline} kun`;
}

export interface ExchangeTaskFile {
  fileName: string;
  fileSize: number;
}

export interface ExchangeTask {
  id: string;
  /** Support bilan gaplashganda topshiriqni tez topish uchun ko'rinadigan kod. */
  referenceCode: string;
  title: string;
  direction: WorkDirectionValue;
  directionLabel: string;
  taskFile: ExchangeTaskFile | null;
  deadline: string;
  comment: string | null;
  status: ExchangeTaskStatus;
  offersCount: number;
  agreedPrice: number | null;
  createdAt: string;
}

export interface ExchangeOffer {
  id: string;
  taskId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerRating: number;
  freelancerCompletedWorks: number;
  message: string;
  proposedDeadline: string;
  proposedPrice: number;
  createdAt: string;
}

export interface CreateExchangeTaskInput {
  title: string;
  direction: WorkDirectionValue;
  deadline: string;
  comment?: string;
  fileName?: string;
}
