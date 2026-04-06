import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type FeaturesMinimalBlockProps = PageBuilderType<"featuresMinimalBlock">;

export default function FeaturesMinimalBlock(props: FeaturesMinimalBlockProps) {

  const { 
    heading,
    content, 
    buttons,
    features, 
    enableBorderTop,
    cornerRadiusTop,
    enableBorderBottom,
    cornerRadiusBottom,
    anchorId,
  } = props;

  return (
    <section
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('px-4 xl:px-10 bg-gray-50', {
        'border-t border-gray-200/60': enableBorderTop,
        'border-b border-gray-200/60': enableBorderBottom,
        'rounded-t-4xl': cornerRadiusTop === 'rounded',
        'rounded-b-4xl': cornerRadiusBottom === 'rounded'
      })}
    >
      <Container className='py-16 md:py-28 border-x border-gray-200/60 border-dashed space-y-10 md:space-y-14'>
        <div className='grid grid-cols-12 gap-y-12 md:gap-y-20 xl:gap-x-20'>
          <div className='col-span-12 xl:col-span-5 max-w-[400px] md:max-w-full space-y-10 md:space-y-10'>
            <div className='lg:flex justify-between xl:flex-col'>
              <Heading tag="h2" size="xl" className='max-w-[420px] relative pr-2.5 py-3 text-balance leading-normal border-y border-gray-200/60 border-dashed bg-gray-50 pattern-bg--2 text-gray-900'>
                <span className='relative z-20'>
                  {heading}
                </span>
                <EdgeBlur />
              </Heading>
              {content && (
                <PortableTextEditor 
                  data={content}
                  classNames='max-w-[400px] mt-8 text-balance text-gray-500'
                />
              )}
            </div>
            {buttons && buttons.length > 0 && (
              <ButtonRenderer buttons={buttons} />  
            )}
          </div>
          <div className='col-span-12 xl:col-span-7'>
            <div className='grid md:grid-cols-2 gap-y-3 md:gap-x-10'>
              {features?.map((feature: string) => (
                <div key={feature} className='pb-3.5 flex items-center gap-3.5 border-b border-gray-200/60 border-dashed'>
                  <Check size={18} className='text-blue-600 shrink-0' />
                  <span className='text-sm md:text-base text-gray-600'>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function EdgeBlur() {
  return (
    <div className='absolute inset-0 flex items-center justify-between pointer-events-none'>
      <div className='relative bg-gradient-to-r from-gray-50 to-transparent h-full w-[100px]'></div>
      <div className='bg-gradient-to-l from-gray-50 to-transparent h-full w-[100px]'></div>
    </div>
  )
}
