import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/shared/heading';
import { AllProjectsQueryResult } from '../../../../../sanity.types';

export default function ProjectCard({ project }: {
  project: AllProjectsQueryResult[number];
}) {

  const { title, category, slug, excerpt, image } = project;

  return (
    <article aria-label={title ?? ''} className='relative group hover-lift'>
      <Link href={`/projects/${slug}`} className='block'>
        <div className='overflow-hidden rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] transition-colors duration-300'>
          <div className='relative'>
            {category?.title && (
              <span className='z-10 absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white/80 border border-white/[0.08]'>
                {category.title}
              </span>
            )}
            <Image
              src={image?.asset?.url ?? ''}
              width={800}
              height={800}
              alt={image?.altText ?? ''}
              className='aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500'
            />
          </div>
        </div>
        <div className='mt-5 space-y-3'>
          <Heading tag="h2" size="md" className='text-balance text-white group-hover:text-white/80 transition-colors'>
            {title}   
          </Heading>
          <p className='text-sm text-white/40 leading-relaxed line-clamp-2'>
            {excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
