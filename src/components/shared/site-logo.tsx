"use client"
import React from 'react';
import Image from 'next/image';
import { cn, scrollToElement } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { GeneralSettingsQueryResult } from '../../../sanity.types';

export default function SiteLogo({ settings, location, theme }: {
  settings: GeneralSettingsQueryResult;
  location?: 'footer' | 'navbar';
  theme?: 'light' | 'dark';
}) {

  const pathname = usePathname();
  const router = useRouter();

  const { siteTitle, siteLogo } = settings ?? {};

  return (
    <button 
      aria-label="Go to home page"
      onClick={() => pathname === '/' ? scrollToElement('home') : router.push(`/#home`)}
      className='hover:scale-[0.95] transition-transform duration-300 ease-in-out'
    >
      {!siteLogo ? ( 
        <span 
          className={cn('font-display tracking-tight', {
            'text-3xl': location === 'footer',
            'text-xl': location !== 'footer',
            'text-white': theme === 'light' || !theme,
            'text-dark-bg': theme === 'dark',
          })}
        >
          {siteTitle}
        </span>
      ): (
        <Image
          priority
          width={140}
          height={140}
          src={siteLogo?.asset?.url ?? ''}
          alt={`${siteTitle} Logo`}
          className={cn('w-[140px] h-auto object-contain', {
            'brightness-0 invert': theme === 'light' || !theme,
          })}
        />
      )}
    </button>
  )
}
