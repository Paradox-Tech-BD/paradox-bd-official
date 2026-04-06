import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type CallToActionBlockProps = PageBuilderType<"callToActionBlock">;

export default function CallToActionBlock(props: CallToActionBlockProps) {

  const { heading, content, buttons, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className='relative py-24 lg:py-32 overflow-hidden'
    >
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.03] blur-[100px] pointer-events-none' />
      <div className='relative max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-x-16'>
          <div>
            <span className='section-label mb-6 block'>Next Steps</span>
            <Heading tag="h2" size="xl" className='max-w-[40rem] text-balance text-white'>
              {heading}
            </Heading>
            <PortableTextEditor 
              data={content ?? []}
              classNames='mt-6 md:mt-8 text-balance text-white/50 leading-relaxed'
            />
          </div>
          {buttons && buttons.length > 0 && (
            <div className='mt-10 lg:mt-0 shrink-0'>
              <ButtonRenderer buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
