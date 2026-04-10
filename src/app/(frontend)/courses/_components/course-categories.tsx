"use client"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CourseCategoriesQueryResult } from "../../../../../sanity.types";

interface CourseCategoriesProps {
  categories: CourseCategoriesQueryResult;
}

export default function CourseCategories({ categories }: CourseCategoriesProps) {
  return (
    <ul className='relative z-20 flex items-center justify-start gap-1 md:gap-2'>
      <li className="text-nowrap">
        <CategoryLink href="/courses/all">
          All Courses
        </CategoryLink>
      </li>
      {categories?.map((category) => (
        <li key={category._id} className="text-nowrap">
          <CategoryLink
            href={`/courses/category/${category.slug}`}
            slug={category.slug}
          >
            {category.title}
            {category.courseCount ? (
              <span className='ml-1.5 text-[10px] text-white/30'>({category.courseCount})</span>
            ) : null}
          </CategoryLink>
        </li>
      ))}
    </ul>
  )
}

function CategoryLink({ href, slug, children }: {
  href: string;
  children: React.ReactNode;
  slug?: string | null;
}) {
  const pathname = usePathname();

  const isActive = slug
    ? pathname === `/courses/category/${slug}`
    : pathname === '/courses/all';

  return (
    <Link 
      href={href}
      className={cn('py-1.5 px-3.5 rounded-full text-sm border border-transparent transition-all duration-300', {
        'border-white/20 bg-white/10 text-white font-medium': isActive,
        'text-white/50 hover:text-white hover:bg-white/5': !isActive
      })}
    >
      {children}
    </Link>
  )
}
