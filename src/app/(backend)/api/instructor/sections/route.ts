import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';

async function verifyInstructorCourse(userId: string, courseId: string): Promise<boolean> {
  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT 1 FROM course_instructors WHERE clerk_user_id = $1 AND course_id = $2',
    [userId, courseId]
  );
  return rows.length > 0;
}

export async function GET(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const courseId = req.nextUrl.searchParams.get('courseId');
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 });
  }

  if (!(await verifyInstructorCourse(userId, courseId))) {
    return NextResponse.json({ error: 'Not your course' }, { status: 403 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT s.*, 
        COALESCE(json_agg(
          json_build_object('id', l.id, 'title', l.title, 'type', l.type, 'r2_key', l.r2_key, 'duration', l.duration, 'quiz_data', l.quiz_data, 'markdown_content', l.markdown_content, 'position', l.position)
          ORDER BY l.position
        ) FILTER (WHERE l.id IS NOT NULL), '[]') as lectures
       FROM course_sections s
       LEFT JOIN course_lectures l ON l.section_id = s.id
       WHERE s.course_id = $1
       GROUP BY s.id
       ORDER BY s.position`,
      [courseId]
    );
    return NextResponse.json({ sections: rows });
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
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
    const { courseId, title } = await req.json();
    if (!courseId || !title) {
      return NextResponse.json({ error: 'courseId and title required' }, { status: 400 });
    }

    if (!(await verifyInstructorCourse(userId, courseId))) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const pool = getPool();
    const maxPos = await pool.query<{ max: number | null }>(
      'SELECT MAX(position) as max FROM course_sections WHERE course_id = $1',
      [courseId]
    );
    const position = (maxPos.rows[0]?.max ?? -1) + 1;

    const { rows } = await pool.query(
      'INSERT INTO course_sections (course_id, title, position) VALUES ($1, $2, $3) RETURNING *',
      [courseId, title, position]
    );

    return NextResponse.json({ section: rows[0] });
  } catch (error) {
    console.error('Failed to create section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id, title, position } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const pool = getPool();
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let idx = 1;

    if (title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(title);
    }
    if (position !== undefined) {
      updates.push(`position = $${idx++}`);
      values.push(position);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE course_sections SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    return NextResponse.json({ section: rows[0] });
  } catch (error) {
    console.error('Failed to update section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const pool = getPool();
    await pool.query('DELETE FROM course_sections WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete section:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
