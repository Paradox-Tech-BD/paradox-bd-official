"use client"
import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';
import { stegaClean } from 'next-sanity';

export type PortableTextBlockProps = PageBuilderType<"portableTextBlock">;

export default function PortableTextBlock(props: PortableTextBlockProps) {

  const { content, alignment, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className='py-16 md:py-24'
    >
      <div 
        className={cn('max-w-[1400px] mx-auto px-6 lg:px-12 flex', {
          'justify-start': stegaClean(alignment) === 'left',
          'justify-center': stegaClean(alignment) === 'center',
          'justify-end': stegaClean(alignment) === 'right',
        })}
      >
        <div 
          className={cn('max-w-[48rem]', {
            'pl-10 border-l border-white/[0.06]': stegaClean(alignment) === 'left',
            'pr-10 border-r border-white/[0.06]': stegaClean(alignment) === 'right',
          })}
        >
          <PortableTextEditor 
            data={content ?? []}
            classNames='text-balance text-white/60'
          />
        </div>
      </div>
    </section>
  )
}
