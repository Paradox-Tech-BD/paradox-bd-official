import { LetterText } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: 'richTextObject',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'richTextContent',
      type: 'array',
      title: 'Content',
      of: [
        { 
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Content',
        subtitle: 'Rich Text',
        media: LetterText,
      }
    },
  },
})