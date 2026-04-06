import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import { Button } from '@/components/ui/button';
import Heading from '@/components/shared/heading';
import { ButtonType, PageBuilderType } from '@/types';
import PortableTextEditor from '@/components/portable-text/portable-text-editor';

export type FreeformBlockProps = PageBuilderType<"freeformBlock">;

export default function FreeformBlock(props: FreeformBlockProps) {

  const { columnsPerRow, columns, border, anchorId } = props;

  return (
    <section 
      {...(anchorId ? { id: anchorId } : {})} 
      className={cn('py-16 md:py-24', {
        'border-t border-white/[0.06]': stegaClean(border) === 'topBottom' || stegaClean(border) === 'top',
        'border-b border-white/[0.06]': stegaClean(border) === 'topBottom' || stegaClean(border) === 'bottom',
      })}
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div 
          className={cn('grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8', {
            'md:grid-cols-3': stegaClean(columnsPerRow) === '3',
            'md:grid-cols-4': stegaClean(columnsPerRow) === '4',
          })}
        >
          {columns?.map((column) => (
            <div 
              key={column?._key} 
              className={cn('flex flex-col items-start justify-center gap-0', {
                'gap-2': stegaClean(column?.spacing) === 'small',
                'gap-3': stegaClean(column?.spacing) === 'medium',
                'gap-4': stegaClean(column?.spacing) === 'large',
                'items-center': stegaClean(column?.alignment) === 'center',
                'items-end': stegaClean(column?.alignment) === 'right',
              })}
            >
              {column?.items?.map((item) => (
                <React.Fragment key={item?._key}>
                  {(item?._type === 'headingObject' && item?.headingText) && (
                    <Heading tag={item?.headingTag} size={item?.headingSize}>
                      {item?.headingText}
                    </Heading>
                  )}
                  {(item?._type === 'spacerObject' && item?.spacing) && (
                    <div 
                      key={item?._key}
                      className={cn('h-0', {
                        'h-4': stegaClean(item?.spacing) === 'small',
                        'h-6': stegaClean(item?.spacing) === 'medium',
                        'h-8': stegaClean(item?.spacing) === 'large',
                      })}
                    />
                  )}
                  {(item?._type === 'richTextObject' && item?.richTextContent) && (
                    <PortableTextEditor 
                      data={item?.richTextContent} 
                      classNames='text-balance text-white/60'
                    />
                  )}
                  {(item?._type === 'singleImageObject' && item?.image?.asset?.url) && (
                    <div className='overflow-hidden rounded-xl border border-white/[0.08]'>
                      <Image
                        src={item?.image?.asset?.url ?? ''}
                        width={800}
                        height={800}
                        alt={item?.image?.asset?.altText ?? ''}
                        className={cn('object-cover aspect-square', {
                          'aspect-[3/2]': stegaClean(item?.image?.aspectRatio) === 'rectangle',
                          'aspect-[3/4]': stegaClean(item?.image?.aspectRatio) === 'portrait',
                        })}
                      />
                    </div>
                  )}
                  {(item?._type === 'buttonObject' && item?.buttonText) && (
                    <Button 
                      size="sm"
                      variant={stegaClean(item?.buttonVariant)}
                      buttonType={item?.buttonType}
                      pageReference={item?.buttonPageReference as ButtonType['buttonPageReference']}
                      externalUrl={item?.buttonExternalUrl ?? ''}
                    >
                      {item?.buttonText}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
