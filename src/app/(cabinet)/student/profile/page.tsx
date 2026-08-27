import { AccountProfile } from '@/features/account/AccountProfile';
import { LoginMethods } from '@/features/account/LoginMethods';

export const metadata = { title: 'Profil' };

export default function StudentProfilePage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Profil</h2>
      <div className="mt-4 space-y-4">
        <AccountProfile />
        {/* Kirish usullari profilning bir qismi: qaysi yo'l bilan kirish
            mumkinligi hisob ma'lumotining o'zi. */}
        <LoginMethods />
      </div>
    </>
  );
}
