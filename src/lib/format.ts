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
