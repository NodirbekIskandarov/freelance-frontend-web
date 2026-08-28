import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';

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
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Mashhur yo&apos;nalishlar
      </h2>

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
        Barchasini ko&apos;rish
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
