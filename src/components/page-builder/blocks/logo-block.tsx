import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import Container from '@/components/global/container';

export type LogoBlockProps = PageBuilderType<"logoBlock">;

export default function LogoBlock(props: LogoBlockProps) {

  const { heading, logos, anchorId } = props;
  
  const items = logos ? [...logos, ...logos] : [];
  
  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className='px-4 md:px-10 border-b border-gray-200/60 rounded-b-4xl bg-gray-50'
    >
      <Container className='px-0 border-x border-gray-200/60 border-dashed'>
        <div className='py-6 md:py-10'>
          <div className='relative w-fit mx-auto py-2 px-10 mt-4 md:mt-7 pattern-bg--2 border-y border-gray-200/60'>
            <h2 className='text-center font-geistMono text-xs md:text-sm uppercase font-medium text-blue-600/70 tracking-widest'> 
              {heading}
            </h2>
            <EdgeBlur />
          </div>
          <div className="relative mt-10 md:mt-16 mb-6 md:mb-8 overflow-clip">
            <div className="relative z-30 flex items-center py-4 md:py-10 pl-[4.8rem] gap-16 md:gap-[10rem] w-max animate-logo-marquee border-y border-gray-200/60 border-dashed">
              {items.map((item, index) => (
                <div key={item._key + index} className='opacity-50 hover:opacity-80 transition-opacity duration-300'>
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
            <EdgeBlur />
          </div>
        </div>
      </Container>
    </section>
  )
}

function EdgeBlur() {
  return (
    <div className='absolute inset-0 flex items-center justify-between pointer-events-none'>
      <div className='z-30 relative bg-gradient-to-r from-gray-50 to-transparent h-full w-[200px]'></div>
      <div className='z-30 relative bg-gradient-to-l from-gray-50 to-transparent h-full w-[200px]'></div>
    </div>
  )
}
