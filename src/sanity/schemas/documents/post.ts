import { FiFile } from "react-icons/fi";
import { fieldsets } from "../misc/fieldsets";
import { defineField, defineType } from "sanity";
import { fieldGroups } from "../misc/field-groups";

export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  icon: FiFile,
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'postCategory' },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4  
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'callToActionObject' },
        { type: 'singleImageObject' },
        { type: 'videoObject' }
      ],
    }),
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
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
      ],
    }),
    defineField({
      title: "Related Posts",
      name: "relatedPostsType",
      type: "string",
      description: "Defaults to posts of the same category.",
      options: {
        list: [
          { title: "Autofill", value: "autofill" },
          { title: "Custom", value: "custom" },
        ],
      },
      initialValue: 'autofill',
    }),
    defineField({
      title: "Choose Related Posts",
      name: "customRelatedPosts",
      type: "array",
      of: [{ 
        type: 'reference', 
        to: [{ type: 'post' }] 
      }],
      validation: rule => rule.max(3),
      hidden: ({ parent }) => parent?.relatedPosts !== 'custom'
    }),
    defineField({
      name: "seo",
      title: 'SEO',
      type: "seoObject",
    }),
  ]
})