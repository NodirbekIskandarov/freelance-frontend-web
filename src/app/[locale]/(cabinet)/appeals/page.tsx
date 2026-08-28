import { Appeals } from '@/features/account/Appeals';

export const metadata = { title: 'Murojaatlar' };

export default function AppealsPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Murojaatlar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Muammo yuzasidan qo&apos;llab-quvvatlash jamoasiga yozing — javobni shu yerda olasiz.
      </p>

      <div className="mt-5">
        <Appeals />
      </div>
    </>
  );
}
