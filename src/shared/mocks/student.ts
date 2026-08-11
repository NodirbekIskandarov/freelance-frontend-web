import type { DownloadItem, StudentDashboard, StudentOrder } from '../types/orders';

export const mockStudentOrders: StudentOrder[] = [
  {
    id: '1',
    reference: 'ORD-100241',
    title: 'Mustaqil ish №3',
    universityShort: 'TATU',
    subjectName: 'Dasturlash asoslari',
    status: 'in_progress',
    amount: 25_000,
    createdAt: '2026-08-09 14:32',
  },
  {
    id: '2',
    reference: 'ORD-100238',
    title: 'Laboratoriya ishi №5',
    universityShort: 'TATU',
    subjectName: "Ma'lumotlar bazasi",
    status: 'completed',
    amount: 30_000,
    createdAt: '2026-08-05 11:20',
  },
  {
    id: '3',
    reference: 'ORD-100230',
    title: 'Amaliy ish №2',
    universityShort: "O'zMU",
    subjectName: 'Matematik analiz',
    status: 'completed',
    amount: 20_000,
    createdAt: '2026-07-28 09:15',
  },
  {
    id: '4',
    reference: 'ORD-100224',
    title: 'Kurs ishi',
    universityShort: 'TDTU',
    subjectName: 'AutoCAD',
    status: 'pending',
    amount: 45_000,
    createdAt: '2026-07-21 16:48',
  },
];

export const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    title: 'Laboratoriya ishi №5',
    subjectName: "Ma'lumotlar bazasi",
    universityShort: 'TATU',
    fileName: 'lab5-yechim.pdf',
    fileSize: '1.2 MB',
    purchasedAt: '2026-08-05',
  },
  {
    id: '2',
    title: 'Amaliy ish №2',
    subjectName: 'Matematik analiz',
    universityShort: "O'zMU",
    fileName: 'amaliy2.docx',
    fileSize: '840 KB',
    purchasedAt: '2026-07-28',
  },
];

export const mockStudentDashboard: StudentDashboard = {
  stats: {
    activeOrders: 2,
    completedOrders: 2,
    downloads: mockDownloads.length,
    spentTotal: 120_000,
  },
  recentOrders: mockStudentOrders.slice(0, 3),
};
