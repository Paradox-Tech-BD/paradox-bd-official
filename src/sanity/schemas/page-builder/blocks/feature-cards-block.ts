import { Shapes } from "lucide-react";
import { defineField, defineType } from "sanity";
import { fieldsets } from "../../misc/fieldsets";
import { fieldGroups } from "../../misc/field-groups";
import { buttonFields } from "../../misc/button-fields";

export default defineType({
  name: 'featureCardsBlock',
  title: 'Feature Cards',
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
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{ type: 'buttonObject' }],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
            }),
            defineField({
              name: 'button',
              title: 'Button',
              type: 'object',
              fields: buttonFields
            })
          ],
        },
      ],
    }),
    defineField({
      name: 'showCallToAction',
      title: 'Show Call To Action',
      type: 'boolean',
    }),
    defineField({
      name: 'callToActionHeading',
      title: 'CTA Heading',
      type: 'string',
    }),
    defineField({
      name: 'callToActionContent',
      title: 'CTA Content',
      type: 'array',
      of: [
        { 
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
    }),
    defineField({
      name: 'callToActionButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [{ type: 'buttonObject' }],
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
        subtitle: 'Feature Cards',
        media: Shapes,
      }
    },
  },
})