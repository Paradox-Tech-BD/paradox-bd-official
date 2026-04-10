"use client"
import { useEffect, useState } from 'react';
import { MessageSquare, Loader2, Reply } from 'lucide-react';

interface Thread {
  id: number;
  course_id: string;
  sender_clerk_id: string;
  message: string;
  created_at: string;
  replies: { id: number; message: string; sender_clerk_id: string; created_at: string }[];
}

export default function SupportPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch('/api/instructor/support')
      .then((res) => res.json())
      .then((data) => setThreads(data.threads ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function sendReply(parentId: number, courseId: string) {
    const message = reply[parentId];
    if (!message?.trim()) return;
    await fetch('/api/instructor/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, message: message.trim(), parentId }),
    });
    setReply((prev) => ({ ...prev, [parentId]: '' }));
    const res = await fetch('/api/instructor/support');
    const data = await res.json();
    setThreads(data.threads ?? []);
  }

  if (loading) {
    return <div className='flex items-center justify-center h-64'><Loader2 size={28} className='text-violet-400 animate-spin' /></div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>Support Inbox</h1>
      <p className='text-white/40 text-sm mb-8'>Threaded support messages per course</p>
      <div className='space-y-4'>
        {threads.length === 0 ? (
          <div className='rounded-xl border border-white/[0.08] bg-dark-card p-10 text-center'>
            <MessageSquare size={32} className='mx-auto text-white/20 mb-3' />
            <p className='text-white/40'>No support messages yet.</p>
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className='rounded-xl border border-white/[0.08] bg-dark-card p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs text-white/30 mb-1'>{thread.course_id}</p>
                  <p className='text-white/80'>{thread.message}</p>
                  <p className='text-xs text-white/20 mt-2'>{new Date(thread.created_at).toLocaleString()}</p>
                </div>
                <span className='text-xs text-white/30'>{thread.sender_clerk_id}</span>
              </div>
              <div className='mt-4 space-y-3 border-t border-white/[0.06] pt-4'>
                {thread.replies.map((message) => (
                  <div key={message.id} className='ml-6 border-l border-white/[0.08] pl-4'>
                    <p className='text-sm text-white/70'>{message.message}</p>
                    <p className='text-xs text-white/20 mt-1'>{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                ))}
                <div className='flex gap-2'>
                  <input value={reply[thread.id] ?? ''} onChange={(e) => setReply((prev) => ({ ...prev, [thread.id]: e.target.value }))} placeholder='Reply to student' className='flex-1 px-3 py-2 rounded-lg bg-dark-bg border border-white/[0.08] text-sm text-white' />
                  <button onClick={() => sendReply(thread.id, thread.course_id)} className='px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20 text-sm inline-flex items-center gap-2'><Reply size={14} /> Reply</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
