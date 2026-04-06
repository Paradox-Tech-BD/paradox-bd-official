"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import Container from '@/components/global/container';
import PlayVideo from '@/components/shared/play-video';

export type MediaBlockProps = PageBuilderType<"mediaBlock">;

export default function MediaBlock(props: MediaBlockProps) {

  const { 
    backgroundType,
    backgroundWidth,
    image, 
    overlayType,
    dialogType,
    videoUrl,
    anchorId 
  } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('', {
        'px-6 lg:px-12 max-w-[1400px] mx-auto': stegaClean(backgroundWidth) === 'contained'
      })}
    >
      <div 
        className={cn('relative h-[18rem] md:h-[48rem] overflow-hidden', {
          'rounded-xl border border-white/[0.08]': stegaClean(backgroundWidth) === 'contained'
        })}
      >
        {backgroundType === 'image' && image && (
          <div className='absolute inset-0'>
            <Image
              src={image?.asset?.url ?? ''}
              width={2400}
              height={1200}
              alt={image?.asset?.altText ?? ''}
              className='w-full h-full object-cover'
            />
            {overlayType === 'dark' && (
              <DarkOverlay />
            )}
          </div>
        )}
        {dialogType === 'video' && videoUrl && (
          <PlayVideo videoUrl={videoUrl} />
        )}
      </div>
    </section>
  )
}

function DarkOverlay() {
  return (
    <>
      <div className='absolute inset-0 bg-dark-bg/40' />
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg to-transparent h-[50%] w-full' />
    </>
  )
}
