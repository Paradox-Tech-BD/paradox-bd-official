"use client";

import { useEffect, useMemo, useState } from 'react';
import { Loader2, SendHorizonal, MessageSquare } from 'lucide-react';

type SupportMessage = {
  id: number;
  course_id: string;
  sender_clerk_id: string;
  sender_role: string;
  message: string;
  parent_id: number | null;
  created_at: string;
};

export default function CourseSupport({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const res = await fetch(`/api/courses/support?courseId=${encodeURIComponent(courseId)}`, {
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Failed to load messages');
        setMessages([]);
        return;
      }
      setMessages(data.messages ?? []);
    } catch {
      setError('Failed to load messages');
      setMessages([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const { threads, repliesByParent } = useMemo(() => {
    const threads = messages.filter((m) => m.parent_id === null);
    const repliesByParent = new Map<number, SupportMessage[]>();
    for (const msg of messages) {
      if (msg.parent_id == null) continue;
      const existing = repliesByParent.get(msg.parent_id) ?? [];
      existing.push(msg);
      repliesByParent.set(msg.parent_id, existing);
    }
    return { threads, repliesByParent };
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/courses/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, message: text.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Failed to send message');
        return;
      }
      setText('');
      await refresh();
    } catch {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className='rounded-xl border border-white/[0.08] bg-dark-card overflow-hidden'>
      <div className='p-5 border-b border-white/[0.06] flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-white'>Course Support</p>
          <p className='text-xs text-white/30 mt-1'>Ask questions and see instructor replies.</p>
        </div>
      </div>

      <div className='p-5 space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center h-40'>
            <Loader2 size={22} className='text-violet-400 animate-spin' />
          </div>
        ) : error ? (
          <div className='rounded-lg border border-white/[0.08] bg-dark-surface p-4 text-sm text-white/50'>
            {error}
          </div>
        ) : threads.length === 0 ? (
          <div className='rounded-lg border border-white/[0.08] bg-dark-surface p-8 text-center'>
            <MessageSquare size={28} className='mx-auto text-white/20 mb-2' />
            <p className='text-sm text-white/40'>No messages yet.</p>
            <p className='text-xs text-white/20 mt-1'>Send your first question below.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {threads.map((thread) => (
              <div key={thread.id} className='rounded-lg border border-white/[0.08] bg-dark-surface p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-sm text-white/80'>{thread.message}</p>
                    <p className='text-xs text-white/20 mt-2'>{new Date(thread.created_at).toLocaleString()}</p>
                  </div>
                  <span className='text-[10px] uppercase tracking-wider text-white/30 font-mono'>you</span>
                </div>

                {(repliesByParent.get(thread.id) ?? []).length > 0 && (
                  <div className='mt-4 space-y-3 border-t border-white/[0.06] pt-4'>
                    {(repliesByParent.get(thread.id) ?? []).map((reply) => (
                      <div key={reply.id} className='ml-4 border-l border-white/[0.08] pl-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <p className='text-sm text-white/70'>{reply.message}</p>
                          <span className='text-[10px] uppercase tracking-wider text-white/30 font-mono'>instructor</span>
                        </div>
                        <p className='text-xs text-white/20 mt-1'>{new Date(reply.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className='rounded-lg border border-white/[0.08] bg-dark-surface p-4'>
          <p className='text-xs text-white/30 font-mono uppercase tracking-wider mb-2'>New Message</p>
          <div className='flex gap-2'>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type your question…'
              className='flex-1 min-h-12 px-3 py-2 rounded-lg bg-dark-bg border border-white/[0.08] text-sm text-white'
            />
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              className='shrink-0 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20 text-sm inline-flex items-center gap-2 disabled:opacity-50'
            >
              {sending ? <Loader2 size={14} className='animate-spin' /> : <SendHorizonal size={14} />}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
