import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';
import { sanityFetch } from '@/sanity/lib/live';

export async function GET() {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query<{ course_id: string }>(
      'SELECT course_id FROM course_instructors WHERE clerk_user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    const courseIds = rows.map((r) => r.course_id);
    const { data: courses } = await sanityFetch({
      query: `*[_type == "course" && _id in $ids] | order(title asc) {
        _id, title, "slug": slug.current, excerpt, level,
        "thumbnail": thumbnail.asset->url, price, enrolledCount, rating
      }`,
      params: { ids: courseIds },
    });

    return NextResponse.json({ courses: courses ?? [] });
  } catch (error) {
    console.error('Failed to fetch instructor courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
