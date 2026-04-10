import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { processMetadata } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/live';
import Heading from '@/components/shared/heading';
import { PortableText } from '@portabletext/react';
import { CourseBySlugQueryResult } from '../../../../../sanity.types';
import {
  courseBySlugQuery,
  courseSlugsQuery,
} from '@/sanity/lib/queries/documents/course';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ArrowLeft,
  Award,
} from 'lucide-react';
import CurriculumAccordion from '../_components/curriculum-accordion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: courseSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: course } = await sanityFetch({
    query: courseBySlugQuery,
    params: await params,
    stega: false,
  });

  if (!course) { return {} };

  return processMetadata({ data: course as CourseBySlugQueryResult });
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { data: course } = await sanityFetch({
    query: courseBySlugQuery,
    params: await params
  });

  if (course === null) notFound();

  const totalLectures = course.curriculum?.reduce((acc, section) => acc + (section.lectures?.length ?? 0), 0) ?? 0;
  const totalDuration = course.curriculum?.reduce((acc, section) =>
    acc + (section.lectures?.reduce((lAcc, l) => lAcc + (l.duration ?? 0), 0) ?? 0), 0) ?? 0;

  return (
    <main className='overflow-hidden'>
      <div className='relative'>
        <div className='absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-500/[0.03] blur-[150px] pointer-events-none' />
        <div className='absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[100px] pointer-events-none' />
      </div>

      <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-28 md:pt-36 pb-20'>
        <Link href='/courses/all' className='inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-300 mb-8'>
          <ArrowLeft size={14} />
          Back to Courses
        </Link>

        <div className='grid lg:grid-cols-3 gap-10 lg:gap-16'>
          <div className='lg:col-span-2 space-y-10'>
            <div className='space-y-5'>
              <div className='flex flex-wrap items-center gap-3'>
                {course.category?.title && (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20'>
                    {course.category.title}
                  </span>
                )}
                {course.level && (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-white/50 border border-white/[0.08]'>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                )}
              </div>
              <Heading tag="h1" size="xxl" className='animate-fade-in-up'>
                {course.title}
              </Heading>
              <p className='text-lg text-white/50 leading-relaxed max-w-2xl animate-fade-in-up' style={{ animationDelay: '100ms' }}>
                {course.excerpt}
              </p>

              <div className='flex flex-wrap items-center gap-6 text-sm text-white/40 animate-fade-in-up' style={{ animationDelay: '150ms' }}>
                {course.rating ? (
                  <span className='flex items-center gap-1.5'>
                    <Star size={14} className='text-amber-400 fill-amber-400' />
                    <span className='text-white font-medium'>{course.rating.toFixed(1)}</span>
                    rating
                  </span>
                ) : null}
                {course.enrolledCount ? (
                  <span className='flex items-center gap-1.5'>
                    <Users size={14} />
                    {course.enrolledCount.toLocaleString()} students
                  </span>
                ) : null}
                {course.duration && (
                  <span className='flex items-center gap-1.5'>
                    <Clock size={14} />
                    {course.duration}
                  </span>
                )}
                {totalLectures > 0 && (
                  <span className='flex items-center gap-1.5'>
                    <BookOpen size={14} />
                    {totalLectures} lectures
                  </span>
                )}
              </div>

              {course.instructors && course.instructors.length > 0 && (
                <div className='flex items-center gap-3 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
                  <div className='flex -space-x-2'>
                    {course.instructors.map((instructor) => (
                      <Link key={instructor._id} href={`/courses/instructor/${instructor.slug}`} className='block'>
                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-dark-bg hover:scale-110 transition-transform'>
                          {instructor.photo?.asset?.url ? (
                            <Image
                              src={instructor.photo.asset.url}
                              width={40}
                              height={40}
                              alt={instructor.name ?? ''}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-white/10 flex items-center justify-center text-sm text-white/60'>
                              {instructor.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <span className='text-sm text-white/50'>
                    by {course.instructors.map((i, idx) => (
                      <React.Fragment key={i._id}>
                        <Link href={`/courses/instructor/${i.slug}`} className='text-white/70 hover:text-white transition-colors'>
                          {i.name}
                        </Link>
                        {idx < (course.instructors?.length ?? 0) - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {course.whatYoullLearn && course.whatYoullLearn.length > 0 && (
              <div className='p-6 md:p-8 rounded-xl border border-white/[0.08] bg-dark-card'>
                <Heading tag="h2" size="sm" className='mb-6'>
                  What You&apos;ll Learn
                </Heading>
                <div className='grid md:grid-cols-2 gap-3'>
                  {course.whatYoullLearn.map((item, i) => (
                    <div key={i} className='flex items-start gap-3'>
                      <CheckCircle size={16} className='text-emerald-400 shrink-0 mt-0.5' />
                      <span className='text-sm text-white/60'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.description && (
              <div>
                <Heading tag="h2" size="sm" className='mb-6'>
                  Course Description
                </Heading>
                <div className='prose prose-invert prose-sm max-w-none text-white/50 prose-headings:text-white prose-strong:text-white/70 prose-a:text-violet-400'>
                  <PortableText value={course.description} />
                </div>
              </div>
            )}

            {course.curriculum && course.curriculum.length > 0 && (
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <Heading tag="h2" size="sm">
                    Curriculum
                  </Heading>
                  <span className='text-sm text-white/30'>
                    {course.curriculum.length} sections &middot; {totalLectures} lectures
                    {totalDuration > 0 && ` · ${Math.round(totalDuration / 60)}h ${totalDuration % 60}m`}
                  </span>
                </div>
                <CurriculumAccordion curriculum={course.curriculum} />
              </div>
            )}

            {course.instructors && course.instructors.length > 0 && (
              <div>
                <Heading tag="h2" size="sm" className='mb-6'>
                  Instructor{course.instructors.length > 1 ? 's' : ''}
                </Heading>
                <div className='space-y-6'>
                  {course.instructors.map((instructor) => (
                    <div key={instructor._id} className='p-6 rounded-xl border border-white/[0.08] bg-dark-card'>
                      <div className='flex items-start gap-4'>
                        <Link href={`/courses/instructor/${instructor.slug}`}>
                          <div className='shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-white/[0.08] hover:border-white/20 transition-colors'>
                            {instructor.photo?.asset?.url ? (
                              <Image
                                src={instructor.photo.asset.url}
                                width={80}
                                height={80}
                                alt={instructor.name ?? ''}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <div className='w-full h-full bg-white/10 flex items-center justify-center text-2xl text-white/60'>
                                {instructor.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        </Link>
                        <div>
                          <Link href={`/courses/instructor/${instructor.slug}`}>
                            <Heading tag="h3" size="xs" className='hover:text-white/80 transition-colors'>
                              {instructor.name}
                            </Heading>
                          </Link>
                          {instructor.title && (
                            <p className='text-sm text-white/40 mt-1'>{instructor.title}</p>
                          )}
                          {instructor.expertise && instructor.expertise.length > 0 && (
                            <div className='flex flex-wrap gap-1.5 mt-3'>
                              {instructor.expertise.map((skill) => (
                                <span key={skill} className='px-2 py-0.5 rounded-full text-[11px] bg-white/[0.04] text-white/40 border border-white/[0.06]'>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className='flex items-center gap-3 mt-3'>
                            {instructor.socialLinks?.website && (
                              <a href={instructor.socialLinks.website} target='_blank' rel='noopener noreferrer' className='text-white/30 hover:text-white transition-colors'><Globe size={14} /></a>
                            )}
                            {instructor.socialLinks?.github && (
                              <a href={instructor.socialLinks.github} target='_blank' rel='noopener noreferrer' className='text-white/30 hover:text-white transition-colors'><Github size={14} /></a>
                            )}
                            {instructor.socialLinks?.linkedin && (
                              <a href={instructor.socialLinks.linkedin} target='_blank' rel='noopener noreferrer' className='text-white/30 hover:text-white transition-colors'><Linkedin size={14} /></a>
                            )}
                            {instructor.socialLinks?.twitter && (
                              <a href={instructor.socialLinks.twitter} target='_blank' rel='noopener noreferrer' className='text-white/30 hover:text-white transition-colors'><Twitter size={14} /></a>
                            )}
                          </div>
                        </div>
                      </div>
                      {instructor.bio && (
                        <p className='text-sm text-white/40 leading-relaxed mt-4'>{instructor.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.testimonials && course.testimonials.length > 0 && (
              <div>
                <Heading tag="h2" size="sm" className='mb-6'>
                  Student Reviews
                </Heading>
                <div className='grid md:grid-cols-2 gap-4'>
                  {course.testimonials.map((testimonial) => (
                    <div key={testimonial._id} className='p-5 rounded-xl border border-white/[0.08] bg-dark-card'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='w-10 h-10 rounded-full overflow-hidden bg-white/[0.06]'>
                          {testimonial.avatar?.asset?.url ? (
                            <Image
                              src={testimonial.avatar.asset.url}
                              width={40}
                              height={40}
                              alt={testimonial.name ?? ''}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-sm text-white/40'>
                              {testimonial.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className='text-sm font-medium text-white'>{testimonial.name}</p>
                          <div className='flex items-center gap-0.5'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i < (testimonial.rating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className='text-sm text-white/40 leading-relaxed'>{testimonial.quote}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.prerequisites && course.prerequisites.length > 0 && (
              <div>
                <Heading tag="h2" size="sm" className='mb-6'>
                  Prerequisites
                </Heading>
                <ul className='space-y-2'>
                  {course.prerequisites.map((prereq, i) => (
                    <li key={i} className='flex items-start gap-3 text-sm text-white/50'>
                      <span className='shrink-0 w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5' />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className='lg:col-span-1'>
            <div className='lg:sticky lg:top-28 space-y-6'>
              <div className='rounded-xl border border-white/[0.08] bg-dark-card overflow-hidden'>
                {course.thumbnail?.asset?.url && (
                  <div className='relative aspect-video'>
                    <Image
                      src={course.thumbnail.asset.url}
                      fill
                      alt={course.thumbnail.altText ?? course.title ?? ''}
                      className='object-cover'
                    />
                    {course.previewVideoUrl && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors cursor-pointer'>
                        <PlayCircle size={48} className='text-white/80' />
                      </div>
                    )}
                  </div>
                )}
                <div className='p-6 space-y-4'>
                  <div className='flex items-baseline gap-3'>
                    {course.price === 0 ? (
                      <span className='text-3xl font-bold text-emerald-400'>Free</span>
                    ) : (
                      <>
                        <span className='text-3xl font-bold text-white'>${course.price}</span>
                        {course.originalPrice && course.originalPrice > (course.price ?? 0) && (
                          <span className='text-lg text-white/30 line-through'>${course.originalPrice}</span>
                        )}
                      </>
                    )}
                  </div>
                  <button className='w-full py-3 px-6 rounded-full bg-white text-dark-bg font-medium text-sm hover:bg-white/90 transition-all duration-300'>
                    Enroll Now
                  </button>
                  <div className='pt-4 border-t border-white/[0.06] space-y-3'>
                    {course.duration && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-white/40 flex items-center gap-2'><Clock size={14} /> Duration</span>
                        <span className='text-white/70'>{course.duration}</span>
                      </div>
                    )}
                    {totalLectures > 0 && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-white/40 flex items-center gap-2'><BookOpen size={14} /> Lectures</span>
                        <span className='text-white/70'>{totalLectures}</span>
                      </div>
                    )}
                    {course.level && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-white/40 flex items-center gap-2'><Award size={14} /> Level</span>
                        <span className='text-white/70'>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</span>
                      </div>
                    )}
                    {course.enrolledCount ? (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-white/40 flex items-center gap-2'><Users size={14} /> Enrolled</span>
                        <span className='text-white/70'>{course.enrolledCount.toLocaleString()}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
