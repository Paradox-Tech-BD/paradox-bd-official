import React from 'react';
import { ProjectSearch } from './project-search';
import ProjectCategories from './project-categories';
import { ProjectsPageQueryResult } from '../../../../../sanity.types';

type Project = NonNullable<
  NonNullable<ProjectsPageQueryResult>
>;

interface ProjectToolbarProps {
  categories?: Project["categories"];
  projects?: Project['projects']; 
}

export default function ProjectToolbar({ categories, projects }: ProjectToolbarProps) {
  return (
    <>
      <ProjectSearch projects={projects ?? []} classNames='mt-4 lg:hidden' />
      <div className='relative z-20 overflow-x-scroll lg:overflow-visible py-3 lg:py-2 mt-6 lg:mt-16 mb-6 lg:mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-2 border-y border-white/[0.06]'>
        <ProjectCategories categories={categories ?? []} />
        <ProjectSearch projects={projects ?? []} classNames='hidden lg:block' />
      </div>
    </>
  )
}
