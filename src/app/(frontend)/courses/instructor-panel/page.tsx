import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { BookOpen, Users, Clock, Loader2 } from 'lucide-react';

export default async function InstructorDashboard() {
  try {
    await requireRole('instructor');
  } catch {
    redirect('/courses/dashboard');
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>Dashboard</h1>
      <p className='text-white/40 text-sm mb-8'>Overview of your teaching activity</p>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
        {[
          { label: 'Active Courses', value: 0, icon: BookOpen },
          { label: 'Total Students', value: 0, icon: Users },
          { label: 'Pending Enrollments', value: 0, icon: Clock },
        ].map((card) => (
          <div key={card.label} className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] p-5'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs text-white/40 font-mono uppercase tracking-wider'>{card.label}</span>
              <card.icon size={16} className='text-violet-400' />
            </div>
            <p className='text-3xl font-semibold text-white'>{card.value}</p>
          </div>
        ))}
      </div>
      <div className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] p-6 text-white/40'>
        Recent enrollments will appear here.
      </div>
    </div>
  );
}
