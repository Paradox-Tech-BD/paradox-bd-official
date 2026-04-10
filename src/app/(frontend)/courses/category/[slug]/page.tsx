import React from 'react';
import { sanityFetch } from '@/sanity/lib/live';
import CourseListingPage from '../../_components/course-listing-page';
import type { CourseCategoriesQueryResult } from '../../../../../../sanity.types';
import {
  coursesByCategoryQuery,
  courseCategoriesQuery,
} from '@/sanity/lib/queries/documents/course';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [
    { data: courses },
    { data: categories },
  ] = await Promise.all([
    sanityFetch({ query: coursesByCategoryQuery, params: { slug } }),
    sanityFetch({ query: courseCategoriesQuery }),
  ]);

  const category = categories?.find((c: CourseCategoriesQueryResult[number]) => c.slug === slug);

  return (
    <CourseListingPage
      courses={courses}
      categories={categories}
      title={category?.title ?? 'Courses'}
    />
  )
}
