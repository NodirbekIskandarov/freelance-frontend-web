import { createElement } from 'react';
import {
  Atom,
  BookOpen,
  Calculator,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  Landmark,
  Languages,
  LayoutGrid,
  Leaf,
  LineChart,
  MoreHorizontal,
  Network,
  Palette,
  Ruler,
  Scale,
  Sigma,
  Stethoscope,
  Wheat,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Katalog KO'RINISHI — backend bermaydigan vizual tafsilotlar.
 *
 * Institut logotipi, fan ikonkasi va yo'nalish ikonkasi API'da yo'q.
 * Ularni qo'lda jadvalga yozib qo'yish yangi institut yoki fan
 * qo'shilishi bilan eskirardi, shuning uchun hammasi MA'LUMOTDAN
 * hosil qilinadi: rang — ID'dan, ikonka — nomdagi kalit so'zdan.
 */

/*
 * Institut belgisi — BITTA oila, olti xil to'yingan rang emas.
 *
 * Ilgari bu yerda emerald, ko'k, binafsha, sariq, pushti va moviy
 * gradiyentlar bor edi va ular ro'yxatda yonma-yon turardi. Rang hech
 * qanday ma'no bermasdi — institutni faqat NOMI ajratadi — lekin ko'z
 * har safar o'sha rangdan ma'no izlab qolardi va sahifadagi eng
 * to'yingan narsa aynan shu kvadratchalar bo'lardi.
 *
 * Farq saqlandi, lekin bo'g'iq: brend rangining to'rt bosqichi. Bir xil
 * ID har doim bir xil bosqichni beradi — sahifalar orasida barqaror.
 */
const AVATAR_TONES = [
  'bg-brand-subtle text-brand border-brand-border',
  'bg-muted text-foreground border-border',
  'bg-brand-subtle text-brand border-brand-border',
  'bg-muted text-muted-foreground border-border',
];

export function gradientFor(id: string): string {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_TONES[sum % AVATAR_TONES.length]!;
}

export function initialsOf(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '—';

  // Qisqartma allaqachon bosh harflardan iborat bo'lsa (TATU, TDPU) —
  // uni bo'lakka ajratmaymiz, birinchi ikki harfini olamiz.
  if (/^[A-ZА-ЯЎҚҒҲ'‘’]+$/.test(trimmed)) return trimmed.slice(0, 2);

  const parts = trimmed.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Fan nomidagi kalit so'zdan ikonka.
 *
 * Ro'yxat yuqoridan pastga tekshiriladi — birinchi mos kelgani yutadi,
 * shuning uchun aniqroq so'zlar ("dasturlash") umumiylaridan
 * ("informatika") oldin turishi kerak.
 */
const SUBJECT_ICON_RULES: { icon: LucideIcon; words: string[] }[] = [
  { icon: Code2, words: ['dastur', 'program', 'software', 'kod', 'web', 'python', 'java'] },
  { icon: Database, words: ['baza', 'database', 'data', 'ma’lumotlar bazasi'] },
  { icon: Network, words: ['tarmoq', 'network', 'internet', 'telekom'] },
  { icon: CircuitBoard, words: ['elektron', 'sxemotex', 'mikro'] },
  { icon: Zap, words: ['elektr', 'energ'] },
  { icon: Cpu, words: ['komputer', 'kompyuter', 'computer', 'informat', 'axborot', 'intellekt'] },
  { icon: Sigma, words: ['matematik', 'algebra', 'geometr', 'analiz'] },
  { icon: Calculator, words: ['hisob', 'buxgalter', 'statistik'] },
  { icon: LineChart, words: ['iqtisod', 'moliya', 'menejment', 'marketing', 'biznes'] },
  { icon: Atom, words: ['fizika', 'astronom'] },
  { icon: FlaskConical, words: ['kimyo', 'chemistry'] },
  { icon: Leaf, words: ['biolog', 'ekolog', 'botanik'] },
  { icon: Wheat, words: ['qishloq', 'agro', 'ziroat'] },
  { icon: Stethoscope, words: ['tibbiyot', 'anatomi', 'farmatsev', 'meditsina'] },
  { icon: Scale, words: ['huquq', 'yurid', 'qonun'] },
  { icon: Languages, words: ['til', 'tarjima', 'ingliz', 'lingvist', 'filolog'] },
  { icon: Landmark, words: ['tarix', 'falsafa', 'siyos', 'sotsiolog'] },
  { icon: Palette, words: ["san'at", 'sanat', 'dizayn', 'musiqa', 'rassom'] },
  { icon: Ruler, words: ['chizma', 'geodez', 'arxitek', 'qurilish'] },
  { icon: Wrench, words: ['mexanik', 'muhandis', 'texnolog', 'mashina'] },
  { icon: BookOpen, words: ['pedagog', 'psixolog', "ta'lim", 'talim'] },
];

export function subjectIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();

  for (const rule of SUBJECT_ICON_RULES) {
    if (rule.words.some((word) => lower.includes(word))) return rule.icon;
  }

  return BookOpen;
}

/** Yo'nalish (kategoriya) chiplari uchun ikonka — fan bilan bir xil qoida. */
export function directionIcon(name: string): LucideIcon {
  if (!name) return MoreHorizontal;
  return subjectIcon(name);
}

/**
 * Ikonkani KOMPONENT sifatida chizadi.
 *
 * `const Icon = subjectIcon(name)` deb yozib `<Icon />` chaqirish React
 * uchun "renderda komponent yaratish" bo'lib ko'rinadi va lint buni
 * to'g'ri belgilaydi: har renderda yangi tur paydo bo'lsa React daraxtni
 * qayta yaratadi. `createElement` bilan bunday bo'lmaydi.
 */
export function SubjectIcon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(subjectIcon(name), { className, strokeWidth });
}

export function DirectionIcon({
  name,
  className,
}: {
  /** Bo'sh satr — «Barchasi» chipi uchun to'r ikonkasi. */
  name: string;
  className?: string;
}) {
  return createElement(name ? directionIcon(name) : LayoutGrid, { className });
}
