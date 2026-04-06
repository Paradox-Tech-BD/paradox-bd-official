import { Link } from "lucide-react";
import { StructureBuilder } from "sanity/structure";

export const RedirectsItem = (
  S: StructureBuilder, 
) => (
  S.listItem()
    .title('Redirects')
    .icon(Link)
    .child(
      S.documentList()
      .title('All Redirects')
      .filter('_type == "redirect"')
    ) 
)