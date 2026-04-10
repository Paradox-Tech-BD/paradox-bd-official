import { MessageSquareQuote } from "lucide-react";
import { fieldsets } from "../misc/fieldsets";
import { defineField, defineType } from "sanity";
import { fieldGroups } from "../misc/field-groups";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: 'courseTestimonial',
  title: 'Course Testimonials',
  type: 'document',
  icon: MessageSquareQuote,
  fieldsets: [ ...fieldsets ],
  groups: [ ...fieldGroups ],
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Student Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: rule => rule.required().min(1).max(5),
      initialValue: 5
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial',
      type: 'text',
      rows: 4,
      validation: rule => rule.required()
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
    }),
    orderRankField({ 
      type: 'courseTestimonial' 
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'quote',
      media: 'avatar'
    }
  }
})
