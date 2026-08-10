/**
 * Vaqtinchalik sahifa — dizayn PNG'lari kelgach to'liq almashtiriladi.
 * Hozircha tokenlar va Tailwind to'g'ri ulanganini ko'rsatib turadi.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-container flex-1 flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-primary">Skelet tayyor</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-text">Freelance Frontend</h1>
      <p className="mt-4 max-w-prose text-text-muted">
        Next.js 16 · Redux Toolkit · RTK Query · Tailwind v4. Dizayn eksporti{' '}
        <code className="rounded-control bg-surface-muted px-1.5 py-0.5 font-mono text-sm">
          design/web/
        </code>{' '}
        papkasiga tushgach, sahifalar shu skelet ustiga quriladi.
      </p>
    </main>
  );
}
