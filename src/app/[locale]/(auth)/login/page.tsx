import { LoginForm } from '@/features/auth/LoginForm';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { buildMetadata } from '@/lib/seo';

/*
 * `generateMetadata`, oddiy `metadata` emas: sarlavha ham, kanonik manzil
 * ham tilga bog'liq va ularni statik obyektda hisoblab bo'lmaydi.
 */
export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = (await getMessages(locale)).seo.login;

  return buildMetadata({ title: m.title, description: m.description, path: '/login', locale });
}

export default function LoginPage() {
  return <LoginForm />;
}
