import React from 'react';
import { BlogSearch } from './blog-search';
import PostCategories from './post-categories';
import { BlogPageQueryResult } from '../../../../../sanity.types';

type Blog = NonNullable<
  NonNullable<BlogPageQueryResult>
>;

interface BlogToolbarProps {
  categories?: Blog["categories"];
  posts?: Blog['posts'];
}

export default function BlogToolbar({ categories, posts }: BlogToolbarProps) {
  return (
    <>
      <BlogSearch posts={posts ?? []} classNames='mt-4 lg:hidden' />
      <div className='relative z-20 overflow-x-scroll lg:overflow-visible py-3 lg:py-2 mt-6 lg:mt-16 mb-6 lg:mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-2 border-y border-white/[0.06]'>
        <PostCategories categories={categories ?? []} />
        <BlogSearch posts={posts ?? []} classNames='hidden lg:block' />
      </div>
    </>
  )
}
