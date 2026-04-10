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

async function getLectureCourseId(lectureId: number) {
  const pool = getPool();
  const { rows } = await pool.query<{ course_id: string }>(
    `SELECT s.course_id
     FROM course_lectures l
     JOIN course_sections s ON s.id = l.section_id
     WHERE l.id = $1`,
    [lectureId]
  );
  return rows[0]?.course_id ?? null;
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { sectionId, title, type, r2Key, duration, quizData, markdownContent } = await req.json();
    if (!sectionId || !title) {
      return NextResponse.json({ error: 'sectionId and title required' }, { status: 400 });
    }

    const pool = getPool();
    const section = await pool.query<{ course_id: string }>('SELECT course_id FROM course_sections WHERE id = $1', [sectionId]);
    if (section.rows.length === 0 || !(await verifyInstructorCourse(userId, section.rows[0].course_id))) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const maxPos = await pool.query<{ max: number | null }>(
      'SELECT MAX(position) as max FROM course_lectures WHERE section_id = $1',
      [sectionId]
    );
    const position = (maxPos.rows[0]?.max ?? -1) + 1;

    const { rows } = await pool.query(
      `INSERT INTO course_lectures (section_id, title, type, r2_key, duration, quiz_data, markdown_content, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [sectionId, title, type ?? 'video', r2Key ?? null, duration ?? null, quizData ? JSON.stringify(quizData) : null, markdownContent ?? null, position]
    );

    return NextResponse.json({ lecture: rows[0] });
  } catch (error) {
    console.error('Failed to create lecture:', error);
    return NextResponse.json({ error: 'Failed to create lecture' }, { status: 500 });
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
    const { id, title, type, r2Key, duration, quizData, markdownContent, position } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const courseId = await getLectureCourseId(Number(id));
    if (!courseId || !(await verifyInstructorCourse(userId, courseId))) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const pool = getPool();
    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (type !== undefined) { updates.push(`type = $${idx++}`); values.push(type); }
    if (r2Key !== undefined) { updates.push(`r2_key = $${idx++}`); values.push(r2Key); }
    if (duration !== undefined) { updates.push(`duration = $${idx++}`); values.push(duration); }
    if (quizData !== undefined) { updates.push(`quiz_data = $${idx++}`); values.push(JSON.stringify(quizData)); }
    if (markdownContent !== undefined) { updates.push(`markdown_content = $${idx++}`); values.push(markdownContent); }
    if (position !== undefined) { updates.push(`position = $${idx++}`); values.push(position); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE course_lectures SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    return NextResponse.json({ lecture: rows[0] });
  } catch (error) {
    console.error('Failed to update lecture:', error);
    return NextResponse.json({ error: 'Failed to update lecture' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const courseId = await getLectureCourseId(Number(id));
    if (!courseId || !(await verifyInstructorCourse(userId, courseId))) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const pool = getPool();
    await pool.query('DELETE FROM course_lectures WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lecture:', error);
    return NextResponse.json({ error: 'Failed to delete lecture' }, { status: 500 });
  }
}
