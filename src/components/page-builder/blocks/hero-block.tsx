"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
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

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('relative overflow-hidden', {
        'rounded-b-3xl md:rounded-b-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      <div className='absolute inset-0 bg-dark-bg' />
      <div className='absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none' />
      
      <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div 
          className={cn('pt-36 md:pt-48 pb-20 md:pb-28 grid grid-cols-12 gap-6 xl:gap-14', {
            'pb-12': mediaType === 'image'
          })}
        >
          <div className='col-span-12 xl:col-span-7'>
            <span className='section-label mb-6 block'>Research & Development</span>
            <Heading size="xxxl" tag="h1" className='md:max-w-[40rem] text-balance text-white'>
              {heading}
            </Heading>
          </div>
          <div className='col-span-12 xl:col-span-5 xl:pt-8'>
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
          <div className='pb-8 md:pb-16'>
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
