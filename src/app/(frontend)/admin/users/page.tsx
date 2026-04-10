"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Shield, Users, ChevronDown, Loader2 } from 'lucide-react';

interface ClerkUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  role: string;
  createdAt: number;
  assignedCourses: string[];
}

export default function AdminUsersPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningUser, setAssigningUser] = useState<string | null>(null);
  const [courseId, setCourseId] = useState('');

  const role = (user?.publicMetadata?.role as string) ?? 'learner';

  useEffect(() => {
    if (!isLoaded) return;
    if (role !== 'admin') {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUsers(data.users ?? []);
        }
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [isLoaded, role]);

  async function handleAssignInstructor(userId: string) {
    if (!courseId.trim()) return;

    try {
      const res = await fetch('/api/admin/assign-instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId: courseId.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to assign');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: 'instructor' } : u))
      );
      setAssigningUser(null);
      setCourseId('');
    } catch {
      alert('Failed to assign instructor');
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[rgb(12,12,18)]'>
        <Loader2 size={32} className='text-violet-400 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[rgb(12,12,18)]'>
        <div className='p-8 rounded-xl border border-red-500/20 bg-red-500/5 text-center'>
          <Shield size={32} className='text-red-400 mx-auto mb-3' />
          <p className='text-red-400'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[rgb(12,12,18)] text-white p-6 md:p-10'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-3 mb-8'>
          <Users size={24} className='text-violet-400' />
          <h1 className='text-2xl font-semibold'>User Management</h1>
          <span className='ml-auto text-xs text-white/30 bg-white/5 px-2 py-1 rounded'>
            {users.length} users
          </span>
        </div>

        <div className='rounded-xl border border-white/[0.08] overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-white/[0.06] bg-white/[0.02]'>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>User</th>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>Email</th>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>Role</th>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>Courses</th>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>Joined</th>
                <th className='text-left text-xs font-medium text-white/40 px-4 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className='border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors'>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      {u.imageUrl && (
                        <img src={u.imageUrl} alt='' className='w-8 h-8 rounded-full' />
                      )}
                      <span className='text-sm text-white'>
                        {u.firstName ?? ''} {u.lastName ?? ''}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-sm text-white/50'>{u.email}</td>
                  <td className='px-4 py-3'>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      u.role === 'admin'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : u.role === 'instructor'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-white/5 text-white/40 border border-white/[0.08]'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {u.assignedCourses.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {u.assignedCourses.map((cid) => (
                          <span key={cid} className='inline-block px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 truncate max-w-[120px]' title={cid}>
                            {cid}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className='text-xs text-white/20'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-3 text-xs text-white/30'>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3'>
                    {u.role !== 'admin' && (
                      <>
                        {assigningUser === u.id ? (
                          <div className='flex items-center gap-2'>
                            <input
                              type='text'
                              value={courseId}
                              onChange={(e) => setCourseId(e.target.value)}
                              placeholder='Sanity course _id'
                              className='px-2 py-1 text-xs rounded bg-dark-surface border border-white/[0.08] text-white placeholder:text-white/20 w-48'
                            />
                            <button
                              onClick={() => handleAssignInstructor(u.id)}
                              className='px-2 py-1 text-xs rounded bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors'
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { setAssigningUser(null); setCourseId(''); }}
                              className='px-2 py-1 text-xs rounded text-white/30 hover:text-white/50 transition-colors'
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningUser(u.id)}
                            className='flex items-center gap-1 px-2 py-1 text-xs rounded text-white/40 hover:text-white/60 hover:bg-white/5 transition-all'
                          >
                            <ChevronDown size={12} />
                            Assign Instructor
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
