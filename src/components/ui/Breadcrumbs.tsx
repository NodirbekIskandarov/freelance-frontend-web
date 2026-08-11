import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Ko'rinadigan breadcrumb. JSON-LD versiyasi `lib/seo.tsx` dagi
 * `breadcrumbJsonLd()` orqali beriladi — ikkalasi bir xil massivdan
 * quriladi, shuning uchun ular bir-biridan uzoqlashib qolmaydi.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" aria-hidden />
              )}
              {isLast ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-foreground">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
