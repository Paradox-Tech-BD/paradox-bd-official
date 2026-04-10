import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { InstructorSidebar } from '@/components/instructor/sidebar';

export default async function InstructorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole('instructor');
  } catch {
    redirect('/courses/dashboard');
  }

  return (
    <div className='min-h-screen bg-dark-bg pt-20'>
      <div className='flex'>
        <InstructorSidebar />
        <main className='flex-1 min-h-[calc(100vh-5rem)] p-6 md:p-8 lg:p-10'>
          {children}
        </main>
      </div>
    </div>
  );
}
