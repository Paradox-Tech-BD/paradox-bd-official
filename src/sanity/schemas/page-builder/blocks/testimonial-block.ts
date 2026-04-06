import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";
import { fieldsets } from "../../misc/fieldsets";
import { fieldGroups } from "../../misc/field-groups";

export default defineType({
  name: 'testimonialBlock',
  title: 'Testimonials',
  type: 'object',
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Select testimonials to display.'
    }),
    defineField({
      name: "cornerRadiusTop",
      title: "Corner Radius Top",
      type: "string",
      options: {
        list: [
          { title: "Rounded", value: "rounded" },
          { title: "Straight", value: "straight" },
        ],
      },
      initialValue: 'straight',
    }),
    defineField({
      name: "cornerRadiusBottom",
      title: "Corner Radius Bottom",
      type: "string",
      options: {
        list: [
          { title: "Rounded", value: "rounded" },
          { title: "Straight", value: "straight" },
        ],
      },
      initialValue: 'straight',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: '',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ?? 'No title set. Add one inside this block',
        subtitle: 'Testimonial',
        media: Star,
      }
    },
  },
})