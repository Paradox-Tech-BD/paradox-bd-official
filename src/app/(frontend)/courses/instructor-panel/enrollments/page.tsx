"use client";

import { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface Enrollment {
  id: number;
  clerk_user_id: string;
  course_id: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  payment_proof_url: string | null;
  created_at: string;
  student?: { name: string; email: string; imageUrl: string };
  course?: { title: string; slug: string };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch('/api/instructor/enrollments', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setEnrollments(data.enrollments ?? []);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateEnrollment(enrollmentId: number, status: 'approved' | 'rejected') {
    await fetch('/api/instructor/enrollments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, status }),
    });
    await refresh();
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 size={28} className='text-violet-400 animate-spin' />
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>Enrollments</h1>
      <p className='text-white/40 text-sm mb-8'>Review and approve student enrollment requests</p>

      <div className='rounded-xl border border-white/[0.08] bg-dark-card overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider'>
            <tr>
              <th className='px-4 py-3'>Student</th>
              <th className='px-4 py-3'>Course</th>
              <th className='px-4 py-3'>Proof</th>
              <th className='px-4 py-3'>Date</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className='border-t border-white/[0.04] align-top'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    {enrollment.student?.imageUrl ? (
                      <img
                        src={enrollment.student.imageUrl}
                        alt={enrollment.student.name}
                        className='w-8 h-8 rounded-full border border-white/[0.08]'
                      />
                    ) : (
                      <div className='w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08]' />
                    )}
                    <div className='min-w-0'>
                      <p className='text-sm text-white/80 truncate'>{enrollment.student?.name ?? enrollment.clerk_user_id}</p>
                      <p className='text-xs text-white/30 truncate'>{enrollment.student?.email ?? ''}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 text-sm text-white/60'>{enrollment.course?.title ?? enrollment.course_id}</td>
                <td className='px-4 py-3 text-sm'>
                  {enrollment.payment_proof_url ? (
                    <a
                      href={enrollment.payment_proof_url}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 text-violet-400 hover:text-violet-300'
                    >
                      <span>View</span>
                      <img
                        src={enrollment.payment_proof_url}
                        alt='Payment proof'
                        className='w-10 h-10 rounded border border-white/[0.08] object-cover'
                      />
                    </a>
                  ) : (
                    <span className='text-white/20'>-</span>
                  )}
                </td>
                <td className='px-4 py-3 text-sm text-white/30'>{new Date(enrollment.created_at).toLocaleDateString()}</td>
                <td className='px-4 py-3 text-sm'>
                  <span className={
                    enrollment.status === 'approved'
                      ? 'text-emerald-400'
                      : enrollment.status === 'rejected'
                        ? 'text-red-400'
                        : 'text-amber-400'
                  }>
                    {enrollment.status}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  {enrollment.status === 'pending' ? (
                    <div className='flex gap-2'>
                      <button
                        onClick={() => updateEnrollment(enrollment.id, 'approved')}
                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs'
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => updateEnrollment(enrollment.id, 'rejected')}
                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs'
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className='text-white/20 text-xs'>Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
