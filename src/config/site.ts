/**
 * Sayt konfiguratsiyasi — SEO metadata, sitemap va JSON-LD shu yerdan
 * o'qiydi. Bitta joyda o'zgartirilsa hamma joyda yangilanadi.
 */
export const siteConfig = {
  name: 'Yopamiz.uz',
  title: 'Yopamiz.uz — Talabalar uchun xizmatlar bozori',
  description:
    'Universitet topshiriqlari, konspekt, chizmachilik, spravka va diplom ishlari uchun ishonchli platforma. 50 000+ tayyor material, tekshirilgan freelancerlar.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  locale: 'uz_UZ',
  keywords: [
    'yopamiz',
    'tayyor topshiriqlar',
    'talabalar uchun material',
    'konspekt yozdirish',
    'freelancer topish',
    'diplom ishi',
    "O'zbekiston talabalar platformasi",
  ],
  social: {
    telegram: 'https://t.me/yopamiz_uz',
  },
  contact: {
    phone: '+998901234567',
    email: 'support@yopamiz.uz',
    address: "Toshkent, O'zbekiston",
  },
  /**
   * Yordam kanallari — bitta joyda.
   *
   * Ish vaqti API'da yo'q (u operator jadvalining o'zi, mahsulot qoidasi
   * emas), shuning uchun front tomonda turadi. Bitta konstantada:
   * jadval o'zgarsa sayt bo'ylab bir necha joyda qidirish kerak
   * bo'lmasin.
   */
  support: {
    telegram: 'https://t.me/yopamiz_support',
    telegramHandle: '@yopamiz_support',
    hours: '09:00–23:00',
  },
} as const;
