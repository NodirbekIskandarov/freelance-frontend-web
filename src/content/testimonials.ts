import type { Locale } from '@/i18n/config';

/**
 * Bosh sahifadagi sharhlar — HOZIRCHA VERSTKA.
 *
 * Bular haqiqiy sharhlar EMAS, dizayn namunasi. Ular shu faylda turadi
 * va bitta joydan o'qiladi, chunki ulanish payti kelganda almashtirish
 * kerak bo'ladigan joy ham shu: backend allaqachon haqiqiy sharhlarni
 * beradi (`/landing/highlights/` javobidagi `reviews` va `rating`) —
 * sharh yozish faqat sotib olgan odamga ruxsat etilgan, ya'ni
 * «Xarid tasdiqlangan» belgisi u yerda qoida bo'ladi.
 */
export interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  author: string;
  university: string;
  course: number;
}

export interface TestimonialSummary {
  average: number;
  count: number;
}

const UZ: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    comment:
      "Kechqurun kerak bo'lib qoldi, 10 daqiqada 7-variantni topib yukladim. Ilova qilingan SQL fayllari ham to'g'ri ishladi.",
    author: 'Jasurbek J.',
    university: 'TATU',
    course: 2,
  },
  {
    id: '2',
    rating: 5,
    comment:
      "Bir variantda 3 xil yechim bor edi — reytingi balandini oldim. Preview bo'lgani uchun pul sarflashdan oldin ko'rdim.",
    author: 'Madina K.',
    university: 'SamDU',
    course: 1,
  },
  {
    id: '3',
    rating: 5,
    comment:
      "O'zim ham 4 ta yechim yukladim, shu oyda balansga tushdi. Konspektdan ko'ra bu tezroq daromad.",
    author: 'Sardor A.',
    university: 'TDIU',
    course: 3,
  },
];

const RU: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    comment:
      'Понадобилось вечером — за 10 минут нашёл и скачал 7-й вариант. Приложенные SQL-файлы тоже отработали.',
    author: 'Жасурбек Ж.',
    university: 'ТАТУ',
    course: 2,
  },
  {
    id: '2',
    rating: 5,
    comment:
      'На один вариант было 3 разных решения — взяла с высоким рейтингом. Предпросмотр позволил посмотреть до оплаты.',
    author: 'Мадина К.',
    university: 'СамГУ',
    course: 1,
  },
  {
    id: '3',
    rating: 5,
    comment:
      'Сам загрузил 4 решения, в этом месяце пришло на баланс. Это быстрее, чем писать конспекты.',
    author: 'Сардор А.',
    university: 'ТГЭУ',
    course: 3,
  },
];

/** Namuna umumiy baho — sharhlar bilan bir xil manbadan. */
export const TESTIMONIAL_SUMMARY: TestimonialSummary = { average: 4.8, count: 1240 };

export function testimonials(locale: Locale): Testimonial[] {
  return locale === 'ru' ? RU : UZ;
}
