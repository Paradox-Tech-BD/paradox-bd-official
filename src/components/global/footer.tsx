import Link from 'next/link';
import { cn } from '@/lib/utils';
import Container from './container';
import Heading from '../shared/heading';
import SiteLogo from '../shared/site-logo';
import { ExternalLink } from 'lucide-react';
import AnimatedUnderline from '../shared/animated-underline';
import { GeneralSettingsQueryResult, NavigationSettingsQueryResult } from '../../../sanity.types';

interface FooterProps {
  settings: GeneralSettingsQueryResult;
  navigationSettings: NavigationSettingsQueryResult;
}

export default function Footer({ settings, navigationSettings }: FooterProps) {

  const { copyright } = settings ?? {};
  
  const { 
    footerColumns: columns, 
    footerLegalMenuItems: legalMenuItems 
  } = navigationSettings?.footer ?? {};

  return (
    <footer className='border-t border-white/[0.06] bg-dark-bg'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='pt-16 md:pt-20 pb-8 space-y-16 md:space-y-20'>
          <div className='flex-none'>
            <SiteLogo settings={settings} location="footer" theme="light" />
          </div>
          <FooterColumns columns={columns ?? []} />
        </div>
        <div className='py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10'>
          <div className='text-sm text-white/30'>
            {copyright} © {new Date().getFullYear()}
          </div>
          <LegalMenuItems legalMenuItems={legalMenuItems ?? []} />
        </div>
      </div>
    </footer>
  )
}

function FooterColumns({ columns }: {
  columns: Array<{
    _key: string;
    title: string | null;
    menuItems: Array<{
      _key: string;
      title: string | null;
      linkType: "external" | "internal" | null;
      pageReference: {
        _id: string;
        title: string | null;
        slug: string | null;
      } | null;
      externalUrl: string | null;
    }> | null;
  }> | null;
}) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
      {columns?.map((column) => (
        <div key={column._key} className='space-y-6'>
          <h3 className='text-sm font-medium text-white'>
            {column.title}
          </h3>
          <ul className='space-y-3'>
            {column?.menuItems?.map((item) => (
              <li key={item._key}>
                {item.linkType === 'internal' ? (
                  <Link 
                    href={`/${item?.pageReference?.slug}`}
                    className='relative group text-sm text-white/40 hover:text-white transition-colors duration-200'
                  >
                    {item.title}
                    <AnimatedUnderline className='bg-white' />
                  </Link>
                ): (
                  <a 
                    href={item?.externalUrl ?? ''}
                    rel="noopener noreferrer" target="_blank"
                    className='group flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-200'
                  >
                    <span className='relative'>
                      {item.title}
                      <AnimatedUnderline className='bg-white' />
                    </span>
                    <ExternalLink size={12} className='opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function LegalMenuItems({ legalMenuItems }: {
  legalMenuItems: Array<{
    _key: string;
    title: string | null;
    pageReference: {
      _id: string;
      title: string | null;
      slug: string | null;
    } | null;
  }> | null;
}) {
  return (
    <ul className='flex items-center gap-4'>
      {legalMenuItems?.map((item) => (
        <li key={item._key}>
          <Link 
            href={`/${item?.pageReference?.slug}`}
            className='text-sm text-white/30 hover:text-white transition-colors duration-200'
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
