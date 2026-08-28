import type { Locale } from '@/i18n/config';

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
const FAQ_GROUPS_UZ: FaqGroup[] = [
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

const FAQ_GROUPS_RU: FaqGroup[] = [
  {
    title: 'Начало работы',
    items: [
      {
        q: 'Как разместить задание?',
        a: 'Зарегистрируйтесь на сайте, укажите данные задания и свои требования, затем выберите фрилансера или найдите готовый материал.',
      },
      {
        q: 'Как проходит оплата?',
        a: 'Пока доступна ручная оплата картой. После оплаты вы загружаете скриншот чека, и услуга открывается сразу после подтверждения администратором.',
      },
      {
        q: 'А если задание не будет выполнено?',
        a: 'Если работа не сдана в срок или качество не соответствует требованиям, служба поддержки рассмотрит обращение и предложит решение.',
      },
      {
        q: 'Какие гарантии вы даёте?',
        a: 'Все работы проверяются ИИ и экспертами. Платежи защищены: при проблеме возможен возврат средств или повторное выполнение.',
      },
    ],
  },
  {
    title: 'Готовые материалы',
    items: [
      {
        q: 'Чем готовый материал отличается от услуги фрилансера?',
        a: 'Готовый материал — уже выполненная и проверенная работа, её можно скачать сразу. Услуга фрилансера выполняется с нуля по вашим требованиям и занимает больше времени.',
      },
      {
        q: 'Сколько времени доступен купленный материал?',
        a: 'Купленный материал хранится в разделе «Загрузки» вашего кабинета бессрочно — скачать его повторно можно в любой момент.',
      },
      {
        q: 'Моего университета нет в списке, что делать?',
        a: 'Каталог постоянно пополняется. Если вашего вуза ещё нет, разместите задание на бирже — фрилансеры выполнят его напрямую.',
      },
    ],
  },
  {
    title: 'Фрилансерам',
    items: [
      {
        q: 'Что нужно, чтобы стать фрилансером?',
        a: 'Заполните заявку с личными данными, номером документа и специальностью. Заявку проверяет администратор в течение 1–3 рабочих дней.',
      },
      {
        q: 'Какую комиссию берёт платформа?',
        a: 'Комиссия составляет 10% и удерживается из суммы договора. Точная сумма к выплате показана в разделе «Доход» вашего кабинета.',
      },
      {
        q: 'Когда поступит оплата?',
        a: 'После оплаты студентом сумма хранится на платформе. Как только работа сдана и принята студентом, деньги переводятся на ваш баланс.',
      },
    ],
  },
];

/**
 * Til bo'yicha savol-javob.
 *
 * Matn TARJIMA LUG'ATIDA emas, shu yerda: bu uzun mazmun va uni
 * interfeys yorliqlari bilan bir joyda saqlash lug'atni o'qib
 * bo'lmaydigan qilib qo'yardi. Tuzilma esa bir xil.
 */
const FAQ_BY_LOCALE: Record<Locale, FaqGroup[]> = {
  uz: FAQ_GROUPS_UZ,
  ru: FAQ_GROUPS_RU,
};

export function faqGroups(locale: Locale): FaqGroup[] {
  return FAQ_BY_LOCALE[locale] ?? FAQ_GROUPS_UZ;
}

/** Bosh sahifada qisqartirilgan ro'yxat — birinchi guruh. */
export function landingFaq(locale: Locale): FaqItem[] {
  return faqGroups(locale)[0]!.items;
}

export function allFaqItems(locale: Locale): FaqItem[] {
  return faqGroups(locale).flatMap((group) => group.items);
}

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
