import type { AppUser } from '@/shared/types/auth';

/**
 * Foydalanuvchi roliga mos kabinet manzili.
 *
 * Kirish, ro'yxatdan o'tish va header menyusi — uchalasi ham shu
 * funksiyaga tayanadi. Ilgari kirish formasi `/student/dashboard`ni
 * qattiq yozib qo'ygan edi va freelancer ham talaba kabinetiga tushardi.
 */
export function cabinetPathFor(user: AppUser): string {
  return user.status === 'freelancer' ? '/freelancer/dashboard' : '/student/dashboard';
}
