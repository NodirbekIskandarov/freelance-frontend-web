import { OpenTaskBoard } from '@/features/freelancer/OpenTaskBoard';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.openTasks };
}

export default async function FreelancerBoardPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.openTasks}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{m.pages.boardLead}</p>
      <div className="mt-4">
        <OpenTaskBoard />
      </div>
    </>
  );
}
