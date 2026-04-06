import { Heading1 } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: 'headingObject',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({
      name: 'headingText',
      type: 'string',
      title: 'Heading',
    }),
    defineField({
      name: "headingTag",
      type: "string",
      title: "Tag",
      options: {
        list: [
          { title: "H2", value: "h2" },
          { title: "H3", value: "h3" },
          { title: "H4", value: "h4" },
          { title: "H5", value: "h5" },
          { title: "H6", value: "h6" },
        ],
      },
      initialValue: 'h2',
    }),
    defineField({
      name: "headingSize",
      type: "string",
      title: "Size",
      options: {
        list: [
          { title: "XXXL", value: "xxxl" },
          { title: "XXL", value: "xxl" },
          { title: "XL", value: "xl" },
          { title: "LG", value: "lg" },
          { title: "MD", value: "md" },
          { title: "SM", value: "sm" },
          { title: "XS", value: "xs" },
        ],
      },
      initialValue: 'xl',
    }),
  ],
  preview: {
    select: {
      title: 'headingText',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ?? 'No title set. Add one inside this block',
        subtitle: 'Heading',
        media: Heading1,
      }
    },
  },
})