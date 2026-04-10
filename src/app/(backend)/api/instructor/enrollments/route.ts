import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';
import { createClerkClient } from '@clerk/nextjs/server';
import { sanityFetch } from '@/sanity/lib/live';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

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
      return NextResponse.json({ enrollments: [] });
    }

    const filterIds = courseId ? [courseId].filter((id) => courseIds.includes(id)) : courseIds;
    if (filterIds.length === 0) {
      return NextResponse.json({ enrollments: [] });
    }

    const { rows } = await pool.query(
      `SELECT * FROM enrollments WHERE course_id = ANY($1) ORDER BY created_at DESC`,
      [filterIds]
    );

    const uniqueStudentIds = Array.from(new Set(rows.map((r) => r.clerk_user_id).filter(Boolean)));
    const uniqueCourseIds = Array.from(new Set(rows.map((r) => r.course_id).filter(Boolean)));

    const studentsById = new Map<string, { name: string; email: string; imageUrl: string }>();
    await Promise.all(
      uniqueStudentIds.map(async (id) => {
        try {
          const user = await clerk.users.getUser(id);
          const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || id;
          const email = user.emailAddresses[0]?.emailAddress ?? '';
          studentsById.set(id, { name, email, imageUrl: user.imageUrl });
        } catch {
          studentsById.set(id, { name: id, email: '', imageUrl: '' });
        }
      })
    );

    const coursesById = new Map<string, { title: string; slug: string }>();
    if (uniqueCourseIds.length > 0) {
      try {
        const { data: courses } = await sanityFetch({
          query: `*[_type == "course" && _id in $ids] { _id, title, "slug": slug.current }`,
          params: { ids: uniqueCourseIds },
        });
        for (const c of courses ?? []) {
          coursesById.set(c._id, { title: c.title, slug: c.slug });
        }
      } catch {
        // ignore; UI can fall back to course_id
      }
    }

    const enriched = rows.map((r) => ({
      ...r,
      student: studentsById.get(r.clerk_user_id) ?? { name: r.clerk_user_id, email: '', imageUrl: '' },
      course: coursesById.get(r.course_id) ?? { title: r.course_id, slug: '' },
    }));

    return NextResponse.json({ enrollments: enriched });
  } catch (error) {
    console.error('Failed to fetch enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { enrollmentId, status } = await req.json();
    if (!enrollmentId || !status) {
      return NextResponse.json({ error: 'enrollmentId and status required' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const pool = getPool();
    const enrollment = await pool.query<{ course_id: string }>(
      'SELECT course_id FROM enrollments WHERE id = $1',
      [enrollmentId]
    );

    if (enrollment.rows.length === 0) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const ownsResult = await pool.query(
      'SELECT 1 FROM course_instructors WHERE clerk_user_id = $1 AND course_id = $2',
      [userId, enrollment.rows[0].course_id]
    );

    if (ownsResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const approvedAt = status === 'approved' ? new Date().toISOString() : null;
    const { rows } = await pool.query(
      'UPDATE enrollments SET status = $1, approved_at = $2 WHERE id = $3 RETURNING *',
      [status, approvedAt, enrollmentId]
    );

    return NextResponse.json({ enrollment: rows[0] });
  } catch (error) {
    console.error('Failed to update enrollment:', error);
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
  }
}
