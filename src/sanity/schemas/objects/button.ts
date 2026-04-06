import { defineType } from "sanity";
import { RectangleHorizontal } from "lucide-react";
import { buttonFields } from "../misc/button-fields";

export default defineType({
  name: 'buttonObject',
  title: 'Button',
  type: 'object',
  fields: [ ...buttonFields ],
  preview: {
    select: {
      title: 'buttonText',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ?? 'No title set. Add one inside this block',
        subtitle: 'Button',
        media: RectangleHorizontal,
      }
    },
  },
})