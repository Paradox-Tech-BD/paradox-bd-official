"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import { CircleCheck } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { Button } from '@/components/ui/button';
import Heading from '@/components/shared/heading';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type FeatureCardsBlockProps = PageBuilderType<"featureCardsBlock">;

export default function FeatureCardsBlock(props: FeatureCardsBlockProps) {

  const { heading, buttons, features, showCallToAction, anchorId } = props;
  const { ref, isInView } = useInView();

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      ref={ref}
      className='py-24 lg:py-32'
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12 space-y-12'>
        <div className={cn(
          'flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <Heading tag="h2" size="xl" className='text-balance text-white'>
            {heading}
          </Heading>
          {buttons && buttons.length > 0 && (
            <ButtonRenderer classNames='hidden md:flex shrink-0' buttons={buttons} />  
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {features?.map((feature, index) => (
            <div 
              key={feature._key} 
              className={cn(
                'col-span-1 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
          {showCallToAction && (
            <CallToAction {...props} />
          )}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: {
  feature:  NonNullable<FeatureCardsBlockProps['features']>[number];
}) {
  return (
    <div className='border border-white/[0.08] rounded-xl bg-dark-card hover:border-white/[0.15] transition-all duration-300 overflow-hidden hover-lift'>
      <div className='p-3'>
        <div className='overflow-hidden rounded-lg'>
          <Image
            src={feature.image?.asset?.url ?? ''}
            width={600}
            height={400}
            alt={feature.title ?? ''}
            className='rounded-lg h-[280px] object-cover overflow-hidden hover:scale-105 transition-transform duration-500'
          />
        </div>
      </div>
      <div className='mt-4 px-6 md:px-8 pb-2'>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-white'>
            {feature.title}
          </h3>
          <p className='text-sm text-white/40 leading-relaxed'>
            {feature.description}
          </p>
        </div>
      </div>
      <div className='mt-4 space-y-0 border-t border-white/[0.06]'>
        {feature?.items?.map((item, index) => (
          <div 
            key={item} 
            className={cn('flex items-start md:items-center gap-3 px-6 md:px-8 py-3.5 border-b border-white/[0.06]', {
              'border-none': index === (feature?.items?.length ?? 0) - 1
            })}
          >
            <CircleCheck className='h-4 w-4 text-white/40 shrink-0' />
            <span className='text-sm text-white/60'>
              {item}
            </span>
          </div>
        ))}
      </div>
      {feature?.button?.showButton && (
        <div className='px-4 py-4 border-t border-white/[0.06]'>
          <Button 
            variant={feature?.button.buttonVariant}
            buttonType={feature?.button.buttonType}
            pageReference={feature?.button.buttonPageReference}
            externalUrl={feature?.button.buttonExternalUrl ?? ''}
            className='h-12 w-full'
          >
            {feature.button.buttonText}
          </Button>
        </div>
      )}
    </div>
  )
}

function CallToAction(props: FeatureCardsBlockProps) {

  const { 
    callToActionHeading,
    callToActionContent,
    callToActionButtons,
  } = props;

  return (
    <div className='col-span-2 w-full p-8 flex flex-col md:flex-row items-center gap-8 border border-white/[0.08] rounded-xl bg-dark-card'>
      <div className="space-y-4">
        <div className="font-medium text-xl text-balance text-white">
          {callToActionHeading}
        </div>
        <PortableTextEditor 
          data={callToActionContent}
          classNames='text-balance text-sm md:text-base text-white/40'
        />
      </div>
      {callToActionButtons && callToActionButtons.length > 0 && (
        <div className='items-center md:justify-center gap-2.5 shrink-0'>
          <ButtonRenderer buttons={callToActionButtons} />  
        </div>
      )}
    </div>
  )
}
