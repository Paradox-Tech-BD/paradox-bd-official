import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { sanityFetch } from '@/sanity/lib/live';

export async function GET() {
  try {
    await requireRole('admin');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { data: courses } = await sanityFetch({
      query: `*[_type == "course"] | order(title asc) { _id, title, slug }`,
    });

    return NextResponse.json({ courses: courses ?? [] });
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
