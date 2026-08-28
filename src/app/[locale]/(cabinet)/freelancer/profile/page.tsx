import { AccountProfile } from '@/features/account/AccountProfile';
import { ChangePassword } from '@/features/account/ChangePassword';
import { LoginMethods } from '@/features/account/LoginMethods';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.profile };
}

export default async function FreelancerProfilePage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.profile}</h2>
      <div className="mt-4 space-y-4">
        <AccountProfile />
        {/* Hisob bitta — kirish usullari ikkala kabinetda ham bir xil. */}
        <LoginMethods />
        <ChangePassword />
      </div>
    </>
  );
}
