/**
 * Yordam markazi aytadigan shartlar.
 *
 * Hammasi backenddagi sozlama va konstantalardan keladi
 * (`GET /support/terms/`), matnga yozib qo'yilmaydi: shikoyat oynasi
 * operator sozlamasi va sahifaga "24 soat" deb yozib qo'yilsa, sayt
 * server rost qabul qiladigan muddatdan ancha kamini va'da qilardi.
 */
export interface SupportTerms {
  /** Xariddan keyin shikoyat qoldirish mumkin bo'lgan vaqt. */
  dispute_window_hours: number;
  /** Muallifga javob berish uchun beriladigan vaqt. */
  dispute_author_response_hours: number;
  /** Shikoyatga nechta dalil fayli biriktiriladi. */
  dispute_evidence_limit: number;
  /** Bitta odam bitta variantga nechta yechim yuklay oladi. */
  max_solutions_per_variant: number;
  /** Eng kam yechib olish summasi (so'm). */
  min_withdrawal: number;
  /** Bir vaqtda nechta javobsiz murojaat bo'lishi mumkin. */
  open_appeal_limit: number;
  /** Murojaatga nechta fayl biriktiriladi. */
  appeal_attachment_limit: number;
  /** Tasdiqlangan arizalar uchun mukofot (so'm). `0` — o'chirilgan. */
  subject_request_reward: number;
  assignment_request_reward: number;
  university_request_reward: number;
}
