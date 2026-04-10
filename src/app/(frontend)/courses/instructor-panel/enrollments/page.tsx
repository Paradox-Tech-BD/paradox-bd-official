"use client"
import { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface Enrollment {
  id: number;
  clerk_user_id: string;
  course_id: string;
  status: string;
  payment_proof_url: string | null;
  created_at: string;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instructor/enrollments')
      .then((res) => res.json())
      .then((data) => setEnrollments(data.enrollments ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateEnrollment(enrollmentId: number, status: 'approved' | 'rejected') {
    await fetch('/api/instructor/enrollments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, status }),
    });
    const res = await fetch('/api/instructor/enrollments');
    const data = await res.json();
    setEnrollments(data.enrollments ?? []);
  }

  if (loading) {
    return <div className='flex items-center justify-center h-64'><Loader2 size={28} className='text-violet-400 animate-spin' /></div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>Enrollments</h1>
      <p className='text-white/40 text-sm mb-8'>Review and approve student enrollment requests</p>
      <div className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] overflow-hidden'>
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
              <tr key={enrollment.id} className='border-t border-white/[0.04]'>
                <td className='px-4 py-3 text-sm text-white/70'>{enrollment.clerk_user_id}</td>
                <td className='px-4 py-3 text-sm text-white/50'>{enrollment.course_id}</td>
                <td className='px-4 py-3 text-sm'>{enrollment.payment_proof_url ? <a href={enrollment.payment_proof_url} target='_blank' className='text-violet-400'>View</a> : <span className='text-white/20'>-</span>}</td>
                <td className='px-4 py-3 text-sm text-white/30'>{new Date(enrollment.created_at).toLocaleDateString()}</td>
                <td className='px-4 py-3 text-sm'><span className='text-amber-400'>{enrollment.status}</span></td>
                <td className='px-4 py-3'>
                  {enrollment.status === 'pending' ? (
                    <div className='flex gap-2'>
                      <button onClick={() => updateEnrollment(enrollment.id, 'approved')} className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs'><Check size={12} /> Approve</button>
                      <button onClick={() => updateEnrollment(enrollment.id, 'rejected')} className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs'><X size={12} /> Reject</button>
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
