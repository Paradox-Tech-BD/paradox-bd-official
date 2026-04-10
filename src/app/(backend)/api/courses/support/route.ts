import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const courseId = req.nextUrl.searchParams.get('courseId');
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM support_messages
       WHERE course_id = $1 AND (sender_clerk_id = $2 OR parent_id IN (
         SELECT id FROM support_messages WHERE course_id = $1 AND sender_clerk_id = $2
       ))
       ORDER BY created_at ASC`,
      [courseId, userId]
    );

    return NextResponse.json({ messages: rows });
  } catch (error) {
    console.error('Failed to fetch support messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { courseId, message } = await req.json();
    if (!courseId || !message) {
      return NextResponse.json({ error: 'courseId and message required' }, { status: 400 });
    }

    const pool = getPool();
    const enrolled = await pool.query(
      `SELECT 1 FROM enrollments WHERE clerk_user_id = $1 AND course_id = $2 AND status = 'approved'`,
      [userId, courseId]
    );

    if (enrolled.rows.length === 0) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
    }

    const { rows } = await pool.query(
      `INSERT INTO support_messages (course_id, sender_clerk_id, sender_role, message)
       VALUES ($1, $2, 'learner', $3) RETURNING *`,
      [courseId, userId, message]
    );

    return NextResponse.json({ message: rows[0] });
  } catch (error) {
    console.error('Failed to send support message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
