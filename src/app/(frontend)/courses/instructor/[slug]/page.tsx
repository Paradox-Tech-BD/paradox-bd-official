import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { processMetadata } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/live';
import Heading from '@/components/shared/heading';
import CourseCard from '../../_components/course-card';
import { InstructorBySlugQueryResult } from '../../../../../../sanity.types';
import {
  instructorBySlugQuery,
  instructorSlugsQuery,
} from '@/sanity/lib/queries/documents/course';
import {
  ArrowLeft,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: instructorSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: instructor } = await sanityFetch({
    query: instructorBySlugQuery,
    params: await params,
    stega: false,
  });

  if (!instructor) { return {} };

  return processMetadata({ data: instructor as InstructorBySlugQueryResult });
}

export default async function InstructorPage({ params }: PageProps) {
  const { data: instructor } = await sanityFetch({
    query: instructorBySlugQuery,
    params: await params
  });

  if (instructor === null) notFound();

  return (
    <main className='overflow-hidden'>
      <div className='relative'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/[0.03] blur-[120px] pointer-events-none' />
      </div>

      <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-28 md:pt-36 pb-20'>
        <Link href='/courses/all' className='inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-300 mb-8'>
          <ArrowLeft size={14} />
          Back to Courses
        </Link>

        <div className='grid lg:grid-cols-3 gap-10 lg:gap-16'>
          <div className='lg:col-span-1'>
            <div className='lg:sticky lg:top-28'>
              <div className='p-6 rounded-xl border border-white/[0.08] bg-dark-card'>
                <div className='w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/[0.08]'>
                  {instructor.photo?.asset?.url ? (
                    <Image
                      src={instructor.photo.asset.url}
                      width={128}
                      height={128}
                      alt={instructor.photo.altText ?? instructor.name ?? ''}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-white/10 flex items-center justify-center text-4xl text-white/60'>
                      {instructor.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className='text-center mt-5'>
                  <Heading tag="h1" size="md">
                    {instructor.name}
                  </Heading>
                  {instructor.title && (
                    <p className='text-sm text-white/40 mt-2'>{instructor.title}</p>
                  )}
                </div>
                <div className='flex items-center justify-center gap-3 mt-4'>
                  {instructor.socialLinks?.website && (
                    <a href={instructor.socialLinks.website} target='_blank' rel='noopener noreferrer' className='p-2 rounded-full border border-white/[0.08] text-white/30 hover:text-white hover:border-white/20 transition-all'><Globe size={16} /></a>
                  )}
                  {instructor.socialLinks?.github && (
                    <a href={instructor.socialLinks.github} target='_blank' rel='noopener noreferrer' className='p-2 rounded-full border border-white/[0.08] text-white/30 hover:text-white hover:border-white/20 transition-all'><Github size={16} /></a>
                  )}
                  {instructor.socialLinks?.linkedin && (
                    <a href={instructor.socialLinks.linkedin} target='_blank' rel='noopener noreferrer' className='p-2 rounded-full border border-white/[0.08] text-white/30 hover:text-white hover:border-white/20 transition-all'><Linkedin size={16} /></a>
                  )}
                  {instructor.socialLinks?.twitter && (
                    <a href={instructor.socialLinks.twitter} target='_blank' rel='noopener noreferrer' className='p-2 rounded-full border border-white/[0.08] text-white/30 hover:text-white hover:border-white/20 transition-all'><Twitter size={16} /></a>
                  )}
                </div>
                {instructor.expertise && instructor.expertise.length > 0 && (
                  <div className='flex flex-wrap justify-center gap-1.5 mt-5 pt-5 border-t border-white/[0.06]'>
                    {instructor.expertise.map((skill) => (
                      <span key={skill} className='px-2.5 py-1 rounded-full text-xs bg-white/[0.04] text-white/40 border border-white/[0.06]'>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 space-y-10'>
            {instructor.bio && (
              <div>
                <span className='section-label'>About</span>
                <p className='mt-4 text-white/50 leading-relaxed'>{instructor.bio}</p>
              </div>
            )}

            {instructor.courses && instructor.courses.length > 0 && (
              <div>
                <span className='section-label'>Courses ({instructor.courses.length})</span>
                <div className='grid md:grid-cols-2 gap-6 mt-6'>
                  {instructor.courses.map((course, index) => (
                    <div
                      key={course._id}
                      className='animate-fade-in-up'
                      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                    >
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
