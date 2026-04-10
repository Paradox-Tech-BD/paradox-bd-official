"use client"
import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Loader2 } from 'lucide-react';

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

export default function InstructorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instructor/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 size={28} className='text-violet-400 animate-spin' />
      </div>
    );
  }

  const cards = [
    { label: 'Active Courses', value: stats?.activeCourses ?? 0, icon: BookOpen, color: 'violet' },
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: Users, color: 'emerald' },
    { label: 'Pending Enrollments', value: stats?.pendingEnrollments ?? 0, icon: Clock, color: 'amber' },
  ];

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>Dashboard</h1>
      <p className='text-white/40 text-sm mb-8'>Overview of your teaching activity</p>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
        {cards.map((card) => (
          <div
            key={card.label}
            className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] p-5'
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs text-white/40 font-mono uppercase tracking-wider'>{card.label}</span>
              <card.icon size={16} className={`text-${card.color}-400`} />
            </div>
            <p className='text-3xl font-semibold text-white'>{card.value}</p>
          </div>
        ))}
      </div>

      <div className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)]'>
        <div className='px-5 py-4 border-b border-white/[0.06]'>
          <h2 className='text-sm font-medium text-white'>Recent Enrollments</h2>
        </div>
        <div className='p-5'>
          {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
            <div className='space-y-3'>
              {stats.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className='flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0'
                >
                  <div>
                    <p className='text-sm text-white/70'>{enrollment.clerk_user_id}</p>
                    <p className='text-xs text-white/30 mt-0.5'>
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      enrollment.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : enrollment.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-white/30 text-sm text-center py-4'>No enrollments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
