import { GripHorizontal } from "lucide-react";
import { defineField, defineType } from "sanity";
import { fieldsets } from "../../misc/fieldsets";
import { fieldGroups } from "../../misc/field-groups";

export default defineType({
  name: 'logoBlock',
  title: 'Logos',
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
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title',
          },
          {
            name: 'image',
            type: 'image',
            title: 'Logo',
          },
          defineField({
            name: "size",
            title: "Size",
            type: "string",
            options: {
              list: [
                { title: "Default", value: "default" },
                { title: "Large", value: "large" },
              ],
            },
            initialValue: 'default',
          }),
          {
            name: 'link',
            type: 'url',
            title: 'External Link',
            description: 'Optional'
          }
        ]
      }]
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
        subtitle: 'Logos',
        media: GripHorizontal,
      }
    },
  },
})