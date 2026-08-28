/**
 * `{name}` o'rniga qiymat qo'yish.
 *
 * Ataylab eng sodda shakl: sonlar, jinslar va ko'plik shakllari uchun
 * to'liq ICU sintaksisi kerak emas — bu yerda «{year}», «{count}» kabi
 * oddiy o'rinbosarlar ishlatiladi, murakkab holatlar esa matnni ikkiga
 * bo'lish bilan hal qilinadi.
 */
export function interpolate(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;

  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
