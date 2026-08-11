import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

/**
 * Kabinet bosh sahifalaridagi ko'rsatkich kartasi.
 * Talaba va freelancer kabinetlari uchun bir xil — nusxa ko'chirilsa
 * ikkisi vaqt o'tib bir-biridan uzoqlashib ketardi.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Ikonka chipi uchun fon va matn ranglari. */
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className={cn('grid size-10 place-items-center rounded-lg', tone)}>
        <Icon className="size-5" />
      </div>
      <div className="mt-3 text-xl font-bold text-foreground">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
