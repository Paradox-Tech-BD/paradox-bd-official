"use client"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BlogPageQueryResult } from "../../../../../sanity.types";

type Blog = NonNullable<
  NonNullable<BlogPageQueryResult>
>;

interface PostCategoriesProps {
  categories: Blog['categories'];
}

export default function PostCategories({ categories }: PostCategoriesProps) {
  return (
    <ul className='relative z-20 flex items-center justify-start gap-1 md:gap-2'>
      <li className="text-nowrap">
        <CategoryLink href={`/blog`}>
          All Posts
        </CategoryLink>
      </li>
      {categories.map((category) => (
        <li key={category._id} className="text-nowrap">
          <CategoryLink
            href={`/blog/category/${category.slug}`}
            category={category}
          >
            {category.title}
          </CategoryLink>
        </li>
      ))}
    </ul>
  )
}

function CategoryLink({ href, category, children }: {
  href: string;
  children: React.ReactNode;
  category?: Blog['categories'][number];
}) {

  const pathname = usePathname();

  const isActive = category 
    ? pathname === `/blog/category/${category.slug}`
    : pathname === '/blog';

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
