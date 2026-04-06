import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Date from '@/components/ui/date';
import { ChevronRight } from 'lucide-react';
import Author from '@/components/ui/author';
import Heading from '@/components/shared/heading';
import { AllPostsQueryResult } from "../../../../../sanity.types";

interface PostCardProps {
  post: AllPostsQueryResult[number];
}

export default function PostCard({ post }: PostCardProps) {

  const { _createdAt, title, category, author, slug, excerpt, image } = post;

  return (
    <article aria-label={title ?? ''} className='relative group hover-lift'>
      <Link href={`/blog/${slug}`} className='block'>
        <div className='overflow-hidden rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] transition-colors duration-300'>
          <div className='relative'>
            {category?.title && (
              <span className='z-10 absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white/80 border border-white/[0.08]'>
                {category.title}
              </span>
            )}
            <Thumbnail image={image} />
          </div>
        </div>
        <div className='mt-5 space-y-3'>
          <Heading tag="h2" size="md" className='text-balance text-white group-hover:text-white/80 transition-colors'>
            {title}   
          </Heading>
          <p className='text-sm text-white/40 leading-relaxed line-clamp-2'>
            {excerpt}
          </p>
          <div className='flex items-center justify-between pt-1'>
            <div className='flex items-center gap-3.5'>
              <Author author={author} />
              <Date date={_createdAt} />
            </div>
            <ChevronRight 
              size={16} 
              className='-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-white/40'
            />
          </div>
        </div>
      </Link>
    </article>
  )
}

function Thumbnail({ image }: {
  image?: {
    asset?: { url?: string | null } | null;
    altText?: string | null;
  } | null;
}) {
  
  if (!image?.asset?.url) return null;
  
  return (
    <Image
      src={image.asset.url}
      width={800}
      height={800}
      alt={image.altText ?? ''}
      className='aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500'
    />
  )
}
