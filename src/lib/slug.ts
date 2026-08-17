/**
 * Manzil segmentlari.
 *
 * Backend fan va topshiriqqa slug bermaydi — faqat UUID. Toza UUID
 * manzili ("/materials/970b6752-.../f70378ae-...") o'qilmaydi va SEO
 * uchun qiymatsiz. Shuning uchun segment "nom-qisqaID" ko'rinishida
 * yasaladi:
 *
 *   suniy-intellektga-kirish-f70378ae
 *
 * Bu ko'rinish uchta muammoni bir yo'la yopadi: manzil o'qiladi,
 * qidiruv tizimi kalit so'zlarni ko'radi, va yozuv nomi o'zgarsa ham
 * havola ishlayveradi — chunki qidiruv ID bo'yicha boradi, nom bo'yicha
 * emas.
 */

const ID_LENGTH = 8;

const TRANSLITERATION: Record<string, string> = {
  ʻ: '',
  ʼ: '',
  '‘': '',
  '’': '',
  "'": '',
  ъ: '',
  ь: '',
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'x',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sh',
  ы: 'i',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  қ: 'q',
  ғ: 'g',
  ҳ: 'h',
};

/** "Suniy intellektga kirish" → "suniy-intellektga-kirish". */
export function toSlug(value: string): string {
  return (
    value
      .toLowerCase()
      .split('')
      .map((char) => TRANSLITERATION[char] ?? char)
      .join('')
      .normalize('NFD')
      // Diakritik belgilarni olib tashlaymiz: "ó" → "o".
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

/** Nom va UUID'dan manzil segmenti yasaydi. */
export function toSlugId(name: string, id: string): string {
  const slug = toSlug(name);
  const shortId = id.replace(/-/g, '').slice(0, ID_LENGTH);
  return slug ? `${slug}-${shortId}` : shortId;
}

/**
 * Segmentdan qisqa ID'ni ajratadi.
 *
 * To'liq UUID qaytarilmaydi — qisqartma bo'yicha ro'yxatdan qidiriladi.
 * 8 belgilik prefiks bitta fan yoki topshiriq doirasida to'qnashuvi
 * amalda ehtimoldan yiroq (~4 mlrd variant).
 */
export function shortIdFromSlug(segment: string): string | null {
  const match = /([0-9a-f]{8})$/i.exec(segment);
  return match ? match[1]!.toLowerCase() : null;
}

/** Yozuvni segmentdagi qisqa ID bo'yicha topadi. */
export function findBySlugId<T extends { id: string }>(items: T[], segment: string): T | null {
  const shortId = shortIdFromSlug(segment);
  if (!shortId) return null;

  return items.find((item) => item.id.replace(/-/g, '').startsWith(shortId)) ?? null;
}
