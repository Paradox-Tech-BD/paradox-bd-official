import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { processMetadata } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/live';
import Heading from '@/components/shared/heading';
import CourseCard from './_components/course-card';
import InstructorCard from './_components/instructor-card';
import { PageBuilder } from '@/components/page-builder';
import { ArrowRight, BookOpen, Users, Award, Zap } from 'lucide-react';
import { CoursesPageQueryResult } from '../../../../sanity.types';
import {
  coursesPageQuery,
  featuredCoursesQuery,
  allInstructorsQuery,
} from '@/sanity/lib/queries/documents/course';

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: coursesPageQuery,
    stega: false
  });

  if (!page) { return {} };

  return processMetadata({ data: page as CoursesPageQueryResult });
}

export default async function CoursesPage() {
  const [
    { data: page },
    { data: featuredCourses },
    { data: instructors },
  ] = await Promise.all([
    sanityFetch({ query: coursesPageQuery }),
    sanityFetch({ query: featuredCoursesQuery }),
    sanityFetch({ query: allInstructorsQuery }),
  ]);

  const featuredInstructors = instructors?.filter(i => i.featured) ?? [];

  return (
    <main className='overflow-hidden'>
      <section className='relative min-h-[80vh] flex items-center'>
        <div className='absolute inset-0'>
          <div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/[0.04] blur-[120px] pointer-events-none' />
          <div className='absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[100px] pointer-events-none' />
        </div>
        <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-20'>
          <div className='max-w-3xl'>
            <span className='section-label animate-fade-in'>Courses</span>
            <Heading tag="h1" size="xxxl" className='mt-6 animate-fade-in-up'>
              {page?.heroHeading ?? 'Master the Future of Technology'}
            </Heading>
            <p className='mt-6 text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl animate-fade-in-up' style={{ animationDelay: '100ms' }}>
              {page?.heroSubheading ?? 'Industry-leading courses designed by experts. Learn at your own pace with hands-on projects and real-world applications.'}
            </p>
            <div className='mt-10 flex flex-wrap gap-4 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
              <Link
                href='/courses/all'
                className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-dark-bg font-medium text-sm hover:bg-white/90 transition-all duration-300'
              >
                Browse All Courses
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up' style={{ animationDelay: '300ms' }}>
            {[
              { icon: BookOpen, label: 'Expert-Led', desc: 'Courses' },
              { icon: Users, label: 'Community', desc: 'Learning' },
              { icon: Award, label: 'Certificates', desc: 'On Completion' },
              { icon: Zap, label: 'Self-Paced', desc: 'Flexible' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className='p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]'>
                <Icon size={20} className='text-violet-400' />
                <p className='mt-3 text-sm font-medium text-white'>{label}</p>
                <p className='text-xs text-white/40 mt-0.5'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredCourses && featuredCourses.length > 0 && (
        <section className='relative py-20 md:py-32'>
          <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
            <div className='flex items-end justify-between mb-12'>
              <div>
                <span className='section-label'>{page?.featuredHeading ?? 'Featured Courses'}</span>
                <Heading tag="h2" size="xl" className='mt-4'>
                  Start Your Learning Journey
                </Heading>
              </div>
              <Link
                href='/courses/all'
                className='hidden md:inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300'
              >
                View all courses
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {featuredCourses.map((course, index) => (
                <div
                  key={course._id}
                  className='animate-fade-in-up'
                  style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
            <div className='mt-10 text-center md:hidden'>
              <Link
                href='/courses/all'
                className='inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300'
              >
                View all courses
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {featuredInstructors.length > 0 && (
        <section className='relative py-20 md:py-32 border-t border-white/[0.06]'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-500/[0.02] blur-[100px] pointer-events-none' />
          <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12'>
            <span className='section-label'>{page?.instructorsHeading ?? 'Meet Our Instructors'}</span>
            <Heading tag="h2" size="xl" className='mt-4 mb-12'>
              Learn From the Best
            </Heading>
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {featuredInstructors.map((instructor, index) => (
                <div
                  key={instructor._id}
                  className='animate-fade-in-up'
                  style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                >
                  <InstructorCard instructor={instructor} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page?._id && page?.pageBuilder && page.pageBuilder.length > 0 && (
        <PageBuilder
          id={page._id}
          type={page._type}
          pageBuilder={page.pageBuilder}
        />
      )}
    </main>
  )
}
