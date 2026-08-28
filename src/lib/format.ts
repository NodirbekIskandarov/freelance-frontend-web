/**
 * 125000 → "125 000 so'm" (ruschada "125 000 сум").
 *
 * Valyuta so'zi PARAMETR: u yagona tarjima qilinadigan qism va uni shu
 * yerda qat'iy yozib qo'yish rus tilidagi sahifada ham o'zbekcha
 * chiqarardi. Mijoz komponentlarida `useMoney()` uni lug'atdan oladi.
 *
 * `ru-RU` ming ajratgichi sifatida uzilmas probel (U+00A0) qo'yadi.
 * Uni oddiy probelga almashtiramiz: aks holda matn nusxalanganda
 * ko'rinmas belgi ergashadi va qidiruvda mos kelmay qoladi.
 */
export function formatSom(value: number, currency = "so'm"): string {
  return `${value.toLocaleString('ru-RU').replace(/ /g, ' ')} ${currency}`;
}

/**
 * DRF `DecimalField` satrini o'qiladigan pul ko'rinishiga o'tkazadi:
 * `"7310.00"` → `"7 310 so'm"`.
 *
 * Satr `Number`ga faqat KO'RSATISH uchun o'tkaziladi — hisob-kitob va
 * API'ga qaytarish har doim satr ustida bo'ladi, aks holda katta
 * summalarda float aniqligi yo'qoladi.
 */
export function formatDecimalSom(value: string | null, currency = "so'm"): string {
  if (value === null || value.trim() === '') return '—';

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;

  return formatSom(parsed, currency);
}

/**
 * Sanalar.
 *
 * Vaqt mintaqasi ATAYLAB qat'iy — `Asia/Tashkent`. Ikki sabab:
 *
 *  1. Katalog sahifalari build paytida statik chiziladi. Serverning
 *     mintaqasi tashrif buyuruvchinikidan farq qilsa, React hydration
 *     paytida ikki xil matn ko'rib ogohlantirish berardi va sana bir
 *     lahzaga sakrab o'zgarardi.
 *  2. Bu sanalar biznes sanasi ("qachon yuklangan"), tashrif
 *     buyuruvchining mahalliy soati emas. Platforma O'zbekiston uchun.
 *
 * Ajratgichni til hal qiladi: o'zbekchada `28/08/2026`, ruschada
 * `28.08.2026`.
 */
const TIME_ZONE = 'Asia/Tashkent';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: TIME_ZONE,
};

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTIONS,
  hour: '2-digit',
  minute: '2-digit',
};

function format(
  value: string | null | undefined,
  tag: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!value) return '—';

  const date = new Date(value);
  // Noto'g'ri qiymatni "Invalid Date" qilib ko'rsatishdan ko'ra xom
  // holicha qaytargan tushunarliroq — hech bo'lmasa nima kelganini
  // ko'rish mumkin.
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(tag, options).format(date);
}

/** `28.08.2026` */
export function formatDate(value: string | null | undefined, tag: string): string {
  return format(value, tag, DATE_OPTIONS);
}

/** `28.08.2026, 14:26` */
export function formatDateTime(value: string | null | undefined, tag: string): string {
  return format(value, tag, DATE_TIME_OPTIONS);
}
