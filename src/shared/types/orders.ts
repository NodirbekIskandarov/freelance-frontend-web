export const ORDER_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Kutilmoqda',
  in_progress: 'Bajarilmoqda',
  completed: 'Yakunlangan',
  cancelled: 'Bekor qilingan',
};

export interface StudentOrder {
  id: string;
  reference: string;
  title: string;
  universityShort: string;
  subjectName: string;
  status: OrderStatus;
  amount: number;
  createdAt: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  subjectName: string;
  universityShort: string;
  fileName: string;
  fileSize: string;
  purchasedAt: string;
}

export interface StudentDashboard {
  stats: {
    activeOrders: number;
    completedOrders: number;
    downloads: number;
    spentTotal: number;
  };
  recentOrders: StudentOrder[];
}
