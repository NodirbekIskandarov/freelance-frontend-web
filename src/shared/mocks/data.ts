import type { AppUser } from '../types/auth';

/**
 * Soxta foydalanuvchilar. Backend tayyor bo'lgach bu papka butunlay
 * o'chiriladi — shakli `types/auth.ts` bilan bir xil, komponentlar
 * o'zgarmaydi.
 */
export const mockUsers: (AppUser & { password: string })[] = [
  {
    id: '1',
    publicId: 'USR-100001',
    fullName: 'Dilnoza Karimova',
    phone: '+998901112233',
    email: 'dilnoza@example.com',
    avatarUrl: null,
    status: 'student',
    createdAt: '2026-02-03T14:20:00.000Z',
    password: 'parol123',
  },
  {
    id: '2',
    publicId: 'USR-100002',
    fullName: 'Jasur Toshmatov',
    phone: '+998907778899',
    email: 'jasur@example.com',
    avatarUrl: null,
    status: 'freelancer',
    createdAt: '2026-03-21T11:45:00.000Z',
    password: 'parol123',
  },
];
