/**
 * Parol talablari.
 *
 * Backend ham shu qoidalarni tekshiradi — bu yerdagisi UI uchun: xatoni
 * so'rov yuborilgunicha, foydalanuvchi yozayotgan paytda ko'rsatish.
 * Ya'ni bu tekshiruv XAVFSIZLIK CHORASI EMAS, faqat qulaylik.
 *
 * Bu yerda MATN yo'q: qaysi qoida buzilgani qaytariladi, uni tilga
 * o'girish esa chizadigan komponentning ishi. Ilgari o'zbekcha jumlalar
 * shu faylda turardi va rus tilida ham o'zbekcha chiqardi.
 */

export type PasswordRule = 'minLength' | 'hasLetter' | 'hasDigit';

export type PasswordValidation = {
  valid: boolean;
  /** Buzilgan qoidalar — birinchisi eng muhimi. */
  failed: PasswordRule[];
  checks: Record<PasswordRule, boolean>;
};

const MIN_LENGTH = 8;

export function validatePassword(password: string): PasswordValidation {
  const checks: Record<PasswordRule, boolean> = {
    minLength: password.length >= MIN_LENGTH,
    // Kirill ham hisobga olinadi: ism-familiyasini kirillda yozadigan
    // foydalanuvchi parolni ham shunday tanlashi mumkin.
    hasLetter: /[a-zA-ZЀ-ӿ]/.test(password),
    hasDigit: /\d/.test(password),
  };

  const failed = (Object.keys(checks) as PasswordRule[]).filter((rule) => !checks[rule]);

  return { valid: failed.length === 0, failed, checks };
}
