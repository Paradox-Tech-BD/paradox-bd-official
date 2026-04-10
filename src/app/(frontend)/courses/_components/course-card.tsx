"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/shared/heading';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import { AllCoursesQueryResult } from '../../../../../sanity.types';

export default function CourseCard({ course }: {
  course: AllCoursesQueryResult[number];
}) {

  const { title, slug, excerpt, thumbnail, category, instructors, level, duration, price, originalPrice, rating, enrolledCount } = course;

  return (
    <article aria-label={title ?? ''} className='relative group hover-lift'>
      <Link href={slug ? `/courses/${slug}` : '#'} className='block'>
        <div className='overflow-hidden rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] bg-dark-card transition-colors duration-300'>
          <div className='relative'>
            {category?.title && (
              <span className='z-10 absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white/80 border border-white/[0.08]'>
                {category.title}
              </span>
            )}
            {level && (
              <span className='z-10 absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/20 backdrop-blur-md text-violet-300 border border-violet-500/20'>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            )}
            {thumbnail?.asset?.url ? (
              <Image
                src={thumbnail.asset.url}
                width={800}
                height={450}
                alt={thumbnail?.altText ?? title ?? ''}
                className='aspect-video object-cover group-hover:scale-105 transition-transform duration-500'
              />
            ) : (
              <div className='aspect-video bg-white/[0.04] flex items-center justify-center'>
                <BookOpen size={32} className='text-white/10' />
              </div>
            )}
          </div>
          <div className='p-5 space-y-3'>
            <Heading tag="h2" size="xs" className='text-balance text-white group-hover:text-white/80 transition-colors line-clamp-2'>
              {title}
            </Heading>
            <p className='text-sm text-white/40 leading-relaxed line-clamp-2'>
              {excerpt}
            </p>
            <div className='flex items-center gap-3 text-xs text-white/40'>
              {rating ? (
                <span className='flex items-center gap-1'>
                  <Star size={12} className='text-amber-400 fill-amber-400' />
                  {rating.toFixed(1)}
                </span>
              ) : null}
              {enrolledCount ? (
                <span className='flex items-center gap-1'>
                  <Users size={12} />
                  {enrolledCount.toLocaleString()}
                </span>
              ) : null}
              {duration && (
                <span className='flex items-center gap-1'>
                  <Clock size={12} />
                  {duration}
                </span>
              )}
            </div>
            {instructors && instructors.length > 0 && (
              <div className='flex items-center gap-2 pt-1'>
                <div className='flex -space-x-2'>
                  {instructors.slice(0, 3).map((instructor) => (
                    <div key={instructor._id} className='w-6 h-6 rounded-full overflow-hidden border-2 border-dark-card'>
                      {instructor.photo?.asset?.url ? (
                        <Image
                          src={instructor.photo.asset.url}
                          width={24}
                          height={24}
                          alt={instructor.name ?? ''}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-white/10 flex items-center justify-center text-[10px] text-white/60'>
                          {instructor.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className='text-xs text-white/40 truncate'>
                  {instructors.map(i => i.name).join(', ')}
                </span>
              </div>
            )}
            <div className='flex items-center justify-between pt-2 border-t border-white/[0.06]'>
              <div className='flex items-center gap-2'>
                {price === 0 ? (
                  <span className='text-sm font-semibold text-emerald-400'>Free</span>
                ) : (
                  <>
                    <span className='text-sm font-semibold text-white'>${price}</span>
                    {originalPrice && originalPrice > (price ?? 0) && (
                      <span className='text-xs text-white/30 line-through'>${originalPrice}</span>
                    )}
                  </>
                )}
              </div>
              <span className='text-xs text-white/30 flex items-center gap-1'>
                <BookOpen size={12} />
                View Course
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
