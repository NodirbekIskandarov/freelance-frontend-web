import type { Notification } from '@/shared/types/notifications';

/**
 * Ketma-ket kelgan bir xil turdagi bildirishnomalar bitta kartaga yig'iladi.
 *
 * Nega KETMA-KET: ro'yxat vaqt bo'yicha tartiblangan va uni buzish
 * mumkin emas. «Bugungi to'rtta tasdiq» bilan «o'tgan hafta uchtasi» ni
 * bitta kartaga qo'shish yangi xabarni eski uyumga ko'mib qo'yardi.
 *
 * Nega TUR bo'yicha, `reference_id` emas: takror aynan shu yerda —
 * to'rtta yechim tasdiqlansa to'rtta `solution_approved` keladi, har
 * biri boshqa obyekt haqida, lekin odam uchun bu bitta xabar.
 * `reference_id` bo'yicha guruhlash hech nimani yig'masdi.
 */

/** Shundan kam bo'lsa yig'ilmaydi: ikkita element karta talab qilmaydi. */
const MIN_GROUP = 3;

export interface NotificationGroup {
  key: string;
  items: Notification[];
  /** Guruhda o'qilmagani bormi — yig'ilgan holatda ham ko'rinishi kerak. */
  unread: number;
}

export type NotificationEntry =
  | { kind: 'single'; key: string; item: Notification }
  | { kind: 'group'; key: string; group: NotificationGroup };

export function groupNotifications(items: Notification[]): NotificationEntry[] {
  const entries: NotificationEntry[] = [];
  let run: Notification[] = [];

  function flush() {
    if (run.length === 0) return;

    if (run.length < MIN_GROUP) {
      for (const item of run) entries.push({ kind: 'single', key: item.id, item });
    } else {
      entries.push({
        kind: 'group',
        key: `group:${run[0]!.id}`,
        group: {
          key: `group:${run[0]!.id}`,
          items: [...run],
          unread: run.filter((item) => !item.is_read).length,
        },
      });
    }
    run = [];
  }

  for (const item of items) {
    if (run.length > 0 && run[0]!.type !== item.type) flush();
    run.push(item);
  }
  flush();

  return entries;
}
