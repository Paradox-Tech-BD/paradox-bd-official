"use client"
import { PageBuilderType } from '@/types';
import Form from '@/components/shared/form';
import Heading from '@/components/shared/heading';
import Container from '@/components/global/container';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type FormBlockProps = PageBuilderType<"formBlock">;

export default function FormBlock(props: FormBlockProps) {

  const { heading, content, form, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className='px-4 xl:px-10 pattern-bg'
    >
      <Container className='py-16 md:py-28 border-x border-gray-200/60 border-dashed'>
        <div className='flex flex-col justify-center items-center gap-4 md:gap-6'>
          {heading && (
            <div className='text-center'>
              <div className='mono-label mb-4 text-center'>Contact</div>
              <Heading tag="h2" size="xl" className='text-balance text-center leading-normal text-gray-900'>
                {heading}
              </Heading>
            </div>
          )}
          {content && (
            <PortableTextEditor 
              data={content}
              classNames='max-w-[320px] mb-4 md:text-xl text-balance text-center text-gray-500'
            />
          )}
          {form && (
            <Form form={form} />
          )}
        </div>
      </Container>
    </section>
  )
}
