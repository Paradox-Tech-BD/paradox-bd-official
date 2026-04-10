import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getPool } from '@/lib/db';
import { createClient } from '@sanity/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_READ_TOKEN!,
  useCdn: false,
  apiVersion: '2024-04-16',
});

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireRole('instructor');
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { courseId, fileName, contentType } = await req.json();
    if (!courseId || !fileName || !contentType) {
      return NextResponse.json({ error: 'courseId, fileName, and contentType required' }, { status: 400 });
    }

    const pool = getPool();
    const ownsResult = await pool.query(
      'SELECT 1 FROM course_instructors WHERE clerk_user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    if (ownsResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not your course' }, { status: 403 });
    }

    const course = await sanityClient.fetch(
      `*[_type == "course" && _id == $id][0]{
        r2BucketName, r2AccountId, r2AccessKeyId, r2SecretAccessKey, r2PublicUrl
      }`,
      { id: courseId }
    );

    if (!course?.r2BucketName || !course?.r2AccountId || !course?.r2AccessKeyId || !course?.r2SecretAccessKey) {
      return NextResponse.json({ error: 'R2 credentials not configured for this course' }, { status: 400 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${course.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: course.r2AccessKeyId,
        secretAccessKey: course.r2SecretAccessKey,
      },
    });

    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const r2Key = `lectures/${timestamp}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: course.r2BucketName,
      Key: r2Key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const publicUrl = course.r2PublicUrl
      ? `${course.r2PublicUrl.replace(/\/$/, '')}/${r2Key}`
      : null;

    return NextResponse.json({ presignedUrl, r2Key, publicUrl });
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
