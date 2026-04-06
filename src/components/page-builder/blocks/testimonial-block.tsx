"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import Container from '@/components/global/container';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export type TestimonialBlockProps = PageBuilderType<"testimonialBlock">;

export default function TestimonialBlock(props: TestimonialBlockProps) {

  const { 
    heading, 
    eyebrow, 
    testimonials, 
    anchorId, 
    cornerRadiusTop,
    cornerRadiusBottom,
  } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className={cn('relative py-24 lg:py-32 bg-white text-dark-bg overflow-hidden', {
        'rounded-t-4xl': stegaClean(cornerRadiusTop) === 'rounded',
        'rounded-b-4xl': stegaClean(cornerRadiusBottom) === 'rounded'
      })}
    >
      <Container className='space-y-12'>
        <div className='text-center'>
          {eyebrow && (
            <div className='w-fit mx-auto px-3 h-7 flex items-center justify-between rounded-full text-center text-xs font-medium tracking-wider uppercase bg-dark-bg/5 text-dark-bg/60'>
              {eyebrow}
            </div>
          )}
          <h2 className='mt-6 text-2xl md:text-3xl font-display text-dark-bg'>
            {heading}
            <span className='text-dark-bg/30'> from our clients.</span>
          </h2>
        </div>
        {testimonials && testimonials.length > 1 ? (
          <Carousel className="w-full max-w-[38rem] xl:max-w-[44rem] mx-auto">
            <CarouselContent>
              {testimonials?.map((testimonial) => (
                <CarouselItem key={testimonial._id}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='border-dark-bg/10 text-dark-bg hover:border-dark-bg/30 bg-white' />
            <CarouselNext className='border-dark-bg/10 text-dark-bg hover:border-dark-bg/30 bg-white' />
          </Carousel>
        ): (
          <TestimonialCard 
            testimonial={testimonials?.[0] ?? null} 
            classNames='border border-dark-bg/10 rounded-xl'
          />
        )}       
      </Container>
    </section>
  )
}

function TestimonialCard({ testimonial, classNames }: {
  testimonial: NonNullable<TestimonialBlockProps['testimonials']>[number] | null;
  classNames?: string;
}) {
  return (
    <div className={cn('h-full mx-auto max-w-[38rem] md:max-w-[44rem] p-8 md:p-12 space-y-12 md:space-y-20 flex flex-col justify-between', classNames)}>
      <h2 className='text-base md:text-xl text-pretty text-dark-bg/80 font-display italic leading-relaxed'>
        &ldquo;{testimonial?.quote}&rdquo;
      </h2>
      <div className='flex flex-col md:flex-row md:items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Image
            src={testimonial?.avatar?.asset?.url ?? ''}
            width={50}
            height={50}
            alt={testimonial?.name ?? ''}
            className='w-12 h-12 rounded-full border border-dark-bg/10'
          />
          <div className='-space-y-0.5'>
            <h3 className='text-sm md:text-base font-medium text-dark-bg'>
              {testimonial?.name}
            </h3>
            <p className='text-sm text-dark-bg/40'>
              {testimonial?.jobTitle}
            </p>
          </div>
        </div>
        <div>
          <Image
            src={testimonial?.logo?.asset?.url ?? ''}
            width={80}
            height={40}
            alt={`${testimonial?.company} Logo`}
            className='hidden md:block opacity-40'
          />
        </div>
      </div>
    </div>
  )
}
