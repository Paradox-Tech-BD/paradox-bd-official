import { defineField } from "sanity";

export const paddingFields = [
  defineField({
    title: "Top",
    name: "paddingTop",
    type: "string",
    fieldset: 'padding',
    group: 'layout',
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Default", value: "default" },
        { title: "Large", value: "large" },
      ],
    },
    initialValue: 'default'
  }),
  defineField({
    title: "Bottom",
    name: "paddingBottom",
    type: "string",
    fieldset: 'padding',
    group: 'layout',
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Small", value: "small" },
        { title: "Medium", value: "medium" },
        { title: "Default", value: "default" },
        { title: "Large", value: "large" },
      ],
    },
    initialValue: 'default'
  }),   
]