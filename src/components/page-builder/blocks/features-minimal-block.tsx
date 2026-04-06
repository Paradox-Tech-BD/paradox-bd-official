import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
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
      className={cn('py-24 lg:py-32 bg-dark-card', {
        'border-t border-white/[0.06]': enableBorderTop,
        'border-b border-white/[0.06]': enableBorderBottom,
        'rounded-t-4xl': cornerRadiusTop === 'rounded',
        'rounded-b-4xl': cornerRadiusBottom === 'rounded'
      })}
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12 space-y-12 md:space-y-16'>
        <div className='grid grid-cols-12 gap-y-12 md:gap-y-20 xl:gap-x-20'>
          <div className='col-span-12 xl:col-span-5 max-w-[400px] md:max-w-full space-y-8'>
            <div className='lg:flex justify-between xl:flex-col gap-12'>
              <div>
                <span className='section-label mb-6 block'>Capabilities</span>
                <Heading tag="h2" size="xl" className='max-w-[420px] text-balance text-white'>
                  {heading}
                </Heading>
              </div>
              {content && (
                <PortableTextEditor 
                  data={content}
                  classNames='max-w-[400px] mt-6 text-balance text-white/50 leading-relaxed'
                />
              )}
            </div>
            {buttons && buttons.length > 0 && (
              <ButtonRenderer buttons={buttons} />  
            )}
          </div>
          <div className='col-span-12 xl:col-span-7'>
            <div className='grid md:grid-cols-2 gap-y-0 md:gap-x-10'>
              {features?.map((feature: string) => (
                <div key={feature} className='py-4 flex items-center gap-3.5 border-b border-white/[0.06]'>
                  <Check size={18} className='text-white/40 shrink-0' />
                  <span className='text-sm md:text-base text-white/60'>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
