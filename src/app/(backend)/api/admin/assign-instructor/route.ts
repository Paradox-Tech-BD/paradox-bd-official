import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { createClerkClient } from '@clerk/nextjs/server';
import { Pool } from 'pg';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    await requireRole('admin');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId are required' }, { status: 400 });
    }

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'instructor' },
    });

    await pool.query(
      `INSERT INTO course_instructors (clerk_user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (clerk_user_id, course_id) DO NOTHING`,
      [userId, courseId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to assign instructor:', error);
    return NextResponse.json({ error: 'Failed to assign instructor' }, { status: 500 });
  }
}
