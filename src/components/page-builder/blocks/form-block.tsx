"use client"
import { PageBuilderType } from '@/types';
import Form from '@/components/shared/form';
import Heading from '@/components/shared/heading';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type FormBlockProps = PageBuilderType<"formBlock">;

export default function FormBlock(props: FormBlockProps) {

  const { heading, content, form, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className='py-24 lg:py-32'
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='flex flex-col justify-center items-center gap-6'>
          {heading && (
            <div className='text-center'>
              <span className='section-label mb-6 block justify-center'>Contact</span>
              <Heading tag="h2" size="xl" className='text-balance text-center text-white'>
                {heading}
              </Heading>
            </div>
          )}
          {content && (
            <PortableTextEditor 
              data={content}
              classNames='max-w-[320px] mb-4 md:text-xl text-balance text-center text-white/50'
            />
          )}
          {form && (
            <Form form={form} />
          )}
        </div>
      </div>
    </section>
  )
}
