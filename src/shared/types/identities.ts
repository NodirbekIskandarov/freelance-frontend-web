import type { Messages } from '@/i18n/messages/uz';

/**
 * Hisobga kirish usullari — `/me/login-methods/`.
 *
 * Hisob bitta, unga bir nechta yo'l bog'lanadi. Har biri mustaqil: qaysi
 * biri orqali kirilsa ham o'sha hisobga tushiladi.
 */

export type LoginMethodKind = 'phone' | 'email' | 'google';

export interface LoginMethod {
  kind: LoginMethodKind;
  /** Ko'rsatiladigan qiymat — raqam yoki manzil. */
  value: string;
  /** Tasdiqlanmagan usul kirish yo'li emas: u kod qabul qila olmaydi. */
  verified: boolean;
  /** Hisob shu usul bilan ochilgan. */
  is_primary: boolean;
  /**
   * Uzish mumkinmi. Serverdan keladi, chunki qaror qolgan usullar soniga
   * bog'liq — mijozda alohida hisoblansa, server rad qiladigan tugma
   * chizilib qolardi.
   */
  can_unlink: boolean;
}

export interface LoginMethods {
  methods: LoginMethod[];
  has_password: boolean;
}

/** Kod yuborildi. `demo_code` faqat yetkazish o'chiq bo'lganda keladi. */
export interface CodeSent {
  sent: boolean;
  demo_code: string | null;
}

/** Yorliq lug'atdan — matn bu faylda saqlanib qolsa rus tilida ham o'zbekcha chiqardi. */
export function loginMethodLabel(kind: LoginMethodKind, messages: Messages): string {
  const labels: Record<LoginMethodKind, string> = {
    phone: messages.loginMethods.kindPhone,
    email: messages.loginMethods.kindEmail,
    google: messages.loginMethods.kindGoogle,
  };

  return labels[kind];
}
