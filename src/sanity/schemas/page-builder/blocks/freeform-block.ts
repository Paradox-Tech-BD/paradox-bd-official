import { Shapes } from "lucide-react";
import { defineField, defineType } from "sanity";
import { fieldsets } from "../../misc/fieldsets";
import { fieldGroups } from "../../misc/field-groups";
import { SpacingInput, spacingOptions } from "@/sanity/components/spacing-input";
import { AlignmentInput, alignmentOptions } from "@/sanity/components/alignment-input";

export default defineType({
  name: 'freeformBlock',
  title: 'Freeform',
  type: 'object',
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      title: "Columns Per Row",
      name: "columnsPerRow",
      type: "string",
      options: {
        list: [
          { title: "2", value: "2" },
          { title: "3", value: "3" },
          { title: "4", value: "4" },
        ],
      },
      initialValue: '2',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'title',
            type: 'string',
            title: 'Column Title',
            description: 'For internal purposes.'
          }),
          defineField({
            title: "Spacing Between Items",
            name: "spacing",
            type: "string",
            description: 'Add some default spacing between items (optional).',
            options: {
              list: spacingOptions.map(({ title, value }) => ({ title, value })),
              layout: 'radio',
            },
            components: { input: SpacingInput },
            initialValue: 'small',
          }),
          defineField({
            title: "Alignment",
            name: "alignment",
            type: "string",
            options: {
              list: alignmentOptions.map(({ title, value }) => ({ title, value })),
              layout: 'radio',
            },
            components: { input: AlignmentInput },
            initialValue: 'left',
          }),
          defineField({
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [
              defineField({ 
                name: 'spacerObject', 
                type: 'spacerObject', 
                title: 'Spacer', 
              }),
              defineField({ 
                name: 'headingObject', 
                type: 'headingObject', 
                title: 'Heading', 
              }),
              defineField({ 
                name: 'richTextObject', 
                type: 'richTextObject', 
                title: 'Rich Text', 
              }),
              defineField({ 
                name: 'buttonObject', 
                type: 'buttonObject', 
                title: 'Button', 
              }),
              defineField({ 
                name: 'singleImageObject', 
                type: 'singleImageObject', 
                title: 'Image', 
              }),
            ]
          }),
        ],
      }]
    }),
    defineField({
      title: "Border",
      name: "border",
      type: "string",
      description: 'Display a border to seperate this block with blocks above and below.',
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Top & Bottom", value: "topBottom" },
          { title: "Top Only", value: "top" },
          { title: "Bottom Only", value: "bottom" },
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: '',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ?? 'No title set. Add one inside this block',
        subtitle: 'Freeform',
        media: Shapes,
      }
    },
  },
})