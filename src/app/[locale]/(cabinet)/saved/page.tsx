import { SavedItems } from '@/features/account/SavedItems';

export const metadata = { title: 'Saqlanganlar' };

export default function SavedPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Saqlanganlar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Keyinroq qaytib kelish uchun belgilab qo&apos;ygan material va mutaxassislaringiz.
      </p>

      <div className="mt-5">
        <SavedItems />
      </div>
    </>
  );
}
