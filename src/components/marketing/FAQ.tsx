import { ChevronDown } from 'lucide-react';

export const faqs = [
  {
    q: 'Topshiriq qanday joylanadi?',
    a: "Saytda ro'yxatdan o'ting, topshiriq ma'lumotlarini va talablaringizni kiriting, so'ngra freelancer tanlang yoki tayyor material qidiring.",
  },
  {
    q: "To'lovlar qanday amalga oshiriladi?",
    a: "Hozircha karta orqali manual to'lov mavjud. To'lov qilgach, chek skrinshotini yuklaysiz va admin tasdiqlagach xizmat ochiladi.",
  },
  {
    q: 'Topshiriq bajarilmasa-chi?',
    a: "Agar ish belgilangan muddatda bajarilmasa yoki sifat talabga javob bermasa, qo'llab-quvvatlash jamoasi masalani ko'rib chiqadi va yechim taklif qiladi.",
  },
  {
    q: 'Qanday kafolat berasiz?',
    a: "Barcha ishlar AI va ekspertlar tomonidan tekshiriladi. To'lovlar himoyalangan, muammo bo'lsa pul qaytarish yoki qayta bajarish imkoniyati mavjud.",
  },
] as const;

/**
 * Native `<details>` — bir necha sabab bilan ataylab shunday:
 * 1) SEO: kontent HTML'da darhol bor, JS hydration'ga bog'liq emas.
 * 2) FAQPage JSON-LD bilan bitta manbadan (`faqs`) keladi, ikkalasi
 *    bir-biridan uzoqlashib qolmaydi.
 * 3) Klaviatura va skrinrider bilan ishlashi brauzerdan tekinga keladi.
 */
export function FAQ() {
  return (
    <div id="faq">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Ko&apos;p beriladigan savollar
      </h2>

      <div className="mt-5 divide-y divide-border">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
              {faq.q}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Google "Rich Results" (savol-javob akkordeoni qidiruv natijasida) uchun. */
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
