"use client"
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type HeaderBlockProps = PageBuilderType<"headerBlock">;

export default function HeaderBlock(props: HeaderBlockProps) {

  const { heading, content, bottomCornerRadius, anchorId } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('relative overflow-hidden noise-overlay', {
        'rounded-b-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      <div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none' />
      <div className='relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='pt-36 md:pt-48 pb-20 md:pb-32'>
          <span className={cn(
            'section-label mb-6 block transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>Overview</span>
          <Heading tag="h1" size="xxl" className={cn(
            'text-balance text-white transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            {heading}
          </Heading>
          <div className={cn(
            'transition-all duration-1000 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <PortableTextEditor 
              data={content ?? []}
              classNames='mt-6 md:mt-8 md:text-lg text-balance text-white/50 leading-relaxed max-w-2xl'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
