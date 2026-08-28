import { LibraryList } from '@/features/library/LibraryList';

export const metadata = { title: 'Yuklamalar' };

export default function StudentDownloadsPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Yuklamalar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sotib olingan yechimlar shu yerda doimiy saqlanadi.
      </p>

      <div className="mt-5">
        <LibraryList />
      </div>
    </>
  );
}
