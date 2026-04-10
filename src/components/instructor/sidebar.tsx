"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, MessageSquare } from 'lucide-react';

const navItems = [
  { href: '/courses/instructor-panel', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/courses/instructor-panel/courses', label: 'Courses', icon: BookOpen },
  { href: '/courses/instructor-panel/enrollments', label: 'Enrollments', icon: Users },
  { href: '/courses/instructor-panel/support', label: 'Support', icon: MessageSquare },
];

export function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-56 shrink-0 border-r border-white/[0.06] min-h-[calc(100vh-5rem)] hidden md:block'>
      <div className='p-4'>
        <span className='text-[11px] font-mono uppercase tracking-wider text-white/30 px-3'>
          Instructor
        </span>
        <nav className='mt-3 flex flex-col gap-1'>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
