import { Link } from '@/i18n/Link';

import { cn } from '@/lib/cn';

export function SiteLogo({
  className,
  accentClassName,
}: {
  className?: string;
  accentClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center rounded-lg text-xl font-bold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-2xl',
        className,
      )}
    >
      Yopamiz
      <span className={cn('text-brand', accentClassName)}>.uz</span>
    </Link>
  );
}
