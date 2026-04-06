"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import ProjectToolbar from './project-toolbar';
import Heading from '@/components/shared/heading';
import { PageBuilder } from '@/components/page-builder';
import { ProjectsPageQueryResult } from '../../../../../sanity.types';

export default function ProjectsLayout({ children, page }: Readonly<{
  children: React.ReactNode;
  page: ProjectsPageQueryResult;
}>) {

  const pathname = usePathname();

  const { categories, projects, title } = page ?? {};

  if (pathname === '/projects' || pathname.includes('/projects/category/')) return (
    <main className='overflow-hidden md:overflow-auto'>
      <div className='relative'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none' />
        <div className='max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 md:pt-40 pb-14 md:pb-28'>
          <Heading tag="h1" size="xxxl" className='animate-fade-in-up'>
            {title}
          </Heading>
          {(pathname === '/projects' || pathname.includes('/projects/category/')) && (
            <ProjectToolbar categories={categories} projects={projects} />
          )}
          {children}
        </div>
      </div>
      <PageBuilder
        id={page?._id ?? ''}
        type={page?._type ?? ''}
        pageBuilder={page?.pageBuilder ?? []}
      />
    </main>
  )

  return (
    <>
      {children}
    </>
  )
}
