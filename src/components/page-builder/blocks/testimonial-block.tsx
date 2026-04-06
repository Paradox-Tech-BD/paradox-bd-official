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
      className={cn('pb-10 md:pb-0 xl:px-10 pattern-bg border-y border-lab-border', {
        'rounded-t-4xl': stegaClean(cornerRadiusTop) === 'rounded',
        'rounded-b-4xl': stegaClean(cornerRadiusBottom) === 'rounded'
      })}
    >
      <Container className='py-16 md:py-28 space-y-10 border-x border-lab-border border-dashed'>
        <div>
          <div className='w-fit mx-auto px-3 h-7 flex items-center justify-between rounded-full text-center text-xs font-medium tracking-widest uppercase bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan'>
            {eyebrow}
          </div>
          <h2 className='mt-6 py-2 text-center text-xl md:text-2xl font-semibold border-y border-lab-border w-fit mx-auto bg-gradient-to-r from-lab-bg/0 via-lab-cyan/10 to-lab-bg/0 text-slate-100'>
            {heading}
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
            <CarouselPrevious className='border-lab-border text-slate-300 hover:border-lab-cyan/40 hover:text-lab-cyan bg-lab-card' />
            <CarouselNext className='border-lab-border text-slate-300 hover:border-lab-cyan/40 hover:text-lab-cyan bg-lab-card' />
          </Carousel>
        ): (
          <TestimonialCard 
            testimonial={testimonials?.[0] ?? null} 
            classNames='border border-lab-border rounded-xl'
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
    <div className={cn('h-full mx-auto max-w-[38rem] md:max-w-[44rem] p-8 md:p-12 space-y-10 md:space-y-20 flex flex-col justify-between bg-lab-card', classNames)}>
      <h2 className='text-base md:text-xl text-pretty text-slate-200 italic'>
        &ldquo;{testimonial?.quote}&rdquo;
      </h2>
      <div className='flex flex-col md:flex-row md:items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Image
            src={testimonial?.avatar?.asset?.url ?? ''}
            width={50}
            height={50}
            alt={testimonial?.name ?? ''}
            className='w-12 h-12 rounded-full border border-lab-border'
          />
          <div className='-space-y-0.5'>
            <h3 className='text-sm md:text-base font-medium text-slate-200'>
              {testimonial?.name}
            </h3>
            <p className='text-sm text-slate-500'>
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
            className='hidden md:block opacity-60'
          />
        </div>
      </div>
    </div>
  )
}
