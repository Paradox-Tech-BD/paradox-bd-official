"use client"
import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { RecentCourseTestimonialsQueryResult } from '../../../../../sanity.types';

interface TestimonialsCarouselProps {
  testimonials: RecentCourseTestimonialsQueryResult;
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className='w-full'
    >
      <CarouselContent className='!border-0 !rounded-none'>
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial._id} className='md:basis-1/2 xl:basis-1/4'>
            <div className='p-5 rounded-xl border border-white/[0.08] bg-dark-card h-full'>
              <Quote size={20} className='text-violet-400/30 mb-3' />
              <p className='text-sm text-white/50 leading-relaxed line-clamp-4'>{testimonial.quote}</p>
              <div className='mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full overflow-hidden bg-white/[0.06] shrink-0'>
                  {testimonial.avatar?.asset?.url ? (
                    <Image
                      src={testimonial.avatar.asset.url}
                      width={32}
                      height={32}
                      alt={testimonial.name ?? ''}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-xs text-white/40'>
                      {testimonial.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className='min-w-0'>
                  <p className='text-xs font-medium text-white truncate'>{testimonial.name}</p>
                  {testimonial.courseName && (
                    <p className='text-[11px] text-white/30 truncate'>{testimonial.courseName}</p>
                  )}
                </div>
                <div className='ml-auto flex items-center gap-0.5'>
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
