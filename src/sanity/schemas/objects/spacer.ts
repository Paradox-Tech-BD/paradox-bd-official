import { defineField, defineType } from "sanity";
import { BetweenHorizonalEnd } from "lucide-react";
import { SpacingInput, spacingOptions } from "@/sanity/components/spacing-input";

export default defineType({
  name: 'spacerObject',
  title: 'Spacer',
  type: 'object',
  fields: [
    defineField({
      title: "Spacing",
      name: "spacing",
      type: "string",
      options: {
        list: spacingOptions.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      components: { input: SpacingInput },
      initialValue: 'small',
    }),
  ],
  preview: {
    select: {
      title: 'spacing',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: (title ?? 'No title set. Add one inside this block').charAt(0).toUpperCase() + 
              (title ?? 'No title set. Add one inside this block').slice(1),
        subtitle: 'Spacer',
        media: BetweenHorizonalEnd,
      }
    },
  },
})