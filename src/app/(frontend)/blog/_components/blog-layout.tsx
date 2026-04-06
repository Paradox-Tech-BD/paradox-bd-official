"use client"
import React from 'react';
import BlogToolbar from './blog-toolbar';
import { usePathname } from 'next/navigation';
import Heading from '@/components/shared/heading';
import { PageBuilder } from '@/components/page-builder';
import { BlogPageQueryResult } from '../../../../../sanity.types';

export default function BlogLayout({ children, page }: Readonly<{
  children: React.ReactNode;
  page: BlogPageQueryResult;
}>) {

  const pathname = usePathname();

  const { categories, posts, title } = page ?? {};

  if (pathname === '/blog' || pathname.includes('/blog/category/')) return (
    <main className='overflow-hidden md:overflow-auto'>
      <div className='relative'>
        <div className='absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none' />
        <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-14 md:pb-28'>
          <Heading tag="h1" size="xxxl" className='w-fit animate-fade-in-up'>
            {title}
          </Heading>
          {(pathname === '/blog' || pathname.includes('/blog/category/')) && (
            <BlogToolbar categories={categories} posts={posts} />
          )}
          {children}
        </div>
      </div>
      <PageBuilder
        id={page?._id ?? ''}
        type={page?._type ?? ''}
        pageBuilder={page?.pageBuilder ?? []}
      />
    </main>
  )

  return (
    <main className='pt-32 md:pt-40 pb-10 xl:pb-16'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        {children}
      </div>
    </main>
  )
}
