"use client"
import React, { useState, useMemo } from 'react';
import Heading from '@/components/shared/heading';
import CourseGrid from './course-grid';
import CourseToolbar from './course-toolbar';
import { AllCoursesQueryResult, CourseCategoriesQueryResult } from '../../../../../sanity.types';

const COURSES_PER_PAGE = 9;

interface CourseListingPageProps {
  courses: AllCoursesQueryResult;
  categories: CourseCategoriesQueryResult;
  title: string;
}

export default function CourseListingPage({ courses, categories, title }: CourseListingPageProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((courses?.length ?? 0) / COURSES_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * COURSES_PER_PAGE;
    return courses?.slice(start, start + COURSES_PER_PAGE) ?? [];
  }, [courses, currentPage]);

  return (
    <main className='overflow-hidden md:overflow-auto'>
      <div className='relative'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none' />
        <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-14 md:pb-28'>
          <Heading tag="h1" size="xxxl" className='animate-fade-in-up'>
            {title}
          </Heading>
          <CourseToolbar categories={categories} courses={courses} />
          <CourseGrid courses={paginatedCourses} />
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 mt-12'>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className='px-4 py-2 rounded-full text-sm border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300'
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-white text-dark-bg font-medium'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className='px-4 py-2 rounded-full text-sm border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300'
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
