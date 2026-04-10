import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const pool = getPool();
    const courseId = req.nextUrl.searchParams.get('courseId');

    const coursesResult = await pool.query<{ course_id: string }>(
      'SELECT course_id FROM course_instructors WHERE clerk_user_id = $1',
      [userId]
    );
    const courseIds = coursesResult.rows.map((r) => r.course_id);

    if (courseIds.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    const filterIds = courseId ? [courseId].filter((id) => courseIds.includes(id)) : courseIds;
    if (filterIds.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    const { rows } = await pool.query(
      `SELECT * FROM support_messages
       WHERE course_id = ANY($1) AND parent_id IS NULL
       ORDER BY created_at DESC`,
      [filterIds]
    );

    const threadIds = rows.map((r) => r.id);
    let replies: typeof rows = [];
    if (threadIds.length > 0) {
      const repliesResult = await pool.query(
        `SELECT * FROM support_messages
         WHERE parent_id = ANY($1)
         ORDER BY created_at ASC`,
        [threadIds]
      );
      replies = repliesResult.rows;
    }

    const threads = rows.map((msg) => ({
      ...msg,
      replies: replies.filter((r) => r.parent_id === msg.id),
    }));

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Failed to fetch support messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { courseId, message, parentId } = await req.json();
    if (!courseId || !message) {
      return NextResponse.json({ error: 'courseId and message required' }, { status: 400 });
    }

    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO support_messages (course_id, sender_clerk_id, sender_role, message, parent_id)
       VALUES ($1, $2, 'instructor', $3, $4) RETURNING *`,
      [courseId, userId, message, parentId ?? null]
    );

    return NextResponse.json({ message: rows[0] });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
