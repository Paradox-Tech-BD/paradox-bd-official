import { cn } from '@/lib/utils';
import { PageBuilderType } from '@/types';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type HeaderBlockProps = PageBuilderType<"headerBlock">;

export default function HeaderBlock(props: HeaderBlockProps) {

  const { heading, content, bottomCornerRadius, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('px-4 md:px-10 pattern-bg border-b border-gray-200/60', {
        'rounded-4xl': bottomCornerRadius === 'rounded'
      })}
    >
      <Container className='border-x border-gray-200/60 border-dashed'>
        <div className='pt-36 md:pt-52 pb-20 md:pb-36'>
          <div className='mono-label mb-4'>Overview</div>
          <Heading tag="h1" size="xxl" className='text-balance leading-normal text-gray-900'>
            {heading}
          </Heading>
          <PortableTextEditor 
            data={content ?? []}
            classNames='mt-6 md:mt-8 md:text-xl text-balance text-gray-500'
          />
        </div>
      </Container>
    </section>
  )
}
