import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import Heading from '@/components/shared/heading';

export default async function InstructorPanelPage() {
  try {
    await requireRole('instructor');
  } catch {
    redirect('/courses/dashboard');
  }

  return (
    <main className='overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-20'>
        <span className='section-label'>Instructor Panel</span>
        <Heading tag="h1" size="xxl" className='mt-4'>
          Instructor Dashboard
        </Heading>
        <p className='mt-4 text-white/50 text-lg'>
          Manage your courses, students, and content from here.
        </p>
        <div className='mt-12 p-8 rounded-xl border border-white/[0.08] bg-dark-card text-center'>
          <p className='text-white/40'>Instructor panel features coming soon.</p>
        </div>
      </div>
    </main>
  );
}
