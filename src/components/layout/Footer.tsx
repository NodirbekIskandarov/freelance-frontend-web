import { Globe, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from '@/i18n/Link';
import type { ReactNode } from 'react';

import { siteConfig } from '@/config/site';
import { formatPhone } from '@/lib/format';
import { getMessages } from '@/i18n/messages';
import { interpolate } from '@/i18n/interpolate';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config';

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

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
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
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
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
export async function Footer({ locale: raw }: { locale: string }) {
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = (await getMessages(locale)).footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40 text-foreground dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <SiteLogo className="dark:text-white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {m.tagline}
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

          <FooterCol title={m.platform}>
            <FooterLink href="/">{m.home}</FooterLink>
            <FooterLink href="/materials">{m.assignments}</FooterLink>
            <FooterLink href="/#xizmatlar">{m.notes}</FooterLink>
            <FooterLink href="/#xizmatlar">{m.drawing}</FooterLink>
            <FooterLink href="/#xizmatlar">{m.diploma}</FooterLink>
          </FooterCol>

          <FooterCol title={m.freelancers}>
            <FooterLink href="/freelance/apply">{m.becomeFreelancer}</FooterLink>
            <FooterLink href="/freelance">{m.findFreelancer}</FooterLink>
            <FooterLink href="/freelance/exchange">{m.exchange}</FooterLink>
          </FooterCol>

          <FooterCol title={m.help}>
            <FooterLink href="/faq">{m.faq}</FooterLink>
            <FooterLink href="/legal">{m.rules}</FooterLink>
            <FooterLink href="/about">{m.about}</FooterLink>
            <FooterLink href="/appeals">{m.appeals}</FooterLink>
          </FooterCol>

          <FooterCol title={m.contact}>
            <ContactItem icon={Phone} href={`tel:${siteConfig.contact.phone}`}>
              {formatPhone(siteConfig.contact.phone)}
            </ContactItem>
            <ContactItem icon={Mail} href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </ContactItem>
            <ContactItem icon={MapPin}>{siteConfig.contact.address}</ContactItem>
          </FooterCol>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>{interpolate(m.rights, { year })}</div>
          <div>{m.madeFor}</div>
        </div>
      </Container>
    </footer>
  );
}
