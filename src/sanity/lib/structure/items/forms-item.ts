import { Send } from "lucide-react";
import { StructureBuilder } from "sanity/structure";

export const FormsItem = (
  S: StructureBuilder, 
) => (
  S.listItem()
    .title('Forms')
    .icon(Send)
    .child(
      S.documentList()
      .title('All Forms')
      .filter('_type == "form"')
    ) 
)