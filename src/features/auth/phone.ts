/** O'zbekiston raqamining milliy qismi — 9 ta raqam (`901112233`). */
const NATIONAL_LENGTH = 9;

/**
 * Maydonga yozilganidan backend kutadigan shaklga (`+998901112233`).
 *
 * Foydalanuvchi bo'sh joy, qavs yoki to'liq raqamni ham yozib qo'yishi
 * mumkin — oldin maydonga nima yozilsa, o'sha holicha yuborilardi.
 * Shuning uchun raqamdan boshqa hamma narsa tashlanadi va oldidagi
 * ortiqcha `998` olib tashlanadi.
 */
export function toApiPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const national = digits.startsWith('998') ? digits.slice(3) : digits;
  return `+998${national.slice(0, NATIONAL_LENGTH)}`;
}

/** Maydonda ko'rsatish uchun — faqat milliy qismning raqamlari. */
export function toNationalDigits(input: string): string {
  const digits = input.replace(/\D/g, '');
  const national = digits.startsWith('998') ? digits.slice(3) : digits;
  return national.slice(0, NATIONAL_LENGTH);
}

export function isCompletePhone(input: string): boolean {
  return toNationalDigits(input).length === NATIONAL_LENGTH;
}
