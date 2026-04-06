"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import { useInView } from '@/hooks/use-in-view';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import ButtonRenderer from '@/components/shared/button-renderer';

export type ServicesBlockProps = PageBuilderType<"servicesBlock">;

export default function ServicesBlock(props: ServicesBlockProps) {

  const { 
    heading, 
    services, 
    background, 
    topCornerRadius, 
    buttons,
    anchorId,
    paddingTop, 
    paddingBottom 
  } = props;

  const { ref, isInView } = useInView();

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      ref={ref}
      className={cn('', {
        'rounded-t-4xl border-t border-white/[0.06]': stegaClean(topCornerRadius) === 'rounded'
      })}
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <Container
          paddingTop={stegaClean(paddingTop) ?? undefined}
          paddingBottom={stegaClean(paddingBottom) ?? undefined}
          className='space-y-12'
        >
          <div className={cn(
            'flex items-end justify-between gap-6 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <Heading tag="h2" size="xl" className='max-w-[40rem] text-balance text-white'>
              {heading}
            </Heading>
            {buttons && buttons.length > 0 && (
              <div className='hidden md:block shrink-0'>
                <ButtonRenderer buttons={buttons} />  
              </div>
            )}
          </div>
          <div className='grid md:grid-cols-3 gap-6'>
            {services && services.map((service, index) => (
              <div 
                key={service._id}
                className={cn(
                  'transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                )}
                style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          {buttons && buttons.length > 0 && (
            <div className='md:hidden pt-4'>
              <ButtonRenderer buttons={buttons} />  
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}

function ServiceCard({ service }: {
  service: NonNullable<ServicesBlockProps['services']>[number];
}) {

  const { title, slug, shortDescription, image } = service;

  return (
    <div aria-label={title ?? ''} className='relative group hover-lift'>
      <Link href={`/services/${slug}`} className='block space-y-5'>
        <div className='overflow-hidden rounded-xl border border-white/[0.08] group-hover:border-white/[0.15] transition-colors duration-300'>
          <Image
            src={image?.asset?.url ?? ''}
            width={800}
            height={800}
            alt={image?.asset?.altText ?? ''}
            className='aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500'
          />
        </div>
        <h3 className='text-lg font-medium text-white group-hover:text-white/80 transition-colors'>
          {title}
        </h3>
        <p className='text-sm text-white/40 leading-relaxed'>
          {shortDescription}
        </p>
      </Link>
    </div>
  )
}
