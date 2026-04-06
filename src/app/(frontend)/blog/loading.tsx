import React from 'react';

export default function Loading() {
  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <article>
      <div className='relative space-y-5'>
        <div className='h-56 rounded-xl border border-white/[0.08] overflow-hidden'>
          <div className='h-full animate-pulse bg-white/5'></div>
        </div>
        <div className='space-y-2'>
          <div className='h-5 w-[80%] rounded-full bg-white/5' />
          <div className='h-5 w-[60%] rounded-full bg-white/5' />
        </div>
        <div className='space-y-2'>
          <div className='h-1 w-[80%] rounded-full bg-white/[0.03]' />
          <div className='h-1 w-[75%] rounded-full bg-white/[0.03]' />
          <div className='h-1 w-[70%] rounded-full bg-white/[0.03]' />
        </div>
      </div>
    </article>
  )
}
