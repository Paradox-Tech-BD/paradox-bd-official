import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';

export async function GET() {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const pool = getPool();

    const coursesResult = await pool.query<{ course_id: string }>(
      'SELECT course_id FROM course_instructors WHERE clerk_user_id = $1',
      [userId]
    );
    const courseIds = coursesResult.rows.map((r) => r.course_id);

    if (courseIds.length === 0) {
      return NextResponse.json({
        activeCourses: 0,
        totalStudents: 0,
        pendingEnrollments: 0,
        recentEnrollments: [],
      });
    }

    const totalStudents = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM enrollments WHERE course_id = ANY($1) AND status = 'approved'`,
      [courseIds]
    );

    const pendingEnrollments = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM enrollments WHERE course_id = ANY($1) AND status = 'pending'`,
      [courseIds]
    );

    const recentEnrollments = await pool.query(
      `SELECT id, clerk_user_id, course_id, status, payment_proof_url, created_at
       FROM enrollments WHERE course_id = ANY($1)
       ORDER BY created_at DESC LIMIT 10`,
      [courseIds]
    );

    return NextResponse.json({
      activeCourses: courseIds.length,
      totalStudents: parseInt(totalStudents.rows[0]?.count ?? '0'),
      pendingEnrollments: parseInt(pendingEnrollments.rows[0]?.count ?? '0'),
      recentEnrollments: recentEnrollments.rows,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
