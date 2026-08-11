import type { Appeal, SavedItem, Wallet } from '../types/account';

export const mockSavedItems: SavedItem[] = [
  {
    id: 'sv-1',
    type: 'material',
    title: 'Mustaqil ish №3',
    subtitle: 'TATU · Dasturlash asoslari',
    href: '/materials/tatu/dasturlash-asoslari',
    savedAt: '2026-08-09',
  },
  {
    id: 'sv-2',
    type: 'material',
    title: 'Laboratoriya ishi №5',
    subtitle: "TATU · Ma'lumotlar bazasi",
    href: '/materials/tatu/malumotlar-bazasi',
    savedAt: '2026-08-04',
  },
  {
    id: 'sv-3',
    type: 'freelancer',
    title: 'Sardor Alimov',
    subtitle: 'Web dasturlash · 4.9 reyting',
    href: '/freelance',
    savedAt: '2026-07-30',
  },
  {
    id: 'sv-4',
    type: 'freelancer',
    title: 'Nilufar Rahimova',
    subtitle: 'Iqtisodiy tahlil · 4.9 reyting',
    href: '/freelance',
    savedAt: '2026-07-22',
  },
];

const transactions: Wallet['transactions'] = [
  {
    id: 'wt-1',
    type: 'topup',
    description: "Karta orqali to'ldirish",
    amount: 100_000,
    createdAt: '2026-08-08 12:04',
  },
  {
    id: 'wt-2',
    type: 'purchase',
    description: 'Mustaqil ish №3 — Dasturlash asoslari',
    amount: -25_000,
    createdAt: '2026-08-09 14:32',
  },
  {
    id: 'wt-3',
    type: 'purchase',
    description: "Laboratoriya ishi №5 — Ma'lumotlar bazasi",
    amount: -30_000,
    createdAt: '2026-08-05 11:20',
  },
  {
    id: 'wt-4',
    type: 'refund',
    description: 'Bekor qilingan buyurtma uchun qaytarish',
    amount: 20_000,
    createdAt: '2026-08-02 09:41',
  },
  {
    id: 'wt-5',
    type: 'topup',
    description: "Karta orqali to'ldirish",
    amount: 50_000,
    createdAt: '2026-07-28 17:55',
  },
];

/*
 * Balans tranzaksiyalardan hisoblanadi, qo'lda yozilmaydi: qo'lda
 * yozilganda ro'yxatga yangi qator qo'shilishi bilan balans unga zid
 * bo'lib qolardi — foydalanuvchi ekranda qo'shib chiqsa boshqa raqam
 * chiqardi.
 */
export const mockWallet: Wallet = {
  balance: transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
  transactions,
};

export const mockAppeals: Appeal[] = [
  {
    id: 'ap-1',
    reference: 'MRJ-3041',
    subject: "To'lov tasdiqlanmadi",
    message:
      "Karta orqali to'ladim, chek skrinshotini yukladim, lekin buyurtma hali ochilmadi. Tekshirib berasizmi?",
    status: 'resolved',
    createdAt: '2026-08-03 10:12',
    reply:
      "To'lov tasdiqlandi va buyurtma ochildi. Kechikish uchun uzr — chek tekshiruvi navbatda turgan edi.",
  },
  {
    id: 'ap-2',
    reference: 'MRJ-3068',
    subject: 'Material talabga mos kelmadi',
    message:
      'Yuklab olgan mustaqil ishim mavzu bo‘yicha to‘g‘ri, lekin talab qilingan format boshqacha edi.',
    status: 'in_review',
    createdAt: '2026-08-09 16:40',
    reply: null,
  },
];
