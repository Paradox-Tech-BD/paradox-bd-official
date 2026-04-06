import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import ButtonRenderer from '@/components/shared/button-renderer';
import AnimatedUnderline from '@/components/shared/animated-underline';

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

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className={cn('px-4 xl:px-10 bg-lab-bg', {
        'pattern-bg': stegaClean(background) === 'pattern',
        'rounded-t-4xl border-t border-lab-border': stegaClean(topCornerRadius) === 'rounded'
      })}
    >
      <Container 
        paddingTop={stegaClean(paddingTop) ?? undefined}
        paddingBottom={stegaClean(paddingBottom) ?? undefined}
        className='space-y-10 border-x border-lab-border border-dashed'
      >
        <div className='py-4 flex items-center justify-between gap-6 border-y border-lab-border border-dashed'>
          <Heading tag="h2" size="xl" className='max-w-[40rem] text-balance leading-tight text-slate-100'>
            {heading}
          </Heading>
          {buttons && buttons.length > 0 && (
            <div className='hidden md:block'>
              <ButtonRenderer buttons={buttons} />  
            </div>
          )}
        </div>
        <div className='grid md:grid-cols-3 gap-x-6 gap-y-10'>
          {services && services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
        {buttons && buttons.length > 0 && (
          <div className='md:hidden pt-4'>
            <ButtonRenderer buttons={buttons} />  
          </div>
        )}
      </Container>
    </section>
  )
}

function ServiceCard({ service }: {
  service: NonNullable<ServicesBlockProps['services']>[number];
}) {

  const { title, slug, shortDescription, image } = service;

  return (
    <div aria-label={title ?? ''} className='relative pb-8 group border-b border-lab-border border-dashed hover:border-lab-cyan/30 transition-colors duration-300'>
      <Link href={`/services/${slug}`} className='relative space-y-4 md:space-y-6'>
        <div className='p-3 rounded-3xl border border-lab-border bg-lab-card group-hover:border-lab-cyan/25 transition-colors duration-300'>
          <Image
            src={image?.asset?.url ?? ''}
            width={800}
            height={800}
            alt={image?.asset?.altText ?? ''}
            className='aspect-[3/2] rounded-2xl object-cover'
          />
        </div>
        <Heading tag="h2" size="md" className='pt-1 md:pt-0 text-balance text-slate-100'>
          {title}
        </Heading>
        <p className='text-sm md:text-base md:text-balance text-slate-400'>
          {shortDescription}
        </p>
      </Link>
      <AnimatedUnderline className='-translate-y-0.5 bg-lab-cyan' />
    </div>
  )
}
