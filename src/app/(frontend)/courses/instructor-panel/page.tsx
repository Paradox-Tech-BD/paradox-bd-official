import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';
import { BookOpen, Users, Clock } from 'lucide-react';

interface Stats {
  activeCourses: number;
  totalStudents: number;
  pendingEnrollments: number;
  recentEnrollments: {
    id: number;
    clerk_user_id: string;
    course_id: string;
    status: string;
    created_at: string;
  }[];
}

export default async function InstructorDashboard() {
  let stats: Stats = { activeCourses: 0, totalStudents: 0, pendingEnrollments: 0, recentEnrollments: [] };
  try {
    const userId = await requireRole('instructor');

    const pool = getPool();
    const coursesResult = await pool.query<{ course_id: string }>(
      'SELECT course_id FROM course_instructors WHERE clerk_user_id = $1',
      [userId]
    );
    const courseIds = coursesResult.rows.map((r) => r.course_id);

    if (courseIds.length > 0) {
      const totalStudents = await pool.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM enrollments WHERE course_id = ANY($1) AND status = 'approved'`,
        [courseIds]
      );

      const pendingEnrollments = await pool.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM enrollments WHERE course_id = ANY($1) AND status = 'pending'`,
        [courseIds]
      );

      const recentEnrollments = await pool.query(
        `SELECT id, clerk_user_id, course_id, status, created_at
         FROM enrollments WHERE course_id = ANY($1)
         ORDER BY created_at DESC LIMIT 10`,
        [courseIds]
      );

      stats = {
        activeCourses: courseIds.length,
        totalStudents: parseInt(totalStudents.rows[0]?.count ?? '0'),
        pendingEnrollments: parseInt(pendingEnrollments.rows[0]?.count ?? '0'),
        recentEnrollments: recentEnrollments.rows as Stats['recentEnrollments'],
      };
    }
  } catch {
    redirect('/courses/dashboard');
  }

  const cards = [
    { label: 'Active Courses', value: stats.activeCourses, icon: BookOpen },
    { label: 'Total Students', value: stats.totalStudents, icon: Users },
    { label: 'Pending Enrollments', value: stats.pendingEnrollments, icon: Clock },
  ];

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold text-white mb-1'>Dashboard</h1>
        <p className='text-white/40 text-sm'>Overview of your teaching activity</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {cards.map((card) => (
          <div key={card.label} className='rounded-xl border border-white/[0.08] bg-dark-card p-5'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs text-white/40 font-mono uppercase tracking-wider'>{card.label}</span>
              <card.icon size={16} className='text-violet-400' />
            </div>
            <p className='text-3xl font-semibold text-white'>{card.value}</p>
          </div>
        ))}
      </div>
      <div className='rounded-xl border border-white/[0.08] bg-dark-card overflow-hidden'>
        <div className='px-5 py-4 border-b border-white/[0.06]'>
          <h2 className='text-sm font-medium text-white'>Recent Enrollments</h2>
        </div>
        <div className='divide-y divide-white/[0.04]'>
          {stats.recentEnrollments.length > 0 ? stats.recentEnrollments.map((enrollment) => (
            <div key={enrollment.id} className='px-5 py-4 flex items-center justify-between'>
              <div>
                <p className='text-sm text-white/80'>{enrollment.clerk_user_id}</p>
                <p className='text-xs text-white/30'>{enrollment.course_id}</p>
              </div>
              <span className='text-xs text-white/40'>{enrollment.status}</span>
            </div>
          )) : <div className='px-5 py-8 text-center text-white/30 text-sm'>No enrollments yet.</div>}
        </div>
      </div>
    </div>
  );
}
