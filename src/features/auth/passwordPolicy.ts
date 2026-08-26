/**
 * Parol talablari.
 *
 * Backend ham shu qoidalarni tekshiradi — bu yerdagisi UI uchun: xatoni
 * so'rov yuborilgunicha, foydalanuvchi yozayotgan paytda ko'rsatish.
 * Ya'ni bu tekshiruv XAVFSIZLIK CHORASI EMAS, faqat qulaylik.
 */

export type PasswordValidation = {
  valid: boolean;
  errors: string[];
  checks: {
    minLength: boolean;
    hasLetter: boolean;
    hasDigit: boolean;
  };
};

const MIN_LENGTH = 8;

export const PASSWORD_RULES = [
  'Kamida 8 ta belgi',
  'Kamida 1 ta harf (a-z yoki A-Z)',
  'Kamida 1 ta raqam (0-9)',
] as const;

export function validatePassword(password: string): PasswordValidation {
  const checks = {
    minLength: password.length >= MIN_LENGTH,
    // Kirill ham hisobga olinadi: ism-familiyasini kirillda yozadigan
    // foydalanuvchi parolni ham shunday tanlashi mumkin.
    hasLetter: /[a-zA-ZЀ-ӿ]/.test(password),
    hasDigit: /\d/.test(password),
  };

  const errors: string[] = [];
  if (!checks.minLength) errors.push("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
  if (!checks.hasLetter) errors.push("Parolda kamida bitta harf bo'lishi kerak");
  if (!checks.hasDigit) errors.push("Parolda kamida bitta raqam bo'lishi kerak");

  return {
    valid: checks.minLength && checks.hasLetter && checks.hasDigit,
    errors,
    checks,
  };
}
