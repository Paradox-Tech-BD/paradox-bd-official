import { defineQuery } from "next-sanity";
import { pageBuilder } from "../fragments/page-builder";

const courseCardFields = `
  _id,
  _type,
  title,
  'slug': slug.current,
  excerpt,
  level,
  duration,
  price,
  originalPrice,
  rating,
  enrolledCount,
  featured,
  published,
  thumbnail {
    asset->{ url },
    altText
  },
  category->{
    _id,
    title,
    'slug': slug.current,
  },
  instructors[]->{
    _id,
    name,
    'slug': slug.current,
    title,
    photo {
      asset->{ url },
      altText
    }
  }
`;

export const courseSlugsQuery = defineQuery(`*[_type == "course" && defined(slug.current) && published == true] {
  'params': { 'slug': slug.current }
}`);

export const coursesPageQuery = defineQuery(`*[_type == 'coursesPage'][0] {
  _id,
  _type,
  title,
  'slug': slug.current,
  heroHeading,
  heroSubheading,
  aboutHeading,
  aboutContent,
  featuredHeading,
  instructorsHeading,
  testimonialsHeading,
  ${pageBuilder},
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, ""),
    "noIndex": seo.noIndex == true,
    "image": seo.image,
  },
}`);

export const allCoursesQuery = defineQuery(`*[_type == 'course' && published == true] | order(_createdAt desc) {
  ${courseCardFields}
}`);

export const featuredCoursesQuery = defineQuery(`*[_type == 'course' && published == true && featured == true] | order(_createdAt desc) {
  ${courseCardFields}
}`);

export const courseBySlugQuery = defineQuery(`*[_type == 'course' && slug.current == $slug && published == true][0] {
  _id,
  _type,
  title,
  'slug': slug.current,
  excerpt,
  description,
  level,
  duration,
  price,
  originalPrice,
  rating,
  enrolledCount,
  previewVideoUrl,
  whatYoullLearn,
  prerequisites,
  paymentInstructions,
  thumbnail {
    asset->{ url },
    altText
  },
  category->{
    _id,
    title,
    'slug': slug.current,
  },
  instructors[]->{
    _id,
    name,
    'slug': slug.current,
    title,
    bio,
    expertise,
    photo {
      asset->{ url },
      altText
    },
    socialLinks
  },
  curriculum[] {
    _key,
    title,
    lectures[] {
      _key,
      title,
      type,
      duration,
      isFree
    }
  },
  "sections": sections[]->{
    _id,
    title,
    "lectures": lectures[]->{
      _id,
      title,
      'slug': slug.current,
      type,
      duration,
      isFree
    }
  },
  testimonials[]->{
    _id,
    name,
    rating,
    quote,
    completionDate,
    avatar {
      asset->{ url }
    }
  },
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, excerpt, ""),
    "noIndex": seo.noIndex == true,
    "image": seo.image,
  },
}`);

export const courseCategoriesQuery = defineQuery(`*[_type == 'courseCategory'] | order(orderRank asc) {
  _id,
  _type,
  title,
  'slug': slug.current,
  description,
  "courseCount": count(*[_type == 'course' && published == true && category._ref == ^._id])
}`);

export const coursesByCategoryQuery = defineQuery(`*[_type == 'course' && published == true && category->slug.current == $slug] | order(_createdAt desc) {
  ${courseCardFields}
}`);

export const allInstructorsQuery = defineQuery(`*[_type == 'instructor'] | order(orderRank asc) {
  _id,
  _type,
  name,
  'slug': slug.current,
  title,
  bio,
  expertise,
  featured,
  photo {
    asset->{ url },
    altText
  },
  socialLinks,
  "courseCount": count(*[_type == 'course' && published == true && references(^._id)]),
  "avgRating": math::avg(*[_type == 'course' && published == true && references(^._id)].rating),
  "totalStudents": math::sum(*[_type == 'course' && published == true && references(^._id)].enrolledCount)
}`);

export const recentCourseTestimonialsQuery = defineQuery(`*[_type == 'courseTestimonial'] | order(completionDate desc) [0...8] {
  _id,
  name,
  rating,
  quote,
  completionDate,
  avatar {
    asset->{ url }
  },
  "courseName": course->title
}`);

export const instructorBySlugQuery = defineQuery(`*[_type == 'instructor' && slug.current == $slug][0] {
  _id,
  _type,
  name,
  'slug': slug.current,
  title,
  bio,
  expertise,
  photo {
    asset->{ url },
    altText
  },
  socialLinks,
  "courseCount": count(*[_type == 'course' && published == true && references(^._id)]),
  "avgRating": math::avg(*[_type == 'course' && published == true && references(^._id)].rating),
  "totalStudents": math::sum(*[_type == 'course' && published == true && references(^._id)].enrolledCount),
  "courses": *[_type == 'course' && published == true && references(^._id)] | order(_createdAt desc) {
    ${courseCardFields}
  },
  "seo": {
    "title": coalesce(seo.title, name, ""),
    "description": coalesce(seo.description, bio, ""),
    "noIndex": seo.noIndex == true,
    "image": seo.image,
  },
}`);

export const instructorSlugsQuery = defineQuery(`*[_type == "instructor" && defined(slug.current)] {
  'params': { 'slug': slug.current }
}`);
