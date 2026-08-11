/**
 * 125000 → "125 000 so'm".
 *
 * `ru-RU` ming ajratgichi sifatida uzilmas probel (U+00A0) qo'yadi.
 * Uni oddiy probelga almashtiramiz: aks holda matn nusxalanganda
 * ko'rinmas belgi ergashadi va qidiruvda mos kelmay qoladi.
 */
export function formatSom(value: number): string {
  return `${value.toLocaleString('ru-RU').replace(/ /g, ' ')} so'm`;
}
