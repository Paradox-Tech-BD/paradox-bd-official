import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoObject",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      description: "If left blank, the page title will be used.",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "noIndex",
      type: "boolean",
      initialValue: false,
      description: "Enable this for pages you don't want appearing in search results.",
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      description: "If left blank, an OG image will be auto-generated.",
    }),
  ],
});