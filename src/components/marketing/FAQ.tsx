import { ChevronDown } from 'lucide-react';

import type { FaqItem } from '@/content/faq';

/**
 * Native `<details>` — bir necha sabab bilan ataylab shunday:
 * 1) SEO: kontent HTML'da darhol bor, JS hydration'ga bog'liq emas.
 * 2) FAQPage JSON-LD bilan bitta manbadan (`content/faq.ts`) keladi,
 *    ikkalasi bir-biridan uzoqlashib qolmaydi.
 * 3) Klaviatura va skrinrider bilan ishlashi brauzerdan tekinga keladi.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((faq) => (
        <details key={faq.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
            {faq.q}
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FAQ({ items }: { items: readonly FaqItem[] }) {
  return (
    <div id="faq">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Ko&apos;p beriladigan savollar
      </h2>
      <div className="mt-5">
        <FaqList items={items} />
      </div>
    </div>
  );
}
