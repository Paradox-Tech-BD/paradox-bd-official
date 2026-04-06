import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type HeaderBlockProps = PageBuilderType<"headerBlock">;

export default function HeaderBlock(props: HeaderBlockProps) {

  const { heading, content, bottomCornerRadius, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('relative overflow-hidden', {
        'rounded-b-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      <div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none' />
      <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='pt-36 md:pt-48 pb-20 md:pb-32'>
          <span className='section-label mb-6 block'>Overview</span>
          <Heading tag="h1" size="xxl" className='text-balance text-white'>
            {heading}
          </Heading>
          <PortableTextEditor 
            data={content ?? []}
            classNames='mt-6 md:mt-8 md:text-lg text-balance text-white/50 leading-relaxed max-w-2xl'
          />
        </div>
      </div>
    </section>
  )
}
