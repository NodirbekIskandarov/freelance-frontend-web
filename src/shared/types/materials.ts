/**
 * Tayyor materiallar domeni — universitet → fan → topshiriq → variant →
 * yechim ierarxiyasi. Admin panelning `Institutlar/Fanlar/Topshiriqlar`
 * bo'limlari aynan shu ma'lumotni boshqaradi (`admin/` loyihasiga qarang);
 * bu yerda faqat ommaga ko'rinadigan, sotib olinadigan qismi ifodalanadi.
 */

export const MATERIAL_CATEGORIES = [
  'Texnika',
  'Iqtisodiyot',
  'Gumanitar',
  'Tabiiy fanlar',
  'Tibbiyot',
  "Qishloq xo'jaligi",
  "San'at",
  'Boshqalar',
] as const;
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export interface University {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  category: MaterialCategory;
  region: string;
  logoInitials: string;
  /** Tailwind gradient klassi: "from-emerald-500 to-teal-600". Rasm bo'lmaganda. */
  logoGradient: string;
  logoImageUrl?: string | null;
  subjectCount: number;
  taskCount: number;
}

export interface Subject {
  id: string;
  slug: string;
  universityId: string;
  name: string;
  category: MaterialCategory;
  course: number;
  semester: number;
  taskCount: number;
}

export const TASK_TYPES = ['independent_work', 'practical_work', 'laboratory_work'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  independent_work: 'Mustaqil ish',
  practical_work: 'Amaliy ish',
  laboratory_work: 'Laboratoriya ishi',
};

export const TASK_AVAILABILITY_STATUSES = ['has_solution', 'partial', 'missing'] as const;
export type TaskAvailabilityStatus = (typeof TASK_AVAILABILITY_STATUSES)[number];

export interface Task {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  taskType: TaskType;
  hasVariants: boolean;
  variantCount: number | null;
  course: number;
  semester: number;
  status: TaskAvailabilityStatus;
  /** Boshlang'ich narx — variantli topshiriqda variant narxi boshqacha bo'lishi mumkin. */
  priceFrom: number;
}

export interface TaskVariant {
  id: string;
  taskId: string;
  variantNumber: number;
  price: number;
  hasSolution: boolean;
}
