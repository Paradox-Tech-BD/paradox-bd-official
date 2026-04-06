import { fieldsets } from "../misc/fieldsets";
import { fieldGroups } from "../misc/field-groups";
import { pageReferenceTypes } from "../misc/page-reference-types";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: 'navigationSettings',
  title: 'Navigation Settings',
  type: 'document',
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'navbarMenuItems',
      title: 'Menu Items',
      type: 'array',
      group: 'navbar',
      fieldset: 'navbar',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              title: "Menu Item Type",
              name: "menuItemType",
              type: "string",
              options: {
                list: [
                  { title: "Single", value: "single" },
                  { title: "Group", value: "group" },
                ],
              },
              initialValue: 'single',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'The title of the menu item.'
            }),
            defineField({
              name: 'pageReference',
              title: 'Page',
              description: 'The page that the menu item will link to.',
              type: 'reference',
              to: [ ...pageReferenceTypes ],
              hidden: ({ parent }) => parent?.menuItemType !== 'single'
            }),
            defineField({
              title: "Page References",
              name: "pageReferences",
              type: "array",
              of: [{ 
                type: 'reference', 
                to: [ ...pageReferenceTypes ]
              }],
              hidden: ({ parent }) => parent?.menuItemType !== 'group'
            }),
            defineField({
              name: 'isButton',
              title: 'Show as Button',
              type: 'boolean',
              description: 'If checked, the menu item will be shown as a button instead of a link.',
              initialValue: false,
              hidden: ({ parent }) => parent?.menuItemType !== 'single'
            })
          ]
        }),
      ],
    }),
    defineField({
      name: 'showSlideOutMenu',
      title: 'Show Slide-Out Menu',
      type: 'boolean',
      group: 'slideOutMenu',
      fieldset: 'slideOutMenu',
      initialValue: false
    }),
    defineField({
      name: 'slideOutMenuItems',
      title: 'Menu Items',
      type: 'array',
      group: 'slideOutMenu',
      fieldset: 'slideOutMenu',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              title: "Menu Item Type",
              name: "menuItemType",
              type: "string",
              options: {
                list: [
                  { title: "Single", value: "single" },
                  { title: "Group", value: "group" },
                ],
              },
              initialValue: 'single',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'The title of the menu item.'
            }),
            defineField({
              name: 'pageReference',
              title: 'Page',
              description: 'The page that the menu item will link to.',
              type: 'reference',
              to: [ ...pageReferenceTypes ],
              hidden: ({ parent }) => parent?.menuItemType !== 'single'
            }),
            defineField({
              title: "Page References",
              name: "pageReferences",
              type: "array",
              of: [{ 
                type: 'reference', 
                to: [ ...pageReferenceTypes ]
              }],
              hidden: ({ parent }) => parent?.menuItemType !== 'group'
            }),
            defineField({
              name: 'isButton',
              title: 'Show as Button',
              type: 'boolean',
              description: 'If checked, the menu item will be shown as a button instead of a link.',
              initialValue: false
            })
          ]
        }),
      ],
      hidden: ({ parent }) => !parent.showSlideOutMenu
    }),
    defineField({
      name: 'slideOutMenuButtons',
      title: 'Buttons',
      type: 'array',
      group: 'slideOutMenu',
      fieldset: 'slideOutMenu',
      of: [{ type: 'buttonObject' }],
      description: 'Display buttons in the footer of the slide-out menu.'
    }),
    defineField({
      name: 'showCompanyDetailsSlideOutMenu',
      title: 'Show Company Details',
      type: 'boolean',
      group: 'slideOutMenu',
      fieldset: 'slideOutMenu',
      description: 'When enabled, company details (email, phone & socials) added in general settings will be displayed in the slide-out menu below the menu items.',
      initialValue: false
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      group: 'footer',
      fieldset: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Column Title',
              type: 'string',
            }),
            defineField({
              name: 'menuItems',
              title: 'Menu Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      description: 'The title of the menu item.'
                    }),
                    defineField({
                      title: "Link Type",
                      name: "linkType",
                      type: "string",
                      options: {
                        list: [
                          { title: "Internal", value: "internal" },
                          { title: "External URL", value: "external" },
                        ],
                      },
                      initialValue: 'internal',
                    }),
                    defineField({
                      name: 'pageReference',
                      title: 'Page',
                      description: 'The page that the menu item will link to.',
                      type: 'reference',
                      to: [ ...pageReferenceTypes ],
                      hidden: ({ parent }) => parent?.linkType !== 'internal',
                    }),
                    defineField({
                      name: 'externalUrl',
                      title: 'External URL',
                      description: 'The external URL that the menu item will link to.',
                      type: 'url',
                      validation: Rule => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                      hidden: ({ parent }) => parent?.linkType !== 'external',
                    }),
                  ]
                }
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'footerLegalMenuItems',
      title: 'Legal Menu Items',
      type: 'array',
      group: 'footer',
      fieldset: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'The title of the menu item.'
            }),
            defineField({
              name: 'pageReference',
              title: 'Page',
              description: 'The page that the menu item will link to.',
              type: 'reference',
              to: [ ...pageReferenceTypes ]
            }),
          ]
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Navigation',
      }
    },
  },
})
