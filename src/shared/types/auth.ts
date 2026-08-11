/**
 * Foydalanuvchi domeni. `admin` roli ataylab yo'q — admin paneli
 * mustaqil loyiha (`admin/`), bu ilova faqat talaba/freelancer ko'radi.
 */
export type UserStatus = 'student' | 'pending_freelancer' | 'freelancer' | 'rejected_freelancer';

export interface AppUser {
  id: string;
  /** Qo'llab-quvvatlash uchun ko'rinadigan ID: USR-1254687 */
  publicId: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  status: UserStatus;
  createdAt: string;
}

export function isFreelancer(user: Pick<AppUser, 'status'>): boolean {
  return user.status === 'freelancer';
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AppUser;
}
