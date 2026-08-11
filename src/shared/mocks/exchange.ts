import {
  WORK_DIRECTION_LABELS,
  type ExchangeOffer,
  type ExchangeTask,
  type WorkDirectionValue,
} from '../types/freelance';

/**
 * Birja uchun mock ma'lumot.
 *
 * Sanalar `Date.now()`dan emas, qat'iy nuqtadan hisoblanadi: aks holda
 * har yuklashda ro'yxat tartibi o'zgarib, ekran "sakrab" turardi va
 * skrinshot bilan solishtirish imkonsiz bo'lardi.
 */
const EPOCH = Date.parse('2026-08-10T09:00:00.000Z');

function minutesAgo(minutes: number): string {
  return new Date(EPOCH - minutes * 60_000).toISOString();
}

interface TaskSeedRow {
  title: string;
  direction: WorkDirectionValue;
  deadline: string;
  comment: string;
  fileName: string;
  offersCount: number;
  status: ExchangeTask['status'];
  agreedPrice?: number;
}

const taskRows: TaskSeedRow[] = [
  {
    title: 'Mobil ilova uchun backend API ishlab chiqish',
    direction: 'programming',
    deadline: '7',
    comment:
      "REST API, autentifikatsiya va PostgreSQL bazasi kerak. Flutter mobil ilova uchun tayyor endpointlar. Hujjatlashtirish (Swagger) ham kiritilsin.",
    fileName: 'texnik-talabnoma.pdf',
    offersCount: 3,
    status: 'takliflar_kelyapti',
  },
  {
    title: 'Kurs ishi — Library management system',
    direction: 'coursework',
    deadline: '14',
    comment:
      "Python + SQLite yoki Django. CRUD, qidiruv, foydalanuvchi rollari. Hisobot 25–30 bet, ilova va kod repozitoriyasi talab qilinadi.",
    fileName: 'kurs-ishi-talabi.docx',
    offersCount: 2,
    status: 'takliflar_kelyapti',
  },
  {
    title: 'AutoCAD chizma — uy-joy loyihasi',
    direction: 'drawing',
    deadline: '7',
    comment:
      "2 qavatli uy rejasi va fasad. O'lchamlar berilgan skaner asosida. DWG + PDF format.",
    fileName: 'eskiz-sketch.pdf',
    offersCount: 0,
    status: 'yangi',
  },
  {
    title: 'Diplom ishi 2-bob — tahliliy qism',
    direction: 'diploma',
    deadline: '30',
    comment: "Mavzu bo'yicha adabiyotlar tahlili va statistik hisob-kitob. 20 bet atrofida.",
    fileName: 'diplom-reja.docx',
    offersCount: 1,
    status: 'kelishuvda',
    agreedPrice: 850000,
  },
  {
    title: 'Texnik matnni ingliz tilidan tarjima qilish',
    direction: 'translation',
    deadline: '3',
    comment: '12 bet texnik matn. Atamalar lug\'ati bilan birga topshirilsin.',
    fileName: 'manba-matn.pdf',
    offersCount: 0,
    status: 'yakunlandi',
    agreedPrice: 180000,
  },
];

export const mockExchangeTasks: ExchangeTask[] = taskRows.map((row, index) => ({
  id: `extask-${String(index + 1).padStart(2, '0')}`,
  referenceCode: `BRJ-${1000 + index + 1}`,
  title: row.title,
  direction: row.direction,
  directionLabel: WORK_DIRECTION_LABELS[row.direction],
  taskFile: { fileName: row.fileName, fileSize: 240_000 + index * 12_000 },
  deadline: row.deadline,
  comment: row.comment,
  status: row.status,
  offersCount: row.offersCount,
  agreedPrice: row.agreedPrice ?? null,
  createdAt: minutesAgo((index + 1) * 45),
}));

interface OfferSeedRow {
  taskIndex: number;
  freelancerId: string;
  freelancerName: string;
  freelancerRating: number;
  freelancerCompletedWorks: number;
  message: string;
  proposedDeadline: string;
  proposedPrice: number;
}

const offerRows: OfferSeedRow[] = [
  {
    taskIndex: 0,
    freelancerId: 'flr-07',
    freelancerName: 'Aziz Nazarov',
    freelancerRating: 5,
    freelancerCompletedWorks: 187,
    message:
      "Django REST Framework'da qilaman. Autentifikatsiya JWT, Swagger hujjatlari bilan. Oldin shunday 6 ta loyiha topshirganman.",
    proposedDeadline: '7',
    proposedPrice: 1200000,
  },
  {
    taskIndex: 0,
    freelancerId: 'flr-01',
    freelancerName: 'Sardor Alimov',
    freelancerRating: 4.9,
    freelancerCompletedWorks: 164,
    message:
      "Node.js + PostgreSQL. Endpointlarni Postman kolleksiyasi bilan topshiraman, deploy ham kiritilgan.",
    proposedDeadline: '5',
    proposedPrice: 1400000,
  },
  {
    taskIndex: 0,
    freelancerId: 'flr-10',
    freelancerName: 'Dilshod Usmonov',
    freelancerRating: 4.7,
    freelancerCompletedWorks: 58,
    message: "Bazani men loyihalayman, API qismini ham qo'shaman. ER-diagramma ham beraman.",
    proposedDeadline: '10',
    proposedPrice: 950000,
  },
  {
    taskIndex: 1,
    freelancerId: 'flr-14',
    freelancerName: 'Islom Berdiyev',
    freelancerRating: 4.9,
    freelancerCompletedWorks: 81,
    message: "Django'da qilaman, hisobotni ham o'zim yozaman. Kod izohlar bilan bo'ladi.",
    proposedDeadline: '12',
    proposedPrice: 600000,
  },
  {
    taskIndex: 1,
    freelancerId: 'flr-13',
    freelancerName: 'Gulnora Abdullayeva',
    freelancerRating: 4.8,
    freelancerCompletedWorks: 149,
    message: "Hisobot qismini men yozaman, kod uchun sherigim bilan ishlaymiz.",
    proposedDeadline: '14',
    proposedPrice: 520000,
  },
  {
    taskIndex: 3,
    freelancerId: 'flr-02',
    freelancerName: 'Nilufar Rahimova',
    freelancerRating: 4.9,
    freelancerCompletedWorks: 118,
    message: "Statistik tahlilni SPSS'da bajaraman. Adabiyotlar ro'yxati GOST bo'yicha.",
    proposedDeadline: '25',
    proposedPrice: 850000,
  },
];

export const mockExchangeOffers: ExchangeOffer[] = offerRows.map((row, index) => ({
  id: `exoffer-${String(index + 1).padStart(2, '0')}`,
  taskId: mockExchangeTasks[row.taskIndex]!.id,
  freelancerId: row.freelancerId,
  freelancerName: row.freelancerName,
  freelancerRating: row.freelancerRating,
  freelancerCompletedWorks: row.freelancerCompletedWorks,
  message: row.message,
  proposedDeadline: row.proposedDeadline,
  proposedPrice: row.proposedPrice,
  createdAt: minutesAgo(index * 20 + 10),
}));
