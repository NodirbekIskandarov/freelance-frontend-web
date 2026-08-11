import { StudentDownloads } from '@/features/student/StudentDownloads';

export const metadata = { title: 'Yuklamalar' };

export default function StudentDownloadsPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Yuklamalar</h2>
      <div className="mt-4">
        <StudentDownloads />
      </div>
    </>
  );
}
