import { GraduationCap } from "lucide-react";
import { fieldsets } from "../misc/fieldsets";
import { defineField, defineType } from "sanity";
import { fieldGroups } from "../misc/field-groups";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: 'instructor',
  title: 'Instructors',
  type: 'document',
  icon: GraduationCap,
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Job Title / Role',
      type: 'string',
      description: 'e.g. Senior ML Engineer, Course Lead'
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 6,
      validation: rule => rule.required()
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'altText',
          title: 'Alt Text',
          type: 'string'
        })
      ],
      validation: rule => rule.required()
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Instructor',
      type: 'boolean',
      initialValue: false,
      description: 'Show this instructor on the courses landing page.'
    }),
    defineField({
      name: "seo",
      title: 'SEO',
      type: "seoObject",
    }),
    orderRankField({ 
      type: 'instructor' 
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'photo'
    }
  }
})
