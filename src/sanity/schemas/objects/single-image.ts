import { Image } from "lucide-react";
import { defineField, defineType } from "sanity";
import { RatioInput, ratioOptions } from "@/sanity/components/ratio-input";

export default defineType({
  name: 'singleImageObject',
  title: 'Single Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fields: [
        defineField({
          name: 'altText',
          title: 'Alternative Text',
          type: 'string'
        }),
        defineField({
          title: "Aspect Ratio",
          name: "aspectRatio",
          type: "string",
          options: {
            list: ratioOptions.map(({ title, value }) => ({ title, value })),
            layout: 'radio',
          },
          components: { input: RatioInput },
          initialValue: 'square',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'image',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title.altText ?? 'No title set. Add one inside this block',
        subtitle: 'Image',
        media: Image,
      }
    },
  },
})