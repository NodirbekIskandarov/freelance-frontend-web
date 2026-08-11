import type { FreelancerProfile } from '@/shared/types/freelance';

import { seed as materialsSeed } from '../materials/seed';

/**
 * Freelancer katalogi urug'i.
 *
 * Universitet nomlari bu yerda TAKRORLANMAYDI — materiallar urug'idan
 * `universityId` orqali olinadi. Aks holda "TATU" bir faylda o'zgarib,
 * ikkinchisida eskicha qolib ketardi.
 */

interface FreelancerSeedRow {
  id: string;
  slug: string;
  name: string;
  universityId: string;
  primarySkill: string;
  skills: string[];
  level: FreelancerProfile['level'];
  rating: number;
  reviews: number;
  completedWorks: number;
  priceFrom: number;
  isOnline: boolean;
  availability: FreelancerProfile['availability'];
  activeOrderTitle?: string;
  joinedAt: string;
  bio: string;
  avatarGradient: string;
}

const rows: FreelancerSeedRow[] = [
  {
    id: 'flr-01',
    slug: 'sardor-alimov',
    name: 'Sardor Alimov',
    universityId: 'uni-tatu',
    primarySkill: 'Web dasturlash',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    level: 'senior',
    rating: 4.9,
    reviews: 128,
    completedWorks: 164,
    priceFrom: 150000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-02-14',
    bio: "Full-stack dasturchi. Kurs ishlari, diplom loyihalari va real web ilovalar bo'yicha 160 dan ortiq ish bajarganman.",
    avatarGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'flr-02',
    slug: 'nilufar-rahimova',
    name: 'Nilufar Rahimova',
    universityId: 'uni-tdiu',
    primarySkill: 'Iqtisodiy tahlil',
    skills: ['Excel', 'SPSS', 'Statistika', 'Biznes-reja'],
    level: 'expert',
    rating: 4.9,
    reviews: 96,
    completedWorks: 118,
    priceFrom: 120000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2022-09-03',
    bio: "Iqtisodiyot yo'nalishida mustaqil ishlar, kurs ishlari va tahliliy hisobotlar tayyorlayman.",
    avatarGradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'flr-03',
    slug: 'jasur-karimov',
    name: 'Jasur Karimov',
    universityId: 'uni-tdtu',
    primarySkill: 'Chizmachilik',
    skills: ['AutoCAD', 'SolidWorks', 'Kompas-3D'],
    level: 'senior',
    rating: 4.8,
    reviews: 74,
    completedWorks: 92,
    priceFrom: 90000,
    isOnline: false,
    availability: 'busy',
    activeOrderTitle: 'Uy-joy loyihasi — 2 qavatli fasad chizmasi',
    joinedAt: '2023-05-21',
    bio: "Muhandislik chizmalari, detal va yig'ma birliklar, AutoCAD va SolidWorks loyihalari.",
    avatarGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'flr-04',
    slug: 'zarina-mamatova',
    name: 'Zarina Mamatova',
    universityId: 'uni-ozmu',
    primarySkill: 'Matn va kontent',
    skills: ['Insho', 'Referat', 'Tahrir', 'SMM'],
    level: 'middle',
    rating: 4.7,
    reviews: 61,
    completedWorks: 88,
    priceFrom: 70000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-11-08',
    bio: "Akademik matnlar, insholar va referatlar. Plagiatsiz, manbalar ro'yxati bilan.",
    avatarGradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'flr-05',
    slug: 'bobur-toshmatov',
    name: 'Bobur Toshmatov',
    universityId: 'uni-inha',
    primarySkill: 'Mobil ilova',
    skills: ['Flutter', 'Dart', 'Firebase', 'Kotlin'],
    level: 'senior',
    rating: 4.8,
    reviews: 53,
    completedWorks: 67,
    priceFrom: 180000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-07-19',
    bio: "Flutter va Kotlin'da mobil ilovalar. Diplom loyihalari uchun to'liq ishlaydigan prototip.",
    avatarGradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'flr-06',
    slug: 'madina-yusupova',
    name: 'Madina Yusupova',
    universityId: 'uni-tsul',
    primarySkill: 'Yuridik tahlil',
    skills: ['Huquq', 'Shartnoma', 'Referat'],
    level: 'middle',
    rating: 4.6,
    reviews: 38,
    completedWorks: 45,
    priceFrom: 100000,
    isOnline: false,
    availability: 'available',
    joinedAt: '2024-01-26',
    bio: "Huquq yo'nalishi bo'yicha kurs ishlari, tahliliy sharhlar va mustaqil ishlar.",
    avatarGradient: 'from-slate-500 to-slate-700',
  },
  {
    id: 'flr-07',
    slug: 'aziz-nazarov',
    name: 'Aziz Nazarov',
    universityId: 'uni-tatu',
    primarySkill: 'Backend',
    skills: ['Python', 'Django', 'FastAPI', 'Docker'],
    level: 'expert',
    rating: 5,
    reviews: 142,
    completedWorks: 187,
    priceFrom: 200000,
    isOnline: true,
    availability: 'busy',
    activeOrderTitle: 'Mobil ilova uchun REST API',
    joinedAt: '2022-04-11',
    bio: "Backend arxitekturasi, API va ma'lumotlar bazasi. Katta diplom loyihalari bilan ishlayman.",
    avatarGradient: 'from-emerald-600 to-green-700',
  },
  {
    id: 'flr-08',
    slug: 'kamola-ergasheva',
    name: 'Kamola Ergasheva',
    universityId: 'uni-wiut',
    primarySkill: 'Tarjima',
    skills: ['Ingliz tili', 'Rus tili', 'Texnik tarjima'],
    level: 'senior',
    rating: 4.9,
    reviews: 87,
    completedWorks: 133,
    priceFrom: 60000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-03-30',
    bio: "Ingliz–o'zbek va rus–o'zbek yo'nalishida ilmiy va texnik tarjima.",
    avatarGradient: 'from-cyan-500 to-sky-600',
  },
  {
    id: 'flr-09',
    slug: 'ulugbek-saidov',
    name: "Ulug'bek Saidov",
    universityId: 'uni-samdu',
    primarySkill: 'Laboratoriya ishlari',
    skills: ['Fizika', 'MATLAB', 'Hisobot'],
    level: 'middle',
    rating: 4.5,
    reviews: 29,
    completedWorks: 34,
    priceFrom: 65000,
    isOnline: false,
    availability: 'available',
    joinedAt: '2024-04-02',
    bio: 'Fizika va texnik fanlar bo‘yicha laboratoriya ishlari, hisobot va grafiklar.',
    avatarGradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'flr-10',
    slug: 'dilshod-usmonov',
    name: 'Dilshod Usmonov',
    universityId: 'uni-tdtu',
    primarySkill: 'Ma’lumotlar bazasi',
    skills: ['SQL', 'PostgreSQL', 'ER-diagramma', '1C'],
    level: 'senior',
    rating: 4.7,
    reviews: 45,
    completedWorks: 58,
    priceFrom: 130000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-08-15',
    bio: "Ma'lumotlar bazasi loyihalash, normalizatsiya, so'rovlar va 1C konfiguratsiyasi.",
    avatarGradient: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'flr-11',
    slug: 'shahnoza-qodirova',
    name: 'Shahnoza Qodirova',
    universityId: 'uni-tma',
    primarySkill: 'Tibbiy referat',
    skills: ['Anatomiya', 'Referat', 'Taqdimot'],
    level: 'intern',
    rating: 4.4,
    reviews: 12,
    completedWorks: 15,
    priceFrom: 55000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2025-02-10',
    bio: "Tibbiyot yo'nalishi bo'yicha referat, taqdimot va mustaqil ishlar tayyorlayman.",
    avatarGradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'flr-12',
    slug: 'temur-yoldoshev',
    name: "Temur Yo'ldoshev",
    universityId: 'uni-buxdu',
    primarySkill: 'Grafik dizayn',
    skills: ['Figma', 'Photoshop', 'Illustrator'],
    level: 'middle',
    rating: 4.6,
    reviews: 41,
    completedWorks: 62,
    priceFrom: 80000,
    isOnline: false,
    availability: 'busy',
    activeOrderTitle: 'Landing page dizayni',
    joinedAt: '2023-12-05',
    bio: "Taqdimot dizayni, plakat, infografika va UI maketlar.",
    avatarGradient: 'from-fuchsia-500 to-violet-600',
  },
  {
    id: 'flr-13',
    slug: 'gulnora-abdullayeva',
    name: 'Gulnora Abdullayeva',
    universityId: 'uni-ozmu',
    primarySkill: 'Kurs ishlari',
    skills: ['Referat', 'Taqdimot', 'Tahlil'],
    level: 'senior',
    rating: 4.8,
    reviews: 103,
    completedWorks: 149,
    priceFrom: 95000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2022-11-17',
    bio: "Gumanitar fanlar bo'yicha kurs ishlari va mustaqil ishlar. Talab bo'yicha tuzatishlar bepul.",
    avatarGradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'flr-14',
    slug: 'islom-berdiyev',
    name: 'Islom Berdiyev',
    universityId: 'uni-inha',
    primarySkill: 'Algoritmlar',
    skills: ['C++', 'Python', 'Algoritm', 'Olimpiada'],
    level: 'expert',
    rating: 4.9,
    reviews: 67,
    completedWorks: 81,
    priceFrom: 140000,
    isOnline: true,
    availability: 'available',
    joinedAt: '2023-01-09',
    bio: "Algoritm va ma'lumotlar tuzilmasi bo'yicha topshiriqlar, kod tahlili va tushuntirish.",
    avatarGradient: 'from-lime-500 to-emerald-600',
  },
];

/**
 * Nishon (badge) qo'lda yozilmaydi — bajarilgan ishlar sonidan kelib
 * chiqadi. Aks holda urug'da "Top" nishonli, lekin 3 ta ishi bor
 * freelancer paydo bo'lishi mumkin edi.
 */
function badgeFor(completedWorks: number): FreelancerProfile['badge'] {
  if (completedWorks >= 100) return 'top';
  if (completedWorks >= 30) return 'pro';
  return 'new';
}

/**
 * Muvaffaqiyat foizi reytingdan chiqariladi, bajarilgan ishlar sonidan emas.
 * Ish soniga bog'laganda formula tez to'yinib, katalogdagi hammaga bir xil
 * 99% berardi — ko'rsatkich ma'nosini yo'qotgan edi.
 */
function successRateFor(rating: number): number {
  return Math.round(78 + (rating - 4.4) * 33);
}

const universityById = new Map(materialsSeed.universities.map((item) => [item.id, item]));

export const freelancers: FreelancerProfile[] = rows.map((row) => {
  const university = universityById.get(row.universityId);
  if (!university) {
    throw new Error(`Freelancer urug'ida noma'lum universitet: ${row.universityId}`);
  }

  return {
    ...row,
    badge: badgeFor(row.completedWorks),
    successRate: successRateFor(row.rating),
    universitySlug: university.slug,
    universityShortName: university.shortName,
    universityFullName: university.fullName,
  };
});
