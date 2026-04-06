import React from 'react';
import PostCard from './post-card';
import { AllPostsQueryResult } from "../../../../../sanity.types";

interface PostGridProps {
  posts: AllPostsQueryResult;
}

export default function PostGrid({ posts }: PostGridProps) {
  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
      {posts.map((post, index) => (
        <div
          key={post._id}
          className='animate-fade-in-up'
          style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  )
}
