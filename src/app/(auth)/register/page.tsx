import { RegisterForm } from '@/features/auth/RegisterForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "Ro'yxatdan o'tish",
  description:
    'Yopamiz.uz da bepul hisob oching: tayyor topshiriqlar, freelancer xizmatlari va shaxsiy kabinet.',
  path: '/register',
});

export default function RegisterPage() {
  return <RegisterForm />;
}
