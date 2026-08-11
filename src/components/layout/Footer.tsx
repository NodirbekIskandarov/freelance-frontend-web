import { Globe, Mail, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { siteConfig } from '@/config/site';

import { Container } from '../ui/Container';
import { SiteLogo } from './SiteLogo';

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-4 grid gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function ContactItem({
  icon: Icon,
  href,
  children,
}: {
  icon: typeof Phone;
  href?: string;
  children: ReactNode;
}) {
  const content = (
    <>
      <Icon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {content}
      </a>
    );
  }

  return <div className="flex items-start gap-2.5 text-sm text-muted-foreground">{content}</div>;
}

/**
 * Yil server renderida hisoblanadi — Next Server Component sifatida bu
 * xavfsiz, chunki bir marta build/request paytida chiqadi va sahifa
 * hydration'da mos kelmasligi (server/mijoz turli yil) xavfi yo'q,
 * negaki bu qiymat interaktiv emas, faqat matn.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40 text-foreground dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <SiteLogo className="dark:text-white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Talabalar uchun barcha xizmatlar bitta joyda. Sifatli, tezkor va ishonchli.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink href={siteConfig.social.telegram} label="Telegram">
                <Send className="size-4" />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <Globe className="size-4" />
              </SocialLink>
            </div>
          </div>

          <FooterCol title="Platforma">
            <FooterLink href="/">Asosiy</FooterLink>
            <FooterLink href="/materials">Topshiriqlar</FooterLink>
            <FooterLink href="/#xizmatlar">Konspekt</FooterLink>
            <FooterLink href="/#xizmatlar">Chizmachilik</FooterLink>
            <FooterLink href="/#xizmatlar">Diplom ishlari</FooterLink>
          </FooterCol>

          <FooterCol title="Freelancerlar">
            <FooterLink href="/freelance/apply">Freelancer bo&apos;lish</FooterLink>
            <FooterLink href="/freelance">Freelancer qidirish</FooterLink>
            <FooterLink href="/freelance/exchange">Birja</FooterLink>
          </FooterCol>

          <FooterCol title="Yordam">
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/legal">Qoidalar</FooterLink>
            <FooterLink href="/about">Biz haqimizda</FooterLink>
            <FooterLink href="/appeals">Murojaatlar</FooterLink>
          </FooterCol>

          <FooterCol title="Aloqa">
            <ContactItem icon={Phone} href={`tel:${siteConfig.contact.phone}`}>
              +998 90 123 45 67
            </ContactItem>
            <ContactItem icon={Mail} href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </ContactItem>
            <ContactItem icon={MapPin}>{siteConfig.contact.address}</ContactItem>
          </FooterCol>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; {year} Yopamiz.uz — Barcha huquqlar himoyalangan</div>
          <div>O&apos;zbekiston uchun yaratilgan</div>
        </div>
      </Container>
    </footer>
  );
}
