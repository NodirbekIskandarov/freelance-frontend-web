import { isFreelancer, type AppUser } from '@/shared/types/auth';

/**
 * Foydalanuvchi roliga mos kabinet manzili.
 *
 * Kirish, ro'yxatdan o'tish va header menyusi — uchalasi ham shu
 * funksiyaga tayanadi. Ilgari kirish formasi `/student/dashboard`ni
 * qattiq yozib qo'ygan edi va freelancer ham talaba kabinetiga tushardi.
 *
 * Rol `user.status` dan EMAS, `freelancer_profile.status` dan aniqlanadi:
 * birinchisi akkaunt holati (faol/bloklangan), rol emas.
 */
export function cabinetPathFor(user: AppUser): string {
  return isFreelancer(user) ? '/freelancer/dashboard' : '/student/dashboard';
}
