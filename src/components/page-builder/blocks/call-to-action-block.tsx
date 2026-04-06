import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import ButtonRenderer from '@/components/shared/button-renderer';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type CallToActionBlockProps = PageBuilderType<"callToActionBlock">;

export default function CallToActionBlock(props: CallToActionBlockProps) {

  const { heading, content, buttons, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})}
      className='xl:px-10 pattern-bg--2 border-t border-lab-border'
    >
      <Container className='py-16 md:py-28 border-x border-lab-border border-dashed'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-x-16'>
          <div>
            <div className='mono-label mb-4'>Next Steps</div>
            <Heading tag="h2" size="xl" className='max-w-[40rem] text-balance leading-tight text-slate-100'>
              {heading}
            </Heading>
            <PortableTextEditor 
              data={content ?? []}
              classNames='mt-6 md:mt-8 text-balance text-slate-400'
            />
          </div>
          {buttons && buttons.length > 0 && (
            <div className='mt-10'>
              <ButtonRenderer buttons={buttons} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
