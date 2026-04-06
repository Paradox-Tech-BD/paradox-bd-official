"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import { useInView } from '@/hooks/use-in-view';

export type LogoBlockProps = PageBuilderType<"logoBlock">;

export default function LogoBlock(props: LogoBlockProps) {

  const { heading, logos, anchorId } = props;
  const { ref, isInView } = useInView();
  
  const items = logos ? [...logos, ...logos] : [];
  
  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      ref={ref}
      className='py-12 md:py-16 border-y border-white/[0.06]'
    >
      <div className={cn(
        'max-w-[1400px] mx-auto px-6 lg:px-12 transition-all duration-700',
        isInView ? 'opacity-100' : 'opacity-0'
      )}>
        <div className='text-center mb-10'>
          <span className='font-mono text-xs md:text-sm text-white/30 tracking-wider uppercase'>
            {heading}
          </span>
        </div>
        <div className="relative overflow-clip">
          <div className="flex items-center py-6 gap-16 md:gap-[10rem] w-max animate-logo-marquee">
            {items.map((item, index) => (
              <div key={item._key + index} className='opacity-40 hover:opacity-70 transition-opacity duration-300'>
                {item.link ? (
                  <a 
                    href={item.link}
                    target="_blank" rel="noopener noreferrer" 
                  >
                    <Image
                      width={200}
                      height={100}
                      src={item.image?.asset?.url ?? ''}
                      alt={`${item.title} Logo`}
                      className={cn('w-20 md:w-28 object-contain brightness-0 invert', {
                        'w-36 md:w-40': stegaClean(item?.size) === 'large'
                      })}
                    />
                  </a>
                ): (
                  <Image
                    width={200}
                    height={100}
                    src={item.image?.asset?.url ?? ''}
                    alt={`${item.title} Logo`}
                    className={cn('w-20 md:w-28 object-contain brightness-0 invert', {
                      'w-36 md:w-40': stegaClean(item?.size) === 'large'
                    })}
                  />  
                )}
              </div>
            ))}
          </div>
          <div className='absolute inset-0 flex items-center justify-between pointer-events-none'>
            <div className='z-30 relative bg-gradient-to-r from-dark-bg to-transparent h-full w-[200px]'></div>
            <div className='z-30 relative bg-gradient-to-l from-dark-bg to-transparent h-full w-[200px]'></div>
          </div>
        </div>
      </div>
    </section>
  )
}
