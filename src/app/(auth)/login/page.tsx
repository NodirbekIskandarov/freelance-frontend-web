import { LoginForm } from '@/features/auth/LoginForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kirish',
  description: 'Yopamiz.uz hisobingizga kiring va topshiriqlaringizni boshqaring.',
  path: '/login',
});

export default function LoginPage() {
  return <LoginForm />;
}
