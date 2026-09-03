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
  return `${formatCount(value)} ${currency}`;
}

/**
 * 4210 → «4 210» — sanoq, valyutasiz.
 *
 * Ajratgich `formatSom` bilan bir xil: bitta sahifada «4 210 ta fan» va
 * «4210 ta variant» yonma-yon turgani xatoga o'xshab ko'rinardi.
 *
 * Ajratgich ODDIY probelga almashtiriladi. Ikki sabab: nusxa olganda
 * ko'rinmas belgi ergashmaydi, va — muhimrogʻi — `ru-RU` qaysi belgini
 * qo'yishi ICU versiyasiga bogʻliq (Node uzilmas probel, brauzer esa tor
 * uzilmas probel berishi mumkin). Ikkalasini ham bir xil holga keltirmasa,
 * server chizgan matn brauzernikiga mos kelmay hydration ogohlantirishi
 * chiqardi.
 */
export function formatCount(value: number): string {
  return value.toLocaleString('ru-RU').replace(/[\u00a0\u202f ]/g, ' ');
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
 * Ko'rinish ikkala tilda ham BIR XIL — `28.08.2026` — va u qo'lda
 * yig'iladi, `Intl` ning tayyor namunasidan olinmaydi.
 *
 * Sababi tekshirilgan: `uz-UZ` uchun ICU namunasi muhitga qarab farq
 * qiladi. Node (to'liq ICU) `26/08/2026` beradi, Chromium esa
 * `2026-08-26`. Sahifa serverda chizilib brauzerda hydration qilinadi,
 * ya'ni bu farq HAR SAFAR «server rendered text didn't match» xatosini
 * chiqarardi va React butun daraxtni qaytadan chizardi. `ru-RU` da
 * ikkala muhit ham `26.08.2026` beradi — shu ko'rinish ikkalasiga
 * qoldirildi.
 *
 * `Intl` baribir kerak: mintaqa hisobini (`Asia/Tashkent`) o'zi qiladi.
 * Undan faqat RAQAMLAR olinadi, tartib va ajratgich bizniki.
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

/**
 * Sana bo'laklari — raqam sifatida.
 *
 * `en-GB` ATAYLAB: bizga uning namunasi emas, faqat lotin raqamlari va
 * ikki xonali to'ldirish kerak. Til qaysi bo'lishidan qat'i nazar
 * natija bir xil bo'ladi.
 */
function partsOf(date: Date, options: Intl.DateTimeFormatOptions): Record<string, string> {
  const found: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat('en-GB', options).formatToParts(date)) {
    found[part.type] = part.value;
  }
  return found;
}

function parse(value: string | null | undefined): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `28.08.2026` */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = parse(value);
  // Noto'g'ri qiymatni "Invalid Date" qilib ko'rsatishdan ko'ra xom
  // holicha qaytargan tushunarliroq — hech bo'lmasa nima kelganini
  // ko'rish mumkin.
  if (!date) return value;

  const part = partsOf(date, DATE_OPTIONS);
  return `${part.day}.${part.month}.${part.year}`;
}

/** `28.08.2026, 14:26` */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';

  const date = parse(value);
  if (!date) return value;

  const part = partsOf(date, DATE_TIME_OPTIONS);
  return `${part.day}.${part.month}.${part.year}, ${part.hour}:${part.minute}`;
}

/**
 * `+998901234567` → `+998 90 123 45 67`.
 *
 * Ko'rsatish uchun — saqlash va `tel:` havolasi uchun raqam har doim
 * probelsiz shaklda qoladi. Ilgari ajratilgan ko'rinish footerga qo'lda
 * yozib qo'yilgan edi va konfiguratsiyadagi raqam o'zgarsa sayt ikkita
 * boshqa-boshqa raqam ko'rsatardi.
 */
export function formatPhone(phone: string): string {
  const match = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone.replace(/\s/g, ''));
  if (!match) return phone;

  return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
}
