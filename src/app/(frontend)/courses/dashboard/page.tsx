import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Heading from '@/components/shared/heading';
import { getUserRole } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Settings, GraduationCap } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/courses/sign-in');

  const role = await getUserRole(userId);

  return (
    <main className='overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-20'>
        <span className='section-label'>Dashboard</span>
        <Heading tag="h1" size="xxl" className='mt-4'>
          Welcome Back
        </Heading>
        <p className='mt-4 text-white/50 text-lg'>
          Your learning hub. Track progress, access courses, and manage your account.
        </p>

        <div className='mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
          <Link href='/courses/all' className='group hover-lift'>
            <div className='p-6 rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] bg-dark-card transition-all duration-300'>
              <BookOpen size={24} className='text-violet-400' />
              <h3 className='mt-4 text-lg font-medium text-white'>Browse Courses</h3>
              <p className='mt-2 text-sm text-white/40'>Explore our full catalog of courses.</p>
            </div>
          </Link>

          <div className='p-6 rounded-xl border border-white/[0.08] bg-dark-card'>
            <GraduationCap size={24} className='text-emerald-400' />
            <h3 className='mt-4 text-lg font-medium text-white'>My Enrollments</h3>
            <p className='mt-2 text-sm text-white/40'>No enrollments yet. Start learning today!</p>
          </div>

          {(role === 'admin' || role === 'instructor') && (
            <Link href='/courses/instructor-panel' className='group hover-lift'>
              <div className='p-6 rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] bg-dark-card transition-all duration-300'>
                <Settings size={24} className='text-amber-400' />
                <h3 className='mt-4 text-lg font-medium text-white'>Instructor Panel</h3>
                <p className='mt-2 text-sm text-white/40'>Manage your courses and students.</p>
              </div>
            </Link>
          )}
        </div>

        <div className='mt-8 p-4 rounded-lg border border-white/[0.06] bg-dark-surface'>
          <p className='text-xs text-white/30'>
            Role: <span className='text-white/50 font-medium'>{role}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
