import { List } from "lucide-react";
import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: 'courseSection',
  title: 'Course Sections',
  type: 'document',
  icon: List,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: rule => rule.required()
    }),
    defineField({
      name: 'lectures',
      title: 'Lectures',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'courseLecture' }] }],
    }),
    orderRankField({
      type: 'courseSection'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      courseTitle: 'course.title',
    },
    prepare({ title, courseTitle }) {
      return {
        title,
        subtitle: courseTitle ? `Course: ${courseTitle}` : ''
      }
    }
  }
})
