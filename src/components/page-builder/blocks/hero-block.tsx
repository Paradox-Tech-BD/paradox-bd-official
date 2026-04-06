"use client"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import { useEffect, useState } from 'react';
import PlayVideo from '@/components/shared/play-video';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';
import GridBackground from '@/components/effects/grid-background';
import BlurText from '@/components/effects/blur-text';
import ScannerLine from '@/components/effects/scanner-line';
import TechLabel from '@/components/effects/tech-label';

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
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('relative overflow-hidden', {
        'rounded-b-3xl md:rounded-b-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      {/* Canvas dot-grid background */}
      <div className='absolute inset-0 z-0'>
        <GridBackground className='opacity-60' />
      </div>

      {/* Gradient overlay so text is readable */}
      <div className='absolute inset-0 z-[1]' style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgb(12,12,18) 0%, transparent 100%), linear-gradient(to bottom, transparent 60%, rgb(12,12,18) 100%)',
      }} />

      {/* Atmospheric glows */}
      <div className='absolute bottom-0 right-0 w-[700px] h-[500px] rounded-full bg-white/[0.015] blur-[180px] pointer-events-none z-[1]' />
      <div className='absolute top-1/4 left-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.025] blur-[120px] pointer-events-none z-[1]' />

      {/* Scanner line effect */}
      <ScannerLine className='absolute inset-0 z-[2]' />

      {/* System status badge top-right */}
      <div className={cn(
        'absolute top-24 right-6 lg:right-12 z-10 transition-all duration-700 delay-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}>
        <TechLabel blink className='px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] backdrop-blur-md'>
          System Online
        </TechLabel>
      </div>

      <div className='relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div 
          className={cn('pt-36 md:pt-48 pb-20 md:pb-28 grid grid-cols-12 gap-6 xl:gap-14', {
            'pb-12': mediaType === 'image'
          })}
        >
          <div className='col-span-12 xl:col-span-7'>
            {/* Section label with blinking dot */}
            <div className={cn(
              'mb-6 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <TechLabel blink>Research &amp; Development · v2.0</TechLabel>
            </div>

            {/* Per-letter blur-reveal heading */}
            <h1 className='font-display text-4xl md:text-5xl xl:text-6xl leading-[1.1] tracking-tight text-white md:max-w-[40rem] text-balance'>
              {isVisible && heading ? (
                <BlurText text={heading} delay={200} stagger={28} />
              ) : (
                <span className='opacity-0'>{heading}</span>
              )}
            </h1>
          </div>

          <div className={cn(
            'col-span-12 xl:col-span-5 xl:pt-8 transition-all duration-1000 delay-500',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <PortableTextEditor 
              data={content ?? []}
              classNames='mt-3 md:text-lg text-white/45 text-balance leading-relaxed'
            />
            {buttons && buttons.length > 0 && (
              <div className='mt-8 md:mt-10'>
                <ButtonRenderer buttons={buttons} />  
              </div>
            )}

            {/* Tech data readout */}
            <div className={cn(
              'mt-10 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 transition-all duration-700 delay-700',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}>
              {[
                { label: 'Uptime', value: '99.9%' },
                { label: 'Latency', value: '< 2ms' },
                { label: 'Nodes', value: '1,024' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className='font-mono text-xs text-white/25 uppercase tracking-widest mb-1'>{stat.label}</div>
                  <div className='font-mono text-sm text-white/70'>{stat.value}</div>
                </div>
              ))}
            </div>
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
              {overlayType === 'dark' && <DarkOverlay />}
              {dialogType === 'video' && videoUrl && <PlayVideo videoUrl={videoUrl} />}
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
