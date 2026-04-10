import { defineField, defineType } from "sanity";
import { fieldsets } from "../../misc/fieldsets";
import { fieldGroups } from "../../misc/field-groups";

export default defineType({
  name: 'coursesPage',
  title: 'Courses Page',
  type: 'document',
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Courses'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading on the courses landing page.'
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      description: 'Subtitle text below the hero heading.'
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Section Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'featuredHeading',
      title: 'Featured Courses Heading',
      type: 'string',
      initialValue: 'Featured Courses'
    }),
    defineField({
      name: 'instructorsHeading',
      title: 'Instructors Section Heading',
      type: 'string',
      initialValue: 'Meet Our Instructors'
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Section Heading',
      type: 'string',
      initialValue: 'What Our Students Say'
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Additional Page Builder Blocks',
      type: 'pageBuilder',
      description: 'Extra blocks displayed below the main courses sections.'
    }),
    defineField({
      name: "seo",
      title: 'SEO',
      type: "seoObject",
    }),
  ]
})
