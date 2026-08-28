import type { Messages } from '@/i18n/messages/uz';

/**
 * Auth domeni — haqiqiy backend shakli
 * (`https://api.yopamiz.uz/api/schema/`, "Auth" bo'limi).
 *
 * Diqqat: "freelancermi?" degan savolga `user.status` EMAS,
 * `freelancer_profile.status` javob beradi. `user.status` — bu akkaunt
 * holati (faol/bloklangan), rol emas. Ikkalasini adashtirish
 * bloklangan freelancerni oddiy talaba sifatida ko'rsatib qo'yardi.
 */

export const USER_STATUSES = ['pending', 'active', 'blocked', 'deleted'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const AUTH_PROVIDERS = ['password', 'phone', 'google'] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export const FREELANCER_STATUSES = ['none', 'pending', 'active', 'suspended', 'rejected'] as const;
export type FreelancerStatus = (typeof FREELANCER_STATUSES)[number];

export function freelancerStatusLabel(status: FreelancerStatus, messages: Messages): string {
  const labels: Record<FreelancerStatus, string> = {
    none: messages.freelance.statusNone,
    pending: messages.freelance.statusPending,
    active: messages.freelance.statusActive,
    suspended: messages.freelance.statusSuspended,
    rejected: messages.freelance.statusRejected,
  };

  return labels[status];
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  avatar: string | null;
  birth_date: string | null;
  gender: string;
  bio: string;
  telegram: string;
  university: string;
  university_display: string;
  course: number | null;
  trust_score: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfileSummary {
  id: string;
  status: FreelancerStatus;
  rating: string;
  completed_jobs: number;
  active_jobs: number;
  total_earn: string;
  approved_at: string | null;
  created_at: string;
}

export interface AppUser {
  id: string;
  phone: string | null;
  email: string;
  auth_provider: AuthProvider;
  status: UserStatus;
  phone_verified: boolean;
  email_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  is_seller: boolean;
  profile: UserProfile | null;
  /** Ariza yuborilmagan bo'lsa `null`. */
  freelancer_profile: FreelancerProfileSummary | null;
}

/** Tasdiqlangan freelancer — faqat `active` holatida. */
export function isFreelancer(user: Pick<AppUser, 'freelancer_profile'>): boolean {
  return user.freelancer_profile?.status === 'active';
}

/** Ekranlarda ko'rsatiladigan ism. Profil bo'sh bo'lsa telefonga tushamiz. */
export function displayName(user: AppUser): string {
  const fullName = user.profile?.full_name?.trim();
  if (fullName) return fullName;
  return user.phone ?? user.email ?? '—';
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: AppUser;
  tokens: TokenPair;
}

export interface LoginRequest {
  /**
   * Telefon raqam YOKI tasdiqlangan email.
   *
   * Bitta maydon: odam eslagan narsasini yozadi, backend esa «@»
   * belgisiga qarab qaysi biri ekanini o'zi hal qiladi. Undan avval
   * «telefonmi yoki emailmi» deb so'rash identifikatorini o'zi
   * tasniflashini talab qilish bo'lardi.
   */
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  password_confirm: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordRequest {
  /**
   * Birinchi parolni qo'yayotganda YUBORILMAYDI.
   *
   * SMS kodi yoki Google orqali ochilgan hisobda parol umuman yo'q, ya'ni
   * yozadigan eski parol ham yo'q. Backend bunday hisob uchun maydonni
   * talab qilmaydi (qaror saqlangan hash'dan olinadi, so'rovdan emas).
   */
  old_password?: string;
  new_password: string;
  new_password_confirm: string;
}

export interface PhoneCodeRequest {
  phone: string;
}

export interface PhoneCodeSentResponse {
  detail: string;
  /** SMS haqiqatan yuborildimi. Provayder ulanmaguncha `false`. */
  sms_sent: boolean;
  /**
   * SMS yuborilmaganda backend kodni javobda qaytaradi.
   *
   * Provayder ulangach bu maydon kelmay qo'yadi va kod faqat telefonda
   * qoladi — shuning uchun uni ixtiyoriy deb qarash SHART.
   */
  demo_code?: string;
}

export interface PhoneVerifyRequest {
  phone: string;
  code: string;
}

/**
 * Tiklash so'raladigan hisob — telefon yoki tasdiqlangan email.
 *
 * Bitta maydon, chunki backend «@» belgisiga qarab qaysi biri ekanini
 * o'zi hal qiladi va kodni tegishli kanal orqali yuboradi.
 */
export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ForgotPasswordConfirmRequest {
  identifier: string;
  code: string;
  new_password: string;
}

/**
 * Token'larning ILOVA ICHIDAGI shakli — saqlash abstraksiyasi
 * backendning maydon nomlariga bog'lanmasligi kerak.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function toAuthTokens(pair: TokenPair): AuthTokens {
  return { accessToken: pair.access, refreshToken: pair.refresh };
}
