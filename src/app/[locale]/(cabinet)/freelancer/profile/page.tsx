import { AccountProfile } from '@/features/account/AccountProfile';
import { ChangePassword } from '@/features/account/ChangePassword';
import { LoginMethods } from '@/features/account/LoginMethods';

export const metadata = { title: 'Profil' };

export default function FreelancerProfilePage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Profil</h2>
      <div className="mt-4 space-y-4">
        <AccountProfile />
        {/* Hisob bitta — kirish usullari ikkala kabinetda ham bir xil. */}
        <LoginMethods />
        <ChangePassword />
      </div>
    </>
  );
}
