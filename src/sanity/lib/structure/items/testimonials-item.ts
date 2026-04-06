import { Star } from "lucide-react";
import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem} from '@sanity/orderable-document-list';

export const TestimonialsItem = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  orderableDocumentListDeskItem({
    S, 
    context, 
    icon: Star, 
    type: 'testimonial', 
    title: 'Testimonials', 
    id: 'orderable-testimonials'
  })
)