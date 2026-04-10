"use client"
import React from 'react';
import Heading from '@/components/shared/heading';
import CourseGrid from './course-grid';
import CourseToolbar from './course-toolbar';
import { AllCoursesQueryResult, CourseCategoriesQueryResult } from '../../../../../sanity.types';

interface CourseListingPageProps {
  courses: AllCoursesQueryResult;
  categories: CourseCategoriesQueryResult;
  title: string;
}

export default function CourseListingPage({ courses, categories, title }: CourseListingPageProps) {
  return (
    <main className='overflow-hidden md:overflow-auto'>
      <div className='relative'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none' />
        <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-14 md:pb-28'>
          <Heading tag="h1" size="xxxl" className='animate-fade-in-up'>
            {title}
          </Heading>
          <CourseToolbar categories={categories} courses={courses} />
          <CourseGrid courses={courses} />
        </div>
      </div>
    </main>
  )
}
