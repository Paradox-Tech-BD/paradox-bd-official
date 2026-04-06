import { Folder } from "lucide-react";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { StructureBuilder, StructureResolverContext } from "sanity/structure";

export const ServicesItem = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  orderableDocumentListDeskItem({
    S, 
    context, 
    icon: Folder, 
    type: 'service', 
    title: 'Services', 
    id: 'orderable-services'
  })
)