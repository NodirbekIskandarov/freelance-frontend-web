export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

/**
 * Savol-javob mazmuni — bitta manba.
 *
 * Bosh sahifa birinchi guruhni ko'rsatadi, `/faq` esa hammasini. Ilgari
 * ro'yxat komponent ichida edi; alohida chiqarilgani uchun endi
 * ikkalasi ham, `FAQPage` JSON-LD ham bir xil matnni ishlatadi va
 * ular bir-biridan uzoqlashib qololmaydi.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Boshlash',
    items: [
      {
        q: 'Topshiriq qanday joylanadi?',
        a: "Saytda ro'yxatdan o'ting, topshiriq ma'lumotlarini va talablaringizni kiriting, so'ngra freelancer tanlang yoki tayyor material qidiring.",
      },
      {
        q: "To'lovlar qanday amalga oshiriladi?",
        a: "Hozircha karta orqali manual to'lov mavjud. To'lov qilgach, chek skrinshotini yuklaysiz va admin tasdiqlagach xizmat ochiladi.",
      },
      {
        q: 'Topshiriq bajarilmasa-chi?',
        a: "Agar ish belgilangan muddatda bajarilmasa yoki sifat talabga javob bermasa, qo'llab-quvvatlash jamoasi masalani ko'rib chiqadi va yechim taklif qiladi.",
      },
      {
        q: 'Qanday kafolat berasiz?',
        a: "Barcha ishlar AI va ekspertlar tomonidan tekshiriladi. To'lovlar himoyalangan, muammo bo'lsa pul qaytarish yoki qayta bajarish imkoniyati mavjud.",
      },
    ],
  },
  {
    title: 'Tayyor materiallar',
    items: [
      {
        q: 'Tayyor material bilan freelancer xizmati nima farqi bor?',
        a: "Tayyor material — allaqachon bajarilgan va tekshirilgan ish, uni darhol yuklab olasiz. Freelancer xizmati esa sizning talabingiz bo'yicha noldan bajariladi va ko'proq vaqt oladi.",
      },
      {
        q: 'Material sotib olgandan keyin qancha vaqt mavjud bo‘ladi?',
        a: "Sotib olingan material kabinetingizdagi «Yuklamalar» bo'limida muddatsiz saqlanadi — istalgan vaqtda qayta yuklab olishingiz mumkin.",
      },
      {
        q: 'Mening universitetim ro‘yxatda yo‘q, nima qilay?',
        a: "Katalog doimiy to'ldirib boriladi. Universitetingiz hali qo'shilmagan bo'lsa, birjaga topshiriq joylang — freelancerlar uni bevosita bajarib beradi.",
      },
    ],
  },
  {
    title: 'Freelancerlar uchun',
    items: [
      {
        q: 'Freelancer bo‘lish uchun nima kerak?',
        a: "Shaxsiy ma'lumotlar, hujjat raqami va mutaxassisligingiz haqidagi arizani to'ldirasiz. Ariza 1–3 ish kunida admin tomonidan tekshiriladi.",
      },
      {
        q: 'Platforma qancha komissiya oladi?',
        a: "Komissiya 10% ni tashkil qiladi va u shartnoma summasidan ushlanadi. Kabinetdagi «Daromad» bo'limida qo'lingizga tegadigan aniq summa ko'rsatiladi.",
      },
      {
        q: 'To‘lov qachon tushadi?',
        a: "Talaba to'lovni amalga oshirgach summa platformada saqlanadi. Ish topshirilib, talaba uni qabul qilgandan keyin mablag' balansingizga o'tadi.",
      },
    ],
  },
];

/** Bosh sahifada qisqartirilgan ro'yxat — birinchi guruh. */
export const LANDING_FAQ = FAQ_GROUPS[0]!.items;

export const ALL_FAQ_ITEMS = FAQ_GROUPS.flatMap((group) => group.items);

/** Google "Rich Results" (savol-javob akkordeoni qidiruv natijasida) uchun. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
