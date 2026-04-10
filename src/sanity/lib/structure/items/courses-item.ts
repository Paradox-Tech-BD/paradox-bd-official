import { BookOpen, GraduationCap, Tag, MessageSquareQuote } from "lucide-react";
import { StructureBuilder, StructureResolverContext } from "sanity/structure";
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const CoursesItem = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  S.listItem()
    .title('Courses')
    .icon(BookOpen)
    .child(
      S.list()
        .title('Courses')
        .items([
          AllCourses(S),
          CourseCategories(S, context),
          Instructors(S, context),
          CourseTestimonials(S, context),
        ])
    )
)

export const AllCourses = (
  S: StructureBuilder, 
) => (
  S.listItem()
    .title('All Courses')
    .icon(BookOpen)
    .child(
      S.documentList()
      .title('All Courses')
      .filter('_type == "course"')
    ) 
)

export const CourseCategories = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  orderableDocumentListDeskItem({
    S, 
    context, 
    icon: Tag, 
    type: 'courseCategory', 
    title: 'Categories', 
    id: 'orderable-course-categories'
  })
)

export const Instructors = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  orderableDocumentListDeskItem({
    S, 
    context, 
    icon: GraduationCap, 
    type: 'instructor', 
    title: 'Instructors', 
    id: 'orderable-instructors'
  })
)

export const CourseTestimonials = (
  S: StructureBuilder, 
  context: StructureResolverContext
) => (
  orderableDocumentListDeskItem({
    S, 
    context, 
    icon: MessageSquareQuote, 
    type: 'courseTestimonial', 
    title: 'Testimonials', 
    id: 'orderable-course-testimonials'
  })
)
