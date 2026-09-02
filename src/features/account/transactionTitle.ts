import type { Messages } from '@/i18n/messages/uz';
import type { WalletTransaction } from '@/shared/types/account';

/**
 * Statement qatorining sarlavhasi — TARJIMA QILINGAN.
 *
 * Backend `description` ni INGLIZCHA yozadi («Purchase: sprava»,
 * «Withdrawal request») va o'zbek saytida u shundayligicha ko'rinardi.
 * Uni serverda tuzatib bo'lmaydi: `description` — o'zgarmas daftar
 * qatorining bir qismi, allaqachon yozilganlari esa o'sha holicha qoladi.
 * Shuning uchun ko'rinadigan matn MIJOZDA yig'iladi.
 *
 * Nomi (yechim sarlavhasi) SAQLANADI. Faqat turni ko'rsatib qo'yish
 * to'g'ri, lekin foydasiz: o'nta «Xarid» qatorini bir-biridan ajratib
 * bo'lmasdi. Server izohi doim `"{Ingliz prefiksi}: {nom}"` shaklida,
 * shuning uchun birinchi ikki nuqtadan keyingisi olinadi — bu taxmin
 * xato bo'lsa ham xavfsiz: eng yomon holatda odam server yozgan matnni
 * ko'radi, ya'ni hozirgi holatdan yomonroq bo'lmaydi.
 */
export function transactionTitle(transaction: WalletTransaction, m: Messages): string {
  const label = m.txn[transaction.type] ?? transaction.type;

  const separator = transaction.description.indexOf(': ');
  if (separator === -1) return label;

  const subject = transaction.description.slice(separator + 2).trim();
  return subject ? `${label}: ${subject}` : label;
}
