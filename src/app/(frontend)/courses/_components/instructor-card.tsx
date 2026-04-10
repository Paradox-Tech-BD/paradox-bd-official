import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/shared/heading';
import { AllInstructorsQueryResult } from '../../../../../sanity.types';
import { Star, Users } from 'lucide-react';

export default function InstructorCard({ instructor }: {
  instructor: AllInstructorsQueryResult[number];
}) {
  const { name, slug, title, bio, photo, expertise, courseCount, avgRating, totalStudents } = instructor;

  return (
    <article className='group hover-lift'>
      <Link href={slug ? `/courses/instructor/${slug}` : '#'} className='block'>
        <div className='p-6 rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] bg-dark-card transition-all duration-300'>
          <div className='flex items-start gap-4'>
            <div className='shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white/[0.08]'>
              {photo?.asset?.url ? (
                <Image
                  src={photo.asset.url}
                  width={64}
                  height={64}
                  alt={photo.altText ?? name ?? ''}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-white/10 flex items-center justify-center text-lg text-white/60'>
                  {name?.charAt(0)}
                </div>
              )}
            </div>
            <div className='min-w-0'>
              <Heading tag="h3" size="xs" className='text-white group-hover:text-white/80 transition-colors'>
                {name}
              </Heading>
              {title && (
                <p className='text-sm text-white/40 mt-1'>{title}</p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-4 mt-4 text-xs text-white/40'>
            {courseCount ? (
              <span>{courseCount} course{courseCount !== 1 ? 's' : ''}</span>
            ) : null}
            {avgRating ? (
              <span className='flex items-center gap-1'>
                <Star size={11} className='text-amber-400 fill-amber-400' />
                {avgRating.toFixed(1)}
              </span>
            ) : null}
            {totalStudents ? (
              <span className='flex items-center gap-1'>
                <Users size={11} />
                {totalStudents.toLocaleString()} students
              </span>
            ) : null}
          </div>
          {bio && (
            <p className='text-sm text-white/40 leading-relaxed mt-3 line-clamp-3'>
              {bio}
            </p>
          )}
          {expertise && expertise.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mt-4'>
              {expertise.slice(0, 4).map((skill) => (
                <span key={skill} className='px-2 py-0.5 rounded-full text-[11px] bg-white/[0.04] text-white/40 border border-white/[0.06]'>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
