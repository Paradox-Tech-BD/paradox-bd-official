import { BookOpen } from "lucide-react";
import { fieldsets } from "../misc/fieldsets";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fieldGroups as baseFieldGroups } from "../misc/field-groups";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

const courseFieldGroups = [
  ...baseFieldGroups,
  { name: 'curriculum', title: 'Curriculum' },
  { name: 'pricing', title: 'Pricing' },
  { name: 'r2Storage', title: 'Video Storage (R2)' },
];

export default defineType({
  name: 'course',
  title: 'Courses',
  type: 'document',
  icon: BookOpen,
  fieldsets: [ ...fieldsets ],
  groups: courseFieldGroups,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      group: 'content',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: rule => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      group: 'content',
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
      name: 'previewVideoUrl',
      title: 'Preview Video URL',
      type: 'url',
      group: 'content',
      description: 'Optional YouTube or video URL for the course preview.'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'content',
      to: [{ type: 'courseCategory' }],
      validation: rule => rule.required()
    }),
    defineField({
      name: 'instructors',
      title: 'Instructors',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'instructor' }] }],
      validation: rule => rule.required().min(1)
    }),
    defineField({
      name: 'level',
      title: 'Difficulty Level',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio'
      },
      initialValue: 'beginner'
    }),
    defineField({
      name: 'duration',
      title: 'Estimated Duration',
      type: 'string',
      group: 'content',
      description: 'e.g. "12 hours", "8 weeks"'
    }),
    defineField({
      name: 'enrolledCount',
      title: 'Enrolled Students',
      type: 'number',
      group: 'content',
      initialValue: 0
    }),
    defineField({
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      group: 'content',
      validation: rule => rule.min(0).max(5),
      initialValue: 0
    }),
    defineField({
      name: 'whatYoullLearn',
      title: 'What You\'ll Learn',
      type: 'array',
      group: 'curriculum',
      of: [{ type: 'string' }],
      description: 'Key learning outcomes shown as bullet points.'
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      group: 'curriculum',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum Sections',
      type: 'array',
      group: 'curriculum',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'curriculumSection',
          title: 'Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: rule => rule.required()
            }),
            defineField({
              name: 'lectures',
              title: 'Lectures',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'lecture',
                  title: 'Lecture',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Lecture Title',
                      type: 'string',
                      validation: rule => rule.required()
                    }),
                    defineField({
                      name: 'type',
                      title: 'Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Video', value: 'video' },
                          { title: 'Quiz', value: 'quiz' },
                          { title: 'Reading', value: 'reading' },
                        ],
                      },
                      initialValue: 'video'
                    }),
                    defineField({
                      name: 'duration',
                      title: 'Duration (minutes)',
                      type: 'number',
                    }),
                    defineField({
                      name: 'isFree',
                      title: 'Free Preview',
                      type: 'boolean',
                      initialValue: false,
                      description: 'Allow non-enrolled users to preview this lecture.'
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      type: 'type',
                      duration: 'duration'
                    },
                    prepare({ title, type, duration }) {
                      return {
                        title,
                        subtitle: `${type ?? 'video'} ${duration ? `· ${duration} min` : ''}`
                      }
                    }
                  }
                })
              ]
            })
          ],
          preview: {
            select: {
              title: 'title',
              lectures: 'lectures'
            },
            prepare({ title, lectures }) {
              return {
                title,
                subtitle: `${lectures?.length ?? 0} lectures`
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      group: 'pricing',
      description: 'Course price in USD. Set to 0 for free courses.',
      validation: rule => rule.required().min(0),
      initialValue: 0
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (Strikethrough)',
      type: 'number',
      group: 'pricing',
      description: 'Optional original price to show as crossed out.'
    }),
    defineField({
      name: 'paymentInstructions',
      title: 'Payment Instructions',
      type: 'array',
      group: 'pricing',
      of: [{ type: 'block' }],
      description: 'Bank account details, payment methods, etc. Shown to students during enrollment.'
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Only published courses are visible on the public site.'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Course',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Show on the courses landing page featured section.'
    }),
    defineField({
      name: 'sections',
      title: 'Course Sections',
      type: 'array',
      group: 'curriculum',
      of: [{ type: 'reference', to: [{ type: 'courseSection' }] }],
      description: 'Reference course sections (each section contains lectures).'
    }),
    defineField({
      name: 'r2BucketName',
      title: 'R2 Bucket Name',
      type: 'string',
      group: 'r2Storage',
      readOnly: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      description: 'Admin only. Never exposed to frontend queries.'
    }),
    defineField({
      name: 'r2AccountId',
      title: 'R2 Account ID',
      type: 'string',
      group: 'r2Storage',
      readOnly: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      description: 'Admin only. Never exposed to frontend queries.'
    }),
    defineField({
      name: 'r2AccessKeyId',
      title: 'R2 Access Key ID',
      type: 'string',
      group: 'r2Storage',
      readOnly: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      description: 'Admin only. Sensitive credential — never exposed to frontend queries.'
    }),
    defineField({
      name: 'r2SecretAccessKey',
      title: 'R2 Secret Access Key',
      type: 'string',
      group: 'r2Storage',
      readOnly: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      description: 'Admin only. Sensitive credential — never exposed to frontend queries.'
    }),
    defineField({
      name: 'r2PublicUrl',
      title: 'R2 Public URL',
      type: 'url',
      group: 'r2Storage',
      readOnly: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator'),
      description: 'Admin only. Public base URL for the R2 bucket, e.g. https://pub-xxx.r2.dev'
    }),
    defineField({
      name: 'testimonials',
      title: 'Course Testimonials',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'courseTestimonial' }] }],
    }),
    defineField({
      name: "seo",
      title: 'SEO',
      type: "seoObject",
      group: 'seo',
    }),
    orderRankField({ 
      type: 'course' 
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'thumbnail'
    }
  }
})
