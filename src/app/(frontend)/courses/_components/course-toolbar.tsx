import React from 'react';
import { CourseSearch } from './course-search';
import CourseCategories from './course-categories';
import { AllCoursesQueryResult, CourseCategoriesQueryResult } from '../../../../../sanity.types';

interface CourseToolbarProps {
  categories: CourseCategoriesQueryResult;
  courses: AllCoursesQueryResult;
}

export default function CourseToolbar({ categories, courses }: CourseToolbarProps) {
  return (
    <>
      <CourseSearch courses={courses ?? []} classNames='mt-4 lg:hidden' />
      <div className='relative z-20 overflow-x-scroll lg:overflow-visible py-3 lg:py-2 mt-6 lg:mt-16 mb-6 lg:mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-2 border-y border-white/[0.06]'>
        <CourseCategories categories={categories ?? []} />
        <CourseSearch courses={courses ?? []} classNames='hidden lg:block' />
      </div>
    </>
  )
}
