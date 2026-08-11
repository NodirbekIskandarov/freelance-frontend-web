import type { OrderStatus } from './orders';

/**
 * Freelancer kabineti — talaba kabineti bilan bir xil `OrderStatus`
 * ro'yxatidan foydalanadi. Bitta buyurtmaning ikki tomoni bir xil
 * holatda bo'lishi kerak: talabada "Bajarilmoqda" bo'lgan ish
 * freelancerda ham aynan shunday ko'rinadi.
 */

export interface FreelancerOrder {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  directionLabel: string;
  status: OrderStatus;
  /** Freelancer qo'liga tegadigan summa — komissiya ayrilgan. */
  payout: number;
  deadline: string;
  createdAt: string;
}

export interface FreelancerDashboard {
  stats: {
    activeOrders: number;
    completedOrders: number;
    rating: number;
    pendingPayout: number;
  };
  recentOrders: FreelancerOrder[];
}

export interface EarningsEntry {
  id: string;
  orderReference: string;
  orderTitle: string;
  amount: number;
  /** Platforma ushlab qolgan summa. */
  commission: number;
  paidAt: string | null;
}

export interface FreelancerEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  commissionRate: number;
  entries: EarningsEntry[];
}
