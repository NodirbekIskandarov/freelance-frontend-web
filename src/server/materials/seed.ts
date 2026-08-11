import {
  TASK_TYPE_LABELS,
  type Subject,
  type Task,
  type University,
} from '@/shared/types/materials';

/**
 * Katalog urug'i (seed) — eski ilovaning `lib/materials/universities-seed.ts`
 * faylidan ko'chirilgan universitetlar va ularning fanlari.
 *
 * Bu fayl `server/` ostida: u FAQAT server tomonda o'qiladi va hech qachon
 * mijoz bundle'iga tushmaydi. Ma'lumot backend'dan kelgach, faqat
 * `catalog.ts` dagi funksiyalar `fetch()`ga o'tadi — sahifalar o'zgarmaydi.
 */

const universities: University[] = [
  {
    id: 'uni-tatu',
    slug: 'tatu',
    shortName: 'TATU',
    fullName: 'Toshkent axborot texnologiyalari universiteti',
    category: 'Texnika',
    region: 'Toshkent shahri',
    logoInitials: 'TA',
    logoGradient: 'from-emerald-500 to-teal-600',
    subjectCount: 6,
    taskCount: 1240,
  },
  {
    id: 'uni-tdtu',
    slug: 'tdtu',
    shortName: 'TDTU',
    fullName: 'Toshkent davlat texnika universiteti',
    category: 'Texnika',
    region: 'Toshkent shahri',
    logoInitials: 'TD',
    logoGradient: 'from-amber-400 to-orange-500',
    subjectCount: 5,
    taskCount: 980,
  },
  {
    id: 'uni-tdiu',
    slug: 'tdiu',
    shortName: 'TDIU',
    fullName: 'Toshkent davlat iqtisodiyot universiteti',
    category: 'Iqtisodiyot',
    region: 'Toshkent shahri',
    logoInitials: 'TI',
    logoGradient: 'from-blue-500 to-indigo-600',
    subjectCount: 5,
    taskCount: 870,
  },
  {
    id: 'uni-ozmu',
    slug: 'ozmu',
    shortName: "O'zMU",
    fullName: "O'zbekiston Milliy universiteti",
    category: 'Tabiiy fanlar',
    region: 'Toshkent shahri',
    logoInitials: 'OZ',
    logoGradient: 'from-violet-500 to-purple-600',
    subjectCount: 5,
    taskCount: 1120,
  },
  {
    id: 'uni-tsul',
    slug: 'tsul',
    shortName: 'TSUL',
    fullName: 'Toshkent davlat yuridik universiteti',
    category: 'Gumanitar',
    region: 'Toshkent shahri',
    logoInitials: 'TS',
    logoGradient: 'from-slate-500 to-zinc-600',
    subjectCount: 4,
    taskCount: 540,
  },
  {
    id: 'uni-tma',
    slug: 'tma',
    shortName: 'TMA',
    fullName: 'Toshkent tibbiyot akademiyasi',
    category: 'Tibbiyot',
    region: 'Toshkent shahri',
    logoInitials: 'TM',
    logoGradient: 'from-rose-500 to-red-600',
    subjectCount: 4,
    taskCount: 610,
  },
  {
    id: 'uni-wiut',
    slug: 'wiut',
    shortName: 'WIUT',
    fullName: 'Westminster International University in Tashkent',
    category: 'Iqtisodiyot',
    region: 'Toshkent shahri',
    logoInitials: 'WI',
    logoGradient: 'from-cyan-500 to-blue-600',
    subjectCount: 4,
    taskCount: 430,
  },
  {
    id: 'uni-inha',
    slug: 'inha',
    shortName: 'INHA',
    fullName: 'INHA University in Tashkent',
    category: 'Texnika',
    region: 'Toshkent shahri',
    logoInitials: 'IN',
    logoGradient: 'from-indigo-500 to-violet-600',
    subjectCount: 5,
    taskCount: 760,
  },
  {
    id: 'uni-samdu',
    slug: 'samdu',
    shortName: 'SamDU',
    fullName: 'Samarqand davlat universiteti',
    category: 'Gumanitar',
    region: 'Samarqand viloyati',
    logoInitials: 'SD',
    logoGradient: 'from-amber-500 to-yellow-600',
    subjectCount: 5,
    taskCount: 690,
  },
  {
    id: 'uni-buxdu',
    slug: 'buxdu',
    shortName: 'BuxDU',
    fullName: 'Buxoro davlat universiteti',
    category: 'Gumanitar',
    region: 'Buxoro viloyati',
    logoInitials: 'BX',
    logoGradient: 'from-emerald-600 to-green-700',
    subjectCount: 4,
    taskCount: 520,
  },
];

/** Fan nomlaridan barqaror slug yasaydi. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
    .replace(/^-|-$/g, '');
}

const subjectsByUniversity: Record<
  string,
  { name: string; course: number; semester: number; taskCount: number }[]
> = {
  'uni-tatu': [
    { name: 'Dasturlash asoslari', course: 1, semester: 1, taskCount: 245 },
    { name: "Ma'lumotlar bazasi", course: 2, semester: 4, taskCount: 198 },
    { name: "Ma'lumotlar tuzilmalari", course: 2, semester: 3, taskCount: 156 },
    { name: 'Kompyuter arxitekturasi', course: 3, semester: 5, taskCount: 132 },
    { name: 'Operatsion tizimlar', course: 3, semester: 5, taskCount: 146 },
    { name: 'Web dasturlash', course: 3, semester: 6, taskCount: 167 },
  ],
  'uni-tdtu': [
    { name: 'Nazariy mexanika', course: 2, semester: 3, taskCount: 210 },
    { name: 'Chizma geometriya', course: 1, semester: 2, taskCount: 188 },
    { name: 'Materiallar qarshiligi', course: 2, semester: 4, taskCount: 174 },
    { name: 'AutoCAD', course: 1, semester: 2, taskCount: 205 },
    { name: 'Elektrotexnika', course: 2, semester: 3, taskCount: 163 },
  ],
  'uni-tdiu': [
    { name: 'Mikroiqtisodiyot', course: 1, semester: 1, taskCount: 192 },
    { name: 'Makroiqtisodiyot', course: 1, semester: 2, taskCount: 181 },
    { name: 'Buxgalteriya hisobi', course: 2, semester: 3, taskCount: 176 },
    { name: 'Statistika', course: 2, semester: 4, taskCount: 154 },
    { name: 'Marketing asoslari', course: 3, semester: 5, taskCount: 143 },
  ],
  'uni-ozmu': [
    { name: 'Matematik analiz', course: 1, semester: 1, taskCount: 264 },
    { name: 'Umumiy fizika', course: 1, semester: 2, taskCount: 231 },
    { name: 'Analitik kimyo', course: 2, semester: 3, taskCount: 187 },
    { name: 'Ehtimollar nazariyasi', course: 2, semester: 4, taskCount: 165 },
    { name: 'Diskret matematika', course: 2, semester: 3, taskCount: 149 },
  ],
  'uni-tsul': [
    { name: 'Konstitutsiyaviy huquq', course: 1, semester: 1, taskCount: 138 },
    { name: 'Fuqarolik huquqi', course: 2, semester: 3, taskCount: 146 },
    { name: 'Jinoyat huquqi', course: 2, semester: 4, taskCount: 132 },
    { name: 'Xalqaro huquq', course: 3, semester: 5, taskCount: 118 },
  ],
  'uni-tma': [
    { name: 'Anatomiya', course: 1, semester: 1, taskCount: 172 },
    { name: 'Fiziologiya', course: 2, semester: 3, taskCount: 158 },
    { name: 'Biokimyo', course: 2, semester: 4, taskCount: 141 },
    { name: 'Farmakologiya', course: 3, semester: 5, taskCount: 126 },
  ],
  'uni-wiut': [
    { name: 'Business Statistics', course: 1, semester: 2, taskCount: 121 },
    { name: 'Financial Accounting', course: 2, semester: 3, taskCount: 114 },
    { name: 'Economics', course: 1, semester: 1, taskCount: 108 },
    { name: 'Business Law', course: 3, semester: 5, taskCount: 92 },
  ],
  'uni-inha': [
    { name: 'Calculus', course: 1, semester: 1, taskCount: 176 },
    { name: 'Data Structures', course: 2, semester: 3, taskCount: 162 },
    { name: 'Computer Networks', course: 3, semester: 5, taskCount: 138 },
    { name: 'Operating Systems', course: 3, semester: 5, taskCount: 144 },
    { name: 'Algorithms', course: 2, semester: 4, taskCount: 151 },
  ],
  'uni-samdu': [
    { name: "O'zbek tili", course: 1, semester: 1, taskCount: 134 },
    { name: 'Adabiyotshunoslik', course: 2, semester: 3, taskCount: 121 },
    { name: 'Tarix', course: 1, semester: 2, taskCount: 143 },
    { name: 'Pedagogika', course: 2, semester: 4, taskCount: 116 },
    { name: 'Psixologiya', course: 3, semester: 5, taskCount: 108 },
  ],
  'uni-buxdu': [
    { name: 'Ingliz tili', course: 1, semester: 1, taskCount: 152 },
    { name: 'Geografiya', course: 2, semester: 3, taskCount: 118 },
    { name: 'Biologiya', course: 1, semester: 2, taskCount: 131 },
    { name: 'Ekologiya', course: 3, semester: 5, taskCount: 97 },
  ],
};

const subjects: Subject[] = Object.entries(subjectsByUniversity).flatMap(([universityId, list]) => {
  const university = universities.find((item) => item.id === universityId)!;

  return list.map((item, index) => ({
    id: `${universityId}-sub-${index + 1}`,
    slug: slugify(item.name),
    universityId,
    name: item.name,
    category: university.category,
    course: item.course,
    semester: item.semester,
    taskCount: item.taskCount,
  }));
});

const TASK_TYPE_CYCLE = ['independent_work', 'practical_work', 'laboratory_work'] as const;

/**
 * Har fan uchun topshiriqlar determinlashtirilgan tarzda hosil qilinadi —
 * `Math.random` yo'q, shuning uchun har build bir xil natija beradi va
 * statik generatsiya (`generateStaticParams`) barqaror ishlaydi.
 *
 * Sarlavha turdan KELIB CHIQADI (`TASK_TYPE_LABELS`), alohida ro'yxatdan
 * emas: aks holda "Kurs ishi №4" nomli qator "Mustaqil ish" turini
 * ko'rsatib, ma'lumot o'zi bilan ziddiyatga tushadi.
 */
const tasks: Task[] = subjects.flatMap((subject) =>
  Array.from({ length: 8 }, (_, index) => {
    const taskType = TASK_TYPE_CYCLE[index % TASK_TYPE_CYCLE.length]!;
    const hasVariants = index % 3 !== 2;
    const title = `${TASK_TYPE_LABELS[taskType]} №${index + 1}`;

    return {
      id: `${subject.id}-task-${index + 1}`,
      subjectId: subject.id,
      slug: `${slugify(TASK_TYPE_LABELS[taskType])}-${index + 1}`,
      title,
      taskType,
      hasVariants,
      variantCount: hasVariants ? 10 + (index % 4) * 5 : null,
      course: subject.course,
      semester: subject.semester,
      status: index % 4 === 3 ? 'partial' : 'has_solution',
      priceFrom: 15_000 + (index % 5) * 5_000,
    } satisfies Task;
  }),
);

export const seed = { universities, subjects, tasks };
