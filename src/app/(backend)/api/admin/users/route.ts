import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { createClerkClient } from '@clerk/nextjs/server';
import { Pool } from 'pg';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    await requireRole('admin');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await clerk.users.getUserList({ limit: 100, orderBy: '-created_at' });

    const instructorRows = await pool.query<{ clerk_user_id: string; course_id: string }>(
      'SELECT clerk_user_id, course_id FROM course_instructors'
    );

    const coursesByUser = new Map<string, string[]>();
    for (const row of instructorRows.rows) {
      const existing = coursesByUser.get(row.clerk_user_id) ?? [];
      existing.push(row.course_id);
      coursesByUser.set(row.clerk_user_id, existing);
    }

    const mapped = users.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: (user.publicMetadata?.role as string) ?? 'learner',
      createdAt: user.createdAt,
      assignedCourses: coursesByUser.get(user.id) ?? [],
    }));

    return NextResponse.json({ users: mapped });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
