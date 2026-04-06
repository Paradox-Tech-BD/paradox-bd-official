"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import { useEffect, useState } from 'react';
import Heading from '@/components/shared/heading';
import PlayVideo from '@/components/shared/play-video';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type HeroBlockProps = PageBuilderType<"heroBlock">;

export default function HeroBlock(props: HeroBlockProps) {

  const { 
    heading, 
    content, 
    mediaType, 
    bottomCornerRadius, 
    buttons, 
    image, 
    dialogType,
    videoUrl,
    overlayType,
    anchorId 
  } = props;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('relative overflow-hidden noise-overlay', {
        'rounded-b-3xl md:rounded-b-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      <div className='absolute inset-0 bg-dark-bg' />
      <div className='absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[150px] pointer-events-none' />
      <div className='absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none' />
      
      <div className='relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div 
          className={cn('pt-36 md:pt-48 pb-20 md:pb-28 grid grid-cols-12 gap-6 xl:gap-14', {
            'pb-12': mediaType === 'image'
          })}
        >
          <div className='col-span-12 xl:col-span-7'>
            <span className={cn(
              'section-label mb-6 block transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              Research & Development
            </span>
            <Heading 
              size="xxxl" tag="h1" 
              className={cn(
                'md:max-w-[40rem] text-balance text-white transition-all duration-1000',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {heading}
            </Heading>
          </div>
          <div className={cn(
            'col-span-12 xl:col-span-5 xl:pt-8 transition-all duration-1000 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <PortableTextEditor 
              data={content ?? []}
              classNames='mt-3 md:text-lg text-white/50 text-balance leading-relaxed'
            />
            {buttons && buttons.length > 0 && (
              <div className='mt-8 md:mt-10'>
                <ButtonRenderer buttons={buttons} />  
              </div>
            )}
          </div>
        </div>
        {mediaType === 'image' && image && (
          <div className={cn(
            'pb-8 md:pb-16 transition-all duration-1000 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          )}>
            <div className='overflow-hidden relative h-full w-full rounded-xl border border-white/[0.08]'>
              <Image
                priority
                width={1400}
                height={800}
                src={image?.asset?.url ?? ''}
                alt={image?.asset?.altText ?? ''}
                className={cn('object-cover w-full', {
                  'max-h-[30rem]': image?.height === 'short'
                })}
              />
              {overlayType === 'dark' && (
                <DarkOverlay />
              )}
              {dialogType === 'video' && videoUrl && (
                <PlayVideo videoUrl={videoUrl} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function DarkOverlay() {
  return (
    <>
      <div className='absolute inset-0 bg-dark-bg/30' />
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/60 to-transparent h-[50%] w-full' />
    </>
  )
}
