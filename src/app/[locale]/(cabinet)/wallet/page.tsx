import { WalletView } from '@/features/account/WalletView';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.wallet };
}

export default async function WalletPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.wallet}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{m.pages.walletLead}</p>

      <div className="mt-5">
        <WalletView />
      </div>
    </>
  );
}
