/**
 * Nomlarni alifbo bo'yicha solishtirish — SERVER VA BRAUZERDA BIR XIL.
 *
 * `localeCompare(b, 'uz')` ISHLATILMAYDI, garchi u to'g'ri ko'rinsa ham.
 * Sabab tekshirilgan: o'zbek tili uchun ICU ma'lumoti muhitga qarab farq
 * qiladi.
 *
 *     Node     : ["O'zMU", 'UrDU'].sort(uz) → ['UrDU', "O'zMU"]
 *     Chromium : ["O'zMU", 'UrDU'].sort(uz) → ["O'zMU", 'UrDU']
 *
 * Sahifa serverda chizilib brauzerda hydration qilinadi, ya'ni bu farq
 * ro'yxatni ikki xil tartibda joylashtirardi va React «server rendered
 * text didn't match» deb BUTUN daraxtni qaytadan chizardi — har ochilishda.
 * Sanalarda ham aynan shu tarzda ushlangan xato bor edi (`format.ts`).
 *
 * Shuning uchun tartib qo'lda belgilanadi:
 *  — apostroflar tashlanadi (`oʻ`, `o'`, `o’` — bitta harf, uchta yozuv),
 *  — katta-kichik farqi olib tashlanadi,
 *  — qolgani kod nuqtalari bo'yicha solishtiriladi.
 *
 * Natija ikkala muhitda ham bir xil va o'zbek o'quvchisi kutgan tartibga
 * mos: «O'zMU» O harfida, «UrDU» dan oldin turadi.
 */

/** `'` (U+0027), `’` (U+2019), `ʻ` (U+02BB), `` ` `` — bitta belgining nusxalari. */
const APOSTROPHES = /['‘’ʻʼ`]/g;

function key(value: string): string {
  return value.replace(APOSTROPHES, '').toUpperCase();
}

export function compareNames(a: string, b: string): number {
  const left = key(a);
  const right = key(b);
  if (left === right) return 0;
  return left < right ? -1 : 1;
}
