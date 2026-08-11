import { StudentProfile } from '@/features/student/StudentProfile';

export const metadata = { title: 'Profil' };

export default function StudentProfilePage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Profil</h2>
      <div className="mt-4">
        <StudentProfile />
      </div>
    </>
  );
}
