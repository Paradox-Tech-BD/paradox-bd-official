"use client"
import { useState, useEffect } from 'react';
import { BookOpen, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  level: string;
  thumbnail: string;
  price: number;
  enrolledCount: number;
  rating: number;
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instructor/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data.courses ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 size={28} className='text-violet-400 animate-spin' />
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-white mb-1'>My Courses</h1>
      <p className='text-white/40 text-sm mb-8'>Manage your assigned courses and content</p>

      {courses.length === 0 ? (
        <div className='rounded-xl border border-white/[0.08] bg-dark-card p-12 text-center'>
          <BookOpen size={32} className='text-white/20 mx-auto mb-3' />
          <p className='text-white/40'>No courses assigned yet.</p>
          <p className='text-white/20 text-sm mt-1'>Contact an admin to be assigned to a course.</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/courses/instructor-panel/courses/${course._id}`}
              className='group rounded-xl border border-white/[0.08] bg-dark-card hover:border-white/[0.12] transition-colors'
            >
              <div className='flex items-center gap-5 p-5'>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className='w-20 h-14 object-cover rounded-lg shrink-0'
                  />
                )}
                <div className='flex-1 min-w-0'>
                  <h3 className='text-white font-medium truncate'>{course.title}</h3>
                  <div className='flex items-center gap-4 mt-1'>
                    <span className='text-xs text-white/30'>{course.level}</span>
                    <span className='text-xs text-white/30'>{course.enrolledCount} students</span>
                    <span className='text-xs text-white/30'>${course.price}</span>
                    {course.rating > 0 && (
                      <span className='text-xs text-amber-400'>{course.rating.toFixed(1)} rating</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className='text-white/20 group-hover:text-white/40 transition-colors shrink-0' />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
