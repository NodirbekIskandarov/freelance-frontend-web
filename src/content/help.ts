import type { Locale } from '@/i18n/config';

/**
 * Yordam markazi mazmuni — bitta manba.
 *
 * Sahifa, qidiruv va `FAQPage` JSON-LD shu yerdan o'qiydi, ya'ni ular
 * bir-biridan uzoqlashib qololmaydi.
 *
 * Matn ichidagi `{...}` o'rinbosarlar SERVERDAN keladigan shartlar bilan
 * to'ldiriladi (`/support/terms/`). Ular matnga yozib qo'yilmaydi:
 * shikoyat oynasi operator sozlamasi va sahifaga qo'lda "24 soat" deb
 * yozilsa, sayt server rost qabul qiladigan muddatdan ancha kamini
 * va'da qilib, haqli odamni shikoyatdan qaytarardi.
 */

export interface HelpItem {
  q: string;
  a: string;
  /** Ketma-ket qadamlar — javob ostidagi raqamlangan ro'yxat. */
  steps?: string[];
  /** Javobdan keyingi amal — o'sha ishni bajaradigan sahifa. */
  link?: { label: string; href: string };
}

export interface HelpSection {
  /** Manzildagi va yon menyudagi kalit. */
  id: string;
  title: string;
  lead: string;
  items: HelpItem[];
}

/**
 * Matndagi o'rinbosarlar uchun tayyor qiymatlar.
 *
 * Bo'laklar («…tushadi») ham shu yerda: mukofot o'chirilgan bo'lsa
 * (`0`) butun gap tushib qolishi kerak, aks holda sahifa hech kim
 * yoqmagan pulni va'da qilardi.
 */
export interface HelpFacts {
  disputeWindow: string;
  authorHours: string;
  evidenceLimit: string;
  maxSolutions: string;
  minWithdrawal: string;
  openAppeals: string;
  attachmentLimit: string;
  /** «— tasdiqlansa 15 000 so'm tushadi» yoki bo'sh satr. */
  subjectRewardClause: string;
  assignmentRewardClause: string;
  /** Mukofotlar haqidagi to'liq gap yoki mukofotsiz muqobili. */
  rewardSentence: string;
}

const HELP_UZ: HelpSection[] = [
  {
    id: 'start',
    title: 'Boshlash',
    lead: 'Platformada birinchi qadamlar va asosiy tushunchalar.',
    items: [
      {
        q: 'Kerakli topshiriqni qanday topaman?',
        a: "Yo'l doim bir xil: universitet → fan → topshiriq → variant. «Tayyor materiallar» bo'limida institutingizni tanlaysiz, fanlar ro'yxatidan kurs va semestr bo'yicha filtrlaysiz, fan ichida esa topshiriqlar turlari bo'yicha ajratilgan.",
        steps: [
          'Institutingizni tanlang yoki qidiruvga fan nomini yozing',
          'Fan ichidan kerakli topshiriq turini oching',
          "O'z variantingiz raqamini bosing — yechimlar ro'yxati chiqadi",
        ],
        link: { label: "Tayyor materiallarni ko'rish", href: '/materials' },
      },
      {
        q: 'Variantli va variantsiz topshiriq nimasi bilan farq qiladi?',
        a: "Variantli topshiriqda har bir talabaga alohida shart beriladi va siz faqat o'z raqamingizni ochasiz. Variantsiz topshiriq hammaga bir xil bo'ladi — u tizimda bitta umumiy variant sifatida turadi.",
      },
      {
        q: "Mening universitetim ro'yxatda yo'q, nima qilay?",
        a: "Katalogning o'zidan institut qo'shish so'rovini yuborasiz. Moderator tasdiqlagandan keyin o'sha institutga fan va topshiriq qo'shish mumkin bo'ladi.",
        link: { label: "Institut qo'shish so'rovi", href: '/materials' },
      },
      {
        q: "Fan bor, lekin topshiriq yuklanmagan bo'lsa?",
        a: "Fan sahifasida «Topshiriq yuklash» tugmasi bor: shart faylini va nechta variant borligini kiritasiz. Moderator tasdiqlagach topshiriq katalogga qo'shiladi va unga yechim yuklash imkoni ochiladi{assignmentRewardClause}.",
      },
    ],
  },
  {
    id: 'buying',
    title: "Sotib olish va to'lov",
    lead: "Yechim tanlash, to'lov va yuklab olish.",
    items: [
      {
        q: "To'lov qanday amalga oshiriladi?",
        a: "Hozircha barcha xaridlar ichki balans orqali: balansni to'ldirasiz va undan yechim sotib olasiz. To'lov tizimlari orqali to'ldirish ulanish jarayonida.",
        steps: [
          "Balansni to'ldiring",
          'Yechimni tanlab «Sotib olish»ni bosing',
          'Fayl darhol «Kutubxonam»ga tushadi',
        ],
      },
      {
        q: "Bir variantda bir nechta yechim bo'lsa qaysi birini olaman?",
        a: "Hammasi ko'rinadi — muallif, reyting, sotuv soni va narxi bilan. Bepul preview orqali ichini ko'rib solishtirasiz. «Rasmiy» yechim degan tushuncha yo'q: tanlov sizda.",
      },
      {
        q: 'Sotib olgan fayl qancha vaqt menda qoladi?',
        a: "Muddatsiz. «Kutubxonam» bo'limida saqlanadi va cheksiz marta yuklab olasiz — yechim keyinchalik sotuvdan olinsa ham sizdagi nusxa qoladi.",
      },
      {
        q: "Kerakli variantda yechim yo'q bo'lsa?",
        a: "«So'rov qoldirish» bosasiz. So'rovlar variant ostida yig'iladi va yechim yozadiganlarga ko'rinadi — talab qancha ko'p bo'lsa, variant shuncha tez javob oladi. Yechim paydo bo'lganda so'ragan hammaga xabar boradi.",
      },
    ],
  },
  {
    id: 'guarantee',
    title: 'Kafolat va shikoyat',
    lead: 'Pulni qaytarish, nizolar va sifat nazorati.',
    items: [
      {
        q: 'Yechim topshiriq shartiga mos kelmasa nima bo’ladi?',
        a: "Xariddan keyin {disputeWindow} ichida shikoyat qoldirasiz. Shikoyat kelishi bilan muallif ulushi muzlatiladi — ya'ni pul hali hech kimga chiqib ketmagan bo'ladi.",
        steps: [
          '«Kutubxonam» → xarid qatoridagi «Shikoyat» tugmasi',
          'Sabab, izoh va dalil ({evidenceLimit} tagacha fayl) yuborasiz',
          'Muallifga {authorHours} javob berish vaqti beriladi',
          'Moderator qaror qiladi',
        ],
        link: { label: 'Kafolat shartlari', href: '/legal' },
      },
      {
        q: 'Moderator qanday qaror chiqarishi mumkin?',
        a: "To'rt variant: pulni to'liq qaytarish, yarmini qaytarish, muallifning tuzatilgan fayli bilan almashtirish yoki shikoyatni rad etish. Qaytarilgan summa balansingizga tushadi.",
      },
      {
        q: 'Muallif shikoyatga javob bermasa nima bo’ladi?',
        a: "{authorHours} o'tgach moderator muallifsiz ham qaror chiqaradi. Javobsiz qolgan shikoyat cheksiz kutib turmaydi.",
      },
      {
        q: 'Shikoyat muddati o’tib ketsa-chi?',
        a: "Muddat o'tgach sotuv yakunlanadi va muallif ulushini oladi — shuning uchun faylni yuklab olganingizdan keyin darhol ko'rib chiqing. Boshqa savol bo'lsa operatorga murojaat qoldirishingiz mumkin.",
      },
    ],
  },
  {
    id: 'selling',
    title: 'Yechim sotish',
    lead: "Muallif bo'lish, narx belgilash va daromad.",
    items: [
      {
        q: 'Yechim yuklab qancha daromad qilaman?',
        a: "Narxni o'zingiz taklif qilasiz, moderator tasdiqlaydi yoki tuzatadi. Platforma ulushi har bir yechim uchun alohida belgilanadi va u sotuvga chiqqanda ko'rinadi. Bitta yechim cheksiz marta sotiladi.",
        steps: [
          "Bo'sh variantni tanlab yechim faylini yuklaysiz",
          'Narx taklif qilasiz',
          "Moderatsiyadan o'tgach sotuvga chiqadi",
          'Har sotuvdan ulushingiz hisobga tushadi',
        ],
      },
      {
        q: "Pulni qachon yechib olsam bo'ladi?",
        a: "Har bir sotuv {disputeWindow} kafolat hisobida turadi — shikoyat oynasi yopilgach summa balansga o'tadi. Eng kam yechib olish summasi — {minWithdrawal}.",
      },
      {
        q: 'Yechimim rad etilsa nima qilaman?',
        a: "Rad sababi ko'rsatiladi. Tuzatib qayta yuborasiz — bitta variantga {maxSolutions} tagacha yechim yuborish mumkin.",
      },
      {
        q: 'Yechimdan tashqari nimadan pul ishlash mumkin?',
        a: "Katalogni to'ldirish uchun ariza qoldirasiz: yangi fan, topshiriq yoki institut. {rewardSentence}",
        link: { label: 'Daromad qoidalari', href: '/legal' },
      },
    ],
  },
  {
    id: 'account',
    title: 'Hisob va maxfiylik',
    lead: 'Kirish usullari, ma’lumotlar va murojaatlar.',
    items: [
      {
        q: 'Telefon orqali kiraman — emailni ham bog’lasam bo’ladimi?',
        a: "Ha. Profilda kirish usullarini boshqarasiz: telefon, email va Google. Kamida bittasi doim qolishi kerak, aks holda hisobga kirish yo'li yopilardi.",
      },
      {
        q: "Ma'lumotlarim kimga ko'rinadi?",
        a: "Yechim sahifasida faqat muallifning ismi va reytingi ko'rinadi. Telefon raqami va email hech qachon ochiq ko'rsatilmaydi.",
      },
      {
        q: 'Murojaatim qancha vaqtda javob oladi?',
        a: "Operator ish vaqtida ko'rib chiqadi va javob profilingizdagi «Murojaatlarim» bo'limida chiqadi. Bir vaqtning o'zida {openAppeals} tagacha javobsiz murojaat qoldirish mumkin.",
      },
    ],
  },
];

const HELP_RU: HelpSection[] = [
  {
    id: 'start',
    title: 'Начало',
    lead: 'Первые шаги на платформе и основные понятия.',
    items: [
      {
        q: 'Как найти нужное задание?',
        a: 'Путь всегда один: вуз → предмет → задание → вариант. В разделе «Готовые материалы» выбираете вуз, фильтруете предметы по курсу и семестру, а внутри предмета задания разделены по типам.',
        steps: [
          'Выберите свой вуз или введите название предмета в поиск',
          'Откройте нужный тип задания внутри предмета',
          'Нажмите номер своего варианта — появится список решений',
        ],
        link: { label: 'Смотреть готовые материалы', href: '/materials' },
      },
      {
        q: 'Чем вариантное задание отличается от безвариантного?',
        a: 'В вариантном задании у каждого студента своё условие, и вы открываете только свой номер. Безвариантное задание одинаково для всех — в системе это один общий вариант.',
      },
      {
        q: 'Моего вуза нет в списке, что делать?',
        a: 'Прямо из каталога отправляете заявку на добавление вуза. После одобрения модератором в этот вуз можно добавлять предметы и задания.',
        link: { label: 'Заявка на добавление вуза', href: '/materials' },
      },
      {
        q: 'Предмет есть, но задание не загружено?',
        a: 'На странице предмета есть кнопка «Загрузить задание»: прикладываете файл условия и указываете количество вариантов. После одобрения задание появится в каталоге и к нему можно будет загружать решения{assignmentRewardClause}.',
      },
    ],
  },
  {
    id: 'buying',
    title: 'Покупка и оплата',
    lead: 'Выбор решения, оплата и скачивание.',
    items: [
      {
        q: 'Как проходит оплата?',
        a: 'Пока все покупки идут через внутренний баланс: пополняете баланс и покупаете с него. Пополнение через платёжные системы в процессе подключения.',
        steps: [
          'Пополните баланс',
          'Выберите решение и нажмите «Купить»',
          'Файл сразу попадает в «Мою библиотеку»',
        ],
      },
      {
        q: 'Если на вариант несколько решений — какое выбрать?',
        a: 'Видно все — с автором, рейтингом, числом продаж и ценой. Бесплатный предпросмотр позволяет сравнить содержимое. «Официального» решения не существует: выбор за вами.',
      },
      {
        q: 'Сколько у меня хранится купленный файл?',
        a: 'Бессрочно. Он лежит в «Моей библиотеке», и скачать его можно сколько угодно раз — даже если решение потом снимут с продажи.',
      },
      {
        q: 'Если на нужный вариант решения нет?',
        a: 'Нажимаете «Оставить запрос». Запросы копятся под вариантом и видны авторам — чем выше спрос, тем быстрее появится решение. Когда оно выйдет, всем запросившим придёт уведомление.',
      },
    ],
  },
  {
    id: 'guarantee',
    title: 'Гарантия и жалобы',
    lead: 'Возврат денег, споры и контроль качества.',
    items: [
      {
        q: 'Что если решение не соответствует условию?',
        a: 'В течение {disputeWindow} после покупки вы оставляете жалобу. С её поступлением доля автора замораживается — деньги ещё никому не ушли.',
        steps: [
          '«Моя библиотека» → кнопка «Жалоба» в строке покупки',
          'Отправляете причину, комментарий и доказательства (до {evidenceLimit} файлов)',
          'Автору даётся {authorHours} на ответ',
          'Модератор принимает решение',
        ],
        link: { label: 'Условия гарантии', href: '/legal' },
      },
      {
        q: 'Какое решение может принять модератор?',
        a: 'Четыре варианта: вернуть деньги полностью, вернуть половину, заменить файл исправленным от автора или отклонить жалобу. Возвращённая сумма приходит на баланс.',
      },
      {
        q: 'Что если автор не ответит на жалобу?',
        a: 'Через {authorHours} модератор принимает решение и без него. Жалоба без ответа не висит бесконечно.',
      },
      {
        q: 'А если срок жалобы уже прошёл?',
        a: 'После окончания срока продажа закрывается и автор получает свою долю — поэтому просматривайте файл сразу после скачивания. По другим вопросам можно написать оператору.',
      },
    ],
  },
  {
    id: 'selling',
    title: 'Продажа решений',
    lead: 'Как стать автором, цена и доход.',
    items: [
      {
        q: 'Сколько я заработаю на решении?',
        a: 'Цену предлагаете вы, модератор подтверждает или корректирует. Доля платформы задаётся для каждого решения отдельно и видна, когда оно выходит в продажу. Одно решение продаётся неограниченное число раз.',
        steps: [
          'Выбираете свободный вариант и загружаете файл решения',
          'Предлагаете цену',
          'После модерации решение выходит в продажу',
          'С каждой продажи ваша доля попадает на счёт',
        ],
      },
      {
        q: 'Когда можно вывести деньги?',
        a: 'Каждая продажа {disputeWindow} держится на гарантийном счёте — после закрытия окна жалоб сумма переходит на баланс. Минимальная сумма вывода — {minWithdrawal}.',
      },
      {
        q: 'Что делать, если решение отклонили?',
        a: 'Причина отказа указывается. Исправляете и отправляете снова — на один вариант можно отправить до {maxSolutions} решений.',
      },
      {
        q: 'На чём ещё можно заработать, кроме решений?',
        a: 'Можно пополнять каталог заявками: новый предмет, задание или вуз. {rewardSentence}',
        link: { label: 'Правила выплат', href: '/legal' },
      },
    ],
  },
  {
    id: 'account',
    title: 'Аккаунт и приватность',
    lead: 'Способы входа, данные и обращения.',
    items: [
      {
        q: 'Я вхожу по телефону — можно привязать ещё и email?',
        a: 'Да. В профиле вы управляете способами входа: телефон, email и Google. Хотя бы один должен остаться, иначе доступ к аккаунту закрылся бы.',
      },
      {
        q: 'Кому видны мои данные?',
        a: 'На странице решения видны только имя автора и рейтинг. Телефон и email никогда не показываются публично.',
      },
      {
        q: 'Как быстро ответят на обращение?',
        a: 'Оператор разбирает обращения в рабочее время, ответ появляется в разделе «Мои обращения» в профиле. Одновременно можно оставить до {openAppeals} обращений без ответа.',
      },
    ],
  },
];

export function helpSections(locale: Locale): HelpSection[] {
  return locale === 'ru' ? HELP_RU : HELP_UZ;
}

/** `{...}` o'rinbosarlarni serverdan kelgan qiymatlar bilan to'ldiradi. */
export function fillFacts(text: string, facts: HelpFacts): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in facts ? String(facts[key as keyof HelpFacts]) : match,
  );
}

/** Sahifa va JSON-LD uchun — to'ldirilgan holdagi barcha savollar. */
export function resolvedSections(locale: Locale, facts: HelpFacts): HelpSection[] {
  return helpSections(locale).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      a: fillFacts(item.a, facts),
      steps: item.steps?.map((step) => fillFacts(step, facts)),
    })),
  }));
}
