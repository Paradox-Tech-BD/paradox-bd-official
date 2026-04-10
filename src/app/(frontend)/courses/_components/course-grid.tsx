import CourseCard from './course-card';
import { AllCoursesQueryResult } from '../../../../../sanity.types';

interface CourseGridProps {
  courses: AllCoursesQueryResult;
}

export default function CourseGrid({ courses }: CourseGridProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-white/40 text-lg'>No courses found.</p>
      </div>
    );
  }

  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
      {courses?.map((course, index) => (
        <div
          key={course._id}
          className='animate-fade-in-up'
          style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
        >
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  )
}
