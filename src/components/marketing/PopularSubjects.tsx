'use client';

import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useT } from '@/i18n/useT';

/* Fan nomlari tarjima qilinmaydi: ular atoqli ot va ikkala tilda ham
   bir xil yoziladi (`Python`, `AutoCAD`, `SQL`). */
const subjects = [
  'Dasturlash',
  'Matematika',
  'Fizika',
  'AutoCAD',
  'Elektronika',
  'SQL',
  'Python',
  'Marketing',
  'Arxitektura',
  'IoT',
  'Kimyo',
] as const;

export function PopularSubjects() {
  const { m } = useT();

  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight text-foreground">{m.home.popularTitle}</h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="inline-flex rounded-lg bg-muted/70 px-3 py-1.5 text-sm font-medium text-foreground/90"
          >
            {subject}
          </span>
        ))}
      </div>

      <Link
        href="/materials"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
      >
        {m.home.popularAll}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
