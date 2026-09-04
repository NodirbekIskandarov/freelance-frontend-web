import { Mail, MapPin, Phone, Send } from 'lucide-react';

import { siteConfig } from '@/config/site';
import type { Messages } from '@/i18n/messages/uz';
import { formatPhone } from '@/lib/format';

/**
 * Aloqa kanallari.
 *
 * Server komponenti: bu yerda hech narsa bosilmaydi, hammasi havola —
 * mijoz tomoniga chiqarish sahifaga bir bayt ham JS qo'shmasligi kerak.
 */
export function SupportContacts({ m }: { m: Messages }) {
  const cards = [
    {
      icon: Send,
      title: m.help.contactTelegram,
      value: siteConfig.support.telegramHandle,
      note: m.help.contactTelegramNote,
      href: siteConfig.support.telegram,
      tone: 'bg-sky-500/10 text-sky-500',
    },
    {
      icon: Mail,
      title: m.help.contactEmail,
      value: siteConfig.contact.email,
      note: m.help.contactEmailNote,
      href: `mailto:${siteConfig.contact.email}`,
      tone: 'bg-emerald-500/10 text-brand',
    },
    {
      icon: Phone,
      title: m.help.contactPhone,
      value: formatPhone(siteConfig.contact.phone),
      note: m.help.contactPhoneNote,
      href: `tel:${siteConfig.contact.phone}`,
      tone: 'bg-amber-500/10 text-warning',
    },
    {
      icon: MapPin,
      title: m.help.contactAddress,
      value: siteConfig.contact.address,
      note: m.help.contactAddressNote,
      href: null,
      tone: 'bg-violet-500/10 text-violet-500',
    },
  ];

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const body = (
          <>
            <span className={`grid size-9 place-items-center rounded-xl ${card.tone}`}>
              <card.icon className="size-4" />
            </span>
            <span className="mt-3 block text-sm font-semibold text-foreground">{card.title}</span>
            <span className="mt-1 block truncate text-sm text-brand">
              {card.value}
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">{card.note}</span>
          </>
        );

        return card.href ? (
          <a
            key={card.title}
            href={card.href}
            target={card.href.startsWith('http') ? '_blank' : undefined}
            rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
            className="rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-emerald-500/40"
          >
            {body}
          </a>
        ) : (
          <div key={card.title} className="rounded-2xl border border-border bg-card p-3.5">
            {body}
          </div>
        );
      })}
    </div>
  );
}
