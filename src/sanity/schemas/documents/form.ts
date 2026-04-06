import { File } from "lucide-react";
import { fieldsets } from "../misc/fieldsets";
import { defineField, defineType } from "sanity";
import { fieldGroups } from "../misc/field-groups";

export default defineType({
  name: 'form',
  title: 'Form',
  type: 'document',
  icon: File,
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name/Label',
              type: 'string',
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
            }),
            defineField({
              name: "inputType",
              title: "Input Type",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Text Area", value: "textarea" },
                  { title: "Email", value: "email" },
                  { title: "Telephone", value: "tel" },
                ],
              },
              initialValue: 'text',
            }),
            defineField({
              name: 'isRequired',
              title: 'Required',
              type: 'boolean',
              initialValue: false
            }),
          ],
        },
      ],
    }),
    
  ]
})