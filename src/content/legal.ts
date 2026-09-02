import type { Locale } from '@/i18n/config';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

/**
 * Huquqiy matn — til bo'yicha ajratilgan.
 *
 * Bu mazmun TARJIMA LUG'ATIDA emas: u uzun va bandlarga bo'lingan, uni
 * interfeys yorliqlari bilan bir joyda saqlash lug'atni o'qib
 * bo'lmaydigan qilib qo'yardi. Bo'lim `id` lari HAR IKKALA tilda bir
 * xil: ular manzildagi langar (`#tolov`) va til almashtirilganda odam
 * o'sha bo'limda qolishi kerak.
 */
const LEGAL_UZ: LegalSection[] = [
  {
    id: 'umumiy',
    title: '1. Umumiy qoidalar',
    paragraphs: [
      'Ushbu shartlar Yopamiz.uz platformasidan foydalanish tartibini belgilaydi. Saytdan foydalanish orqali siz quyidagi qoidalarga rozilik bildirasiz.',
      "Platforma talabalar va mustaqil mutaxassislarni bog'lovchi vositachi sifatida ishlaydi. Ish sifati uchun bevosita javobgarlik uni bajargan freelancer zimmasida bo'ladi, platforma esa nizolarni ko'rib chiqish va mablag'ni himoyalash bilan shug'ullanadi.",
    ],
  },
  {
    id: 'akademik',
    title: '2. Akademik halollik',
    paragraphs: [
      "Platformadagi materiallar o'quv jarayonida yordamchi manba sifatida taqdim etiladi. Ulardan foydalanish tartibi uchun javobgarlik foydalanuvchining o'zida.",
      "Freelancer buyurtmani mustaqil bajarishi shart. Boshqa mualliflarning ishini o'zinikidek taqdim etish yoki bir ishni bir necha kishiga qayta sotish taqiqlanadi va profilni bloklashga olib keladi.",
    ],
  },
  {
    id: 'tolov',
    title: "3. To'lov va qaytarish",
    paragraphs: [
      "To'lov shartnoma tuzilgandan keyin amalga oshiriladi va ish topshirilgunicha platformada saqlanadi. Platforma komissiyasi shartnoma summasining 10% ini tashkil qiladi.",
      "Ish belgilangan muddatda topshirilmasa yoki kelishilgan talablarga javob bermasa, foydalanuvchi murojaat qoldirishi mumkin. Ko'rib chiqish natijasiga ko'ra mablag' qaytariladi yoki ish qayta bajariladi.",
    ],
  },
  {
    id: 'hold',
    title: "4. Sotuvdan tushgan mablag'ni ushlab turish",
    paragraphs: [
      "Tayyor material sotilganda muallif ulushi darhol balansga tushmaydi: u belgilangan muddat davomida platformada ushlab turiladi. Muddat tugagach summa avtomatik ravishda balansga o'tkaziladi va muallifga xabar boradi.",
      "Ushlab turish XARIDOR KAFOLATI uchun. Shu muddat ichida xaridor xarid bo'yicha shikoyat qoldirishi mumkin — masalan fayl ochilmasa yoki e'lon qilingan tavsifga mos kelmasa. Ushlab turilgan mablag' bo'lmasa, asosli shikoyat bo'yicha pulni qaytarib bo'lmasdi.",
      "Shikoyat qoldirilsa, ushlab turish muddat bo'yicha emas, QAROR bo'yicha yakunlanadi: moderator xaridor foydasiga hal qilsa mablag' unga qaytariladi, aks holda muallifga o'tkaziladi. Shikoyat qoldirish muddati ushlab turish muddati bilan bir xil va u tugagach xarid yakuniy hisoblanadi.",
      "Har bir sotuvga uning sotilgan kunidagi qoida qo'llaniladi. Muddat keyinchalik o'zgartirilsa, bu faqat YANGI sotuvlarga taalluqli bo'ladi — allaqachon e'lon qilingan ochilish sanasi o'zgarmaydi.",
      "Hisob tekshiruv sababli vaqtincha bloklansa yoki muzlatilsa, ushlab turilgan mablag' yo'qolmaydi: u hisobda saqlanadi va cheklov olib tashlangach to'liq o'tkaziladi. Hisobni o'chirishni so'ragan foydalanuvchining ushlab turilgan mablag'i muddat tugagach yoki ochiq shikoyatlar hal bo'lgach beriladi.",
      "Ushlab turilgan mablag'ni sarflash yoki yechib olish mumkin emas — u hali muallifga o'tmagan. Joriy summa va har bir sotuvning ochilish sanasi hamyon bo'limida ko'rinadi.",
    ],
  },
  {
    id: 'maxfiylik',
    title: "5. Shaxsiy ma'lumotlar",
    paragraphs: [
      "Ro'yxatdan o'tishda kiritilgan ism, telefon raqam va elektron pochta faqat xizmat ko'rsatish, buyurtmalar bo'yicha xabar berish va qo'llab-quvvatlash uchun ishlatiladi.",
      "Freelancer arizasidagi hujjat ma'lumotlari yopiq saqlanadi va faqat administrator tekshiruvi uchun ochiladi. Ular uchinchi shaxslarga berilmaydi.",
      "Foydalanuvchi istalgan vaqtda o'z ma'lumotlarini o'chirishni so'rashi mumkin — buning uchun qo'llab-quvvatlash xizmatiga murojaat qiling.",
    ],
  },
  {
    id: 'javobgarlik',
    title: '6. Javobgarlikni cheklash',
    paragraphs: [
      "Platforma texnik uzilishlar, uchinchi tomon to'lov tizimlaridagi nosozliklar yoki foydalanuvchi tomonidan noto'g'ri kiritilgan ma'lumotlar oqibatlari uchun javob bermaydi.",
      "Ushbu shartlarga o'zgartirish kiritilishi mumkin. Muhim o'zgarishlar haqida foydalanuvchilar oldindan xabardor qilinadi.",
    ],
  },
];

const LEGAL_RU: LegalSection[] = [
  {
    id: 'umumiy',
    title: '1. Общие положения',
    paragraphs: [
      'Настоящие условия определяют порядок использования платформы Yopamiz.uz. Пользуясь сайтом, вы соглашаетесь с приведёнными ниже правилами.',
      'Платформа выступает посредником, который связывает студентов и независимых специалистов. Ответственность за качество работы несёт выполнивший её фрилансер, а платформа занимается рассмотрением споров и защитой средств.',
    ],
  },
  {
    id: 'akademik',
    title: '2. Академическая честность',
    paragraphs: [
      'Материалы на платформе предоставляются как вспомогательный источник в учебном процессе. Ответственность за порядок их использования лежит на пользователе.',
      'Фрилансер обязан выполнять заказ самостоятельно. Выдавать чужую работу за свою или перепродавать одну работу нескольким людям запрещено — это ведёт к блокировке профиля.',
    ],
  },
  {
    id: 'tolov',
    title: '3. Оплата и возврат',
    paragraphs: [
      'Оплата вносится после заключения договора и хранится на платформе до сдачи работы. Комиссия платформы составляет 10% от суммы договора.',
      'Если работа не сдана в срок или не соответствует согласованным требованиям, пользователь может оставить обращение. По результатам рассмотрения средства возвращаются либо работа выполняется заново.',
    ],
  },
  {
    id: 'hold',
    title: '4. Удержание средств от продажи',
    paragraphs: [
      'При продаже готового материала доля автора не поступает на баланс сразу: она удерживается платформой в течение установленного срока. По его истечении сумма зачисляется на баланс автоматически, а автор получает уведомление.',
      'Удержание существует ради ГАРАНТИИ ПОКУПАТЕЛЮ. В течение этого срока покупатель может подать жалобу на покупку — например, если файл не открывается или не соответствует описанию. Без удержанных средств вернуть деньги по обоснованной жалобе было бы не из чего.',
      'Если жалоба подана, удержание завершается не по сроку, а по РЕШЕНИЮ: при решении в пользу покупателя средства возвращаются ему, иначе — зачисляются автору. Срок подачи жалобы равен сроку удержания; после его истечения покупка считается окончательной.',
      'К каждой продаже применяется правило, действовавшее в день продажи. Если срок будет изменён позже, это коснётся только НОВЫХ продаж — уже объявленная дата зачисления не меняется.',
      'Если аккаунт временно заблокирован или заморожен из-за проверки, удержанные средства не пропадают: они сохраняются за аккаунтом и зачисляются полностью после снятия ограничения. Пользователю, запросившему удаление аккаунта, удержанные средства выплачиваются по истечении срока или после закрытия открытых жалоб.',
      'Удержанные средства нельзя потратить или вывести — они ещё не перешли автору. Текущая сумма и дата зачисления по каждой продаже видны в разделе кошелька.',
    ],
  },
  {
    id: 'maxfiylik',
    title: '5. Персональные данные',
    paragraphs: [
      'Имя, номер телефона и электронная почта, указанные при регистрации, используются только для оказания услуг, уведомлений по заказам и поддержки.',
      'Данные документов из заявки фрилансера хранятся закрыто и открываются только для проверки администратором. Третьим лицам они не передаются.',
      'Пользователь может в любой момент запросить удаление своих данных — для этого обратитесь в службу поддержки.',
    ],
  },
  {
    id: 'javobgarlik',
    title: '6. Ограничение ответственности',
    paragraphs: [
      'Платформа не отвечает за технические сбои, неполадки в сторонних платёжных системах и последствия неверно введённых пользователем данных.',
      'В настоящие условия могут вноситься изменения. О существенных изменениях пользователи уведомляются заранее.',
    ],
  },
];

const BY_LOCALE: Record<Locale, LegalSection[]> = { uz: LEGAL_UZ, ru: LEGAL_RU };

export function legalSections(locale: Locale): LegalSection[] {
  return BY_LOCALE[locale] ?? LEGAL_UZ;
}
