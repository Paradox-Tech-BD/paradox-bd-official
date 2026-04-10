import React from 'react';
import { sanityFetch } from '@/sanity/lib/live';
import CourseListingPage from '../_components/course-listing-page';
import {
  allCoursesQuery,
  courseCategoriesQuery,
} from '@/sanity/lib/queries/documents/course';

export default async function AllCoursesPage() {
  const [
    { data: courses },
    { data: categories },
  ] = await Promise.all([
    sanityFetch({ query: allCoursesQuery }),
    sanityFetch({ query: courseCategoriesQuery }),
  ]);

  return (
    <CourseListingPage
      courses={courses}
      categories={categories}
      title="All Courses"
    />
  )
}
