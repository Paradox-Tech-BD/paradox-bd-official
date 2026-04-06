import { type SanityDocument } from 'sanity';
import { Iframe } from 'sanity-plugin-iframe-pane';
import { type DefaultDocumentNodeResolver } from 'sanity/structure';

function getPreviewUrl(doc: SanityDocument & { slug?: { current: string } }) {
  if (!doc?.slug?.current) { return `${process.env.NEXT_PUBLIC_SITE_URL}` }
  
  switch (doc._type) {
    case 'post':
      return `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${doc.slug.current}`
    case 'project':
      return `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${doc.slug.current}`
    case 'service':
      return `${process.env.NEXT_PUBLIC_SITE_URL}/services/${doc.slug.current}`
    default:
      return `${process.env.NEXT_PUBLIC_SITE_URL}/${doc.slug.current}`
  }
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'page':
    case 'post':
    case 'project':
    case 'service':
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: {
              origin: 'same-origin',
              preview: (doc: SanityDocument) => getPreviewUrl(doc),
              draftMode: '/api/draft-mode/enable'
            },
            reload: {
              button: true, 
            },
            defaultWidth: 'desktop',
            draftMode: {
              enable: '/api/draft-mode/enable'
            }
          })
          .title('Preview'),          
      ])
    default:
      return S.document().views([ S.view.form() ])
  }
}