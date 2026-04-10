import { PlayCircle } from "lucide-react";
import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: 'courseLecture',
  title: 'Course Lectures',
  type: 'document',
  icon: PlayCircle,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Lecture Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
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
    defineField({
      name: 'videoFileName',
      title: 'Video File Name',
      type: 'string',
      description: 'File name/path within the course R2 bucket (e.g. section-1/intro.mp4).'
    }),
    defineField({
      name: 'content',
      title: 'Lecture Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Content for reading-type lectures or supplementary notes.'
    }),
    orderRankField({
      type: 'courseLecture'
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
