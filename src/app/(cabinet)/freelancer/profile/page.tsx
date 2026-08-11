import { AccountProfile } from '@/features/account/AccountProfile';

export const metadata = { title: 'Profil' };

export default function FreelancerProfilePage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Profil</h2>
      <div className="mt-4">
        <AccountProfile />
      </div>
    </>
  );
}
