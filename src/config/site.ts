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
} as const;
