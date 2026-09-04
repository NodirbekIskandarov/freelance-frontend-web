import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from '@/i18n/Link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/85',
        /*
          Yorliq QORA, oq emas.

          Oq matn `emerald-500` ustida 2.54:1 beradi — talab 4.5:1, ya'ni
          sayt bo'ylab asosiy tugma o'qish chegarasidan ancha past edi.
          Yashilni to'qlashtirish yo'l emas: u brend rangi va katalogda
          matn bo'lib ham ishlatiladi. Qora yorliq esa o'sha yorqin
          yashilni saqlab, 7.5:1 beradi.
        */
        emerald: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400',
        outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-[0.8rem]',
        lg: 'h-12 px-7 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
  href: string;
}

/** `<Link>` ustiga tugma ko'rinishi — CTA'lar odatda navigatsiya, `<button>` emas. */
export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
