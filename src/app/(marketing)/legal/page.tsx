import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Foydalanish shartlari va maxfiylik siyosati',
  description:
    "Yopamiz.uz platformasidan foydalanish qoidalari, to'lov va qaytarish shartlari hamda shaxsiy ma'lumotlarni qayta ishlash siyosati.",
  path: '/legal',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Qoidalar', path: '/legal' },
];

const sections = [
  {
    id: 'umumiy',
    title: '1. Umumiy qoidalar',
    paragraphs: [
      'Ushbu shartlar Yopamiz.uz platformasidan foydalanish tartibini belgilaydi. Saytdan foydalanish orqali siz quyidagi qoidalarga rozilik bildirasiz.',
      "Platforma talabalar va mustaqil mutaxassislarni bog'lovchi vositachi sifatida ishlaydi. Ish sifati uchun bevosita javobgarlik uni bajargan freelancer zimmasida bo'ladi, platforma esa nizolarni ko'rib chiqish va mablag'ni himoyalash bilan shug'ullanadi.",
    ],
  },
  {
    id: 'akademik',
    title: '2. Akademik halollik',
    paragraphs: [
      "Platformadagi materiallar o'quv jarayonida yordamchi manba sifatida taqdim etiladi. Ulardan foydalanish tartibi uchun javobgarlik foydalanuvchining o'zida.",
      "Freelancer buyurtmani mustaqil bajarishi shart. Boshqa mualliflarning ishini o'zinikidek taqdim etish yoki bir ishni bir necha kishiga qayta sotish taqiqlanadi va profilni bloklashga olib keladi.",
    ],
  },
  {
    id: 'tolov',
    title: "3. To'lov va qaytarish",
    paragraphs: [
      "To'lov shartnoma tuzilgandan keyin amalga oshiriladi va ish topshirilgunicha platformada saqlanadi. Platforma komissiyasi shartnoma summasining 10% ini tashkil qiladi.",
      "Ish belgilangan muddatda topshirilmasa yoki kelishilgan talablarga javob bermasa, foydalanuvchi murojaat qoldirishi mumkin. Ko'rib chiqish natijasiga ko'ra mablag' qaytariladi yoki ish qayta bajariladi.",
    ],
  },
  {
    id: 'maxfiylik',
    title: "4. Shaxsiy ma'lumotlar",
    paragraphs: [
      "Ro'yxatdan o'tishda kiritilgan ism, telefon raqam va elektron pochta faqat xizmat ko'rsatish, buyurtmalar bo'yicha xabar berish va qo'llab-quvvatlash uchun ishlatiladi.",
      "Freelancer arizasidagi hujjat ma'lumotlari yopiq saqlanadi va faqat administrator tekshiruvi uchun ochiladi. Ular uchinchi shaxslarga berilmaydi.",
      "Foydalanuvchi istalgan vaqtda o'z ma'lumotlarini o'chirishni so'rashi mumkin — buning uchun qo'llab-quvvatlash xizmatiga murojaat qiling.",
    ],
  },
  {
    id: 'javobgarlik',
    title: '5. Javobgarlikni cheklash',
    paragraphs: [
      "Platforma texnik uzilishlar, uchinchi tomon to'lov tizimlaridagi nosozliklar yoki foydalanuvchi tomonidan noto'g'ri kiritilgan ma'lumotlar oqibatlari uchun javob bermaydi.",
      "Ushbu shartlarga o'zgartirish kiritilishi mumkin. Muhim o'zgarishlar haqida foydalanuvchilar oldindan xabardor qilinadi.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Foydalanish shartlari
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Platformadan foydalanish qoidalari va shaxsiy ma&apos;lumotlarni qayta ishlash siyosati.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          {/*
            Mundarija `<nav>` ichida: uzun huquqiy matnda kerakli bo'limga
            o'tish klaviatura va skrinrider bilan ham oson bo'lishi kerak.
          */}
          <nav aria-label="Mundarija" className="lg:order-2 lg:w-60 lg:shrink-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Mundarija
            </p>
            <ul className="mt-3 space-y-2 lg:sticky lg:top-24">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl min-w-0 flex-1 space-y-8 lg:order-1">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              Savollar bo&apos;yicha:{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
