import type {
  EarningsEntry,
  FreelancerDashboard,
  FreelancerEarnings,
  FreelancerOrder,
} from '../types/freelancerCabinet';

/** Platforma komissiyasi — daromad sahifasida ochiq ko'rsatiladi. */
const COMMISSION_RATE = 0.1;

export const mockFreelancerOrders: FreelancerOrder[] = [
  {
    id: 'fo-1',
    reference: 'ORD-200145',
    title: 'Mobil ilova uchun backend API',
    clientName: 'Hayit Xalilov',
    directionLabel: 'Dasturlash fanlari',
    status: 'in_progress',
    payout: 1_080_000,
    deadline: '2026-08-18',
    createdAt: '2026-08-08 10:15',
  },
  {
    id: 'fo-2',
    reference: 'ORD-200139',
    title: 'Kurs ishi — Library management system',
    clientName: 'Zarina Mamatova',
    directionLabel: 'Kurs ishlari',
    status: 'in_progress',
    payout: 540_000,
    deadline: '2026-08-22',
    createdAt: '2026-08-06 16:40',
  },
  {
    id: 'fo-3',
    reference: 'ORD-200121',
    title: "Ma'lumotlar bazasi loyihasi — ER diagramma",
    clientName: 'Jasur Karimov',
    directionLabel: 'Kurs ishlari',
    status: 'completed',
    payout: 360_000,
    deadline: '2026-07-30',
    createdAt: '2026-07-19 09:05',
  },
  {
    id: 'fo-4',
    reference: 'ORD-200118',
    title: 'Laboratoriya hisoboti — fizika tajribasi',
    clientName: 'Nilufar Rahimova',
    directionLabel: 'Laboratoriya ishlari',
    status: 'completed',
    payout: 162_000,
    deadline: '2026-07-24',
    createdAt: '2026-07-15 13:28',
  },
  {
    id: 'fo-5',
    reference: 'ORD-200110',
    title: 'Diplom ishi 2-bob — tahliliy qism',
    clientName: 'Bobur Toshmatov',
    directionLabel: 'Diplom ishlari',
    status: 'pending',
    payout: 765_000,
    deadline: '2026-09-05',
    createdAt: '2026-08-10 08:50',
  },
];

export const mockFreelancerDashboard: FreelancerDashboard = {
  stats: {
    activeOrders: mockFreelancerOrders.filter((order) => order.status === 'in_progress').length,
    completedOrders: mockFreelancerOrders.filter((order) => order.status === 'completed').length,
    rating: 4.8,
    pendingPayout: mockFreelancerOrders
      .filter((order) => order.status === 'in_progress')
      .reduce((sum, order) => sum + order.payout, 0),
  },
  recentOrders: mockFreelancerOrders.slice(0, 3),
};

/*
 * Daromadlar buyurtmalardan HOSIL QILINADI, alohida yozilmaydi: qo'lda
 * yozilganda ikkala ro'yxat vaqt o'tib bir-biriga zid bo'lib qolardi —
 * kabinetda "yakunlangan" ish daromadlar ro'yxatida ko'rinmay qolishi mumkin.
 */
const entries: EarningsEntry[] = mockFreelancerOrders
  .filter((order) => order.status !== 'pending')
  .map((order) => ({
    id: `earn-${order.id}`,
    orderReference: order.reference,
    orderTitle: order.title,
    amount: order.payout,
    commission: Math.round((order.payout / (1 - COMMISSION_RATE)) * COMMISSION_RATE),
    paidAt: order.status === 'completed' ? order.deadline : null,
  }));

export const mockFreelancerEarnings: FreelancerEarnings = {
  availableBalance: entries
    .filter((entry) => entry.paidAt !== null)
    .reduce((sum, entry) => sum + entry.amount, 0),
  pendingBalance: entries
    .filter((entry) => entry.paidAt === null)
    .reduce((sum, entry) => sum + entry.amount, 0),
  totalEarned: entries.reduce((sum, entry) => sum + entry.amount, 0),
  commissionRate: COMMISSION_RATE,
  entries,
};
