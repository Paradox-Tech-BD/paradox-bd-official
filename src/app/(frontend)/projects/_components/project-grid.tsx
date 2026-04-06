import ProjectCard from './project-card';
import { AllProjectsQueryResult } from '../../../../../sanity.types';

interface ProjectGridProps {
  projects: AllProjectsQueryResult;
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
      {projects?.map((project, index) => (
        <div
          key={project._id}
          className='animate-fade-in-up'
          style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
