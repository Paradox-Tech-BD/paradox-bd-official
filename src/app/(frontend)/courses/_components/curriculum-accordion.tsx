"use client"
import React, { useState } from 'react';
import { ChevronDown, PlayCircle, FileText, HelpCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lecture {
  _key: string | null;
  title: string | null;
  type: string | null;
  duration: number | null;
  isFree: boolean | null;
}

interface Section {
  _key: string | null;
  title: string | null;
  lectures: Lecture[] | null;
}

interface CurriculumAccordionProps {
  curriculum: Section[];
}

const lectureTypeIcons: Record<string, React.ElementType> = {
  video: PlayCircle,
  reading: FileText,
  markdown: FileText,
  quiz: HelpCircle,
};

export default function CurriculumAccordion({ curriculum }: CurriculumAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(curriculum[0]?._key ? [curriculum[0]._key] : [])
  );

  function toggleSection(key: string) {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className='border border-white/[0.08] rounded-xl overflow-hidden divide-y divide-white/[0.06]'>
      {curriculum.map((section) => {
        const isOpen = openSections.has(section._key ?? '');
        const sectionDuration = section.lectures?.reduce((acc, l) => acc + (l.duration ?? 0), 0) ?? 0;

        return (
          <div key={section._key}>
            <button
              onClick={() => toggleSection(section._key ?? '')}
              className='w-full flex items-center justify-between p-4 md:p-5 bg-dark-card hover:bg-white/[0.02] transition-colors text-left'
            >
              <div className='flex items-center gap-3'>
                <ChevronDown
                  size={16}
                  className={cn('text-white/30 transition-transform duration-200', {
                    'rotate-180': isOpen
                  })}
                />
                <span className='text-sm font-medium text-white'>{section.title}</span>
              </div>
              <span className='text-xs text-white/30 shrink-0 ml-4'>
                {section.lectures?.length ?? 0} lectures
                {sectionDuration > 0 && ` · ${sectionDuration} min`}
              </span>
            </button>
            {isOpen && section.lectures && (
              <div className='bg-dark-bg/50'>
                {section.lectures.map((lecture) => {
                  const Icon = lectureTypeIcons[lecture.type ?? 'video'] ?? PlayCircle;
                  return (
                    <div
                      key={lecture._key}
                      className='flex items-center justify-between px-5 md:px-6 py-3 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon size={14} className='text-white/20 shrink-0' />
                        <span className='text-sm text-white/50'>{lecture.title}</span>
                        {lecture.isFree && (
                          <span className='px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
                            Preview
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-3'>
                        {lecture.duration && (
                          <span className='text-xs text-white/20'>{lecture.duration} min</span>
                        )}
                        {!lecture.isFree && (
                          <Lock size={12} className='text-white/15' />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
