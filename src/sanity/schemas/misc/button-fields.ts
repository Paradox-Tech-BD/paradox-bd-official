import { defineField } from "sanity";
import { pageReferenceTypes } from "./page-reference-types";

export const buttonFields = [
  defineField({
    name: 'showButton',
    title: 'Show Button',
    type: 'boolean',
    initialValue: false
  }),
  defineField({
    name: 'buttonText',
    title: 'Button Text',
    type: 'string',
    hidden: ({parent}) => !parent?.showButton,
  }),
  defineField({
    title: "Button Type",
    name: "buttonType",
    type: "string",
    options: {
      list: [
        { title: "Internal", value: "internal" },
        { title: "Anchor", value: "anchor" },
        { title: "External URL", value: "external" },
        { title: "File Download", value: "fileDownload" },
        { title: "Email Address", value: "emailAddress" },
      ],
    },
    initialValue: 'internal',
    hidden: ({parent}) => !parent?.showButton,
  }),
  defineField({
    title: "Button Anchor Location",
    name: "buttonAnchorLocation",
    type: "string",
    options: {
      list: [
        { title: "Current Page", value: "currentPage" },
        { title: "Choose Page", value: "choosePage" },
      ],
    },
    initialValue: 'currentPage',
    hidden: ({ parent }) => !parent?.showButton || parent?.buttonType !== 'anchor',
  }),
  defineField({
    name: 'buttonPageReference',
    title: 'Button Page Reference',
    description: 'The page that the button will link to.',
    type: 'reference',
    to: [ ...pageReferenceTypes ],
    hidden: ({ parent }) => !parent?.showButton || 
      (parent?.buttonType !== 'internal' && 
       !(parent?.buttonType === 'anchor' && parent?.buttonAnchorLocation === 'choosePage')),
  }),
  defineField({
    name: 'buttonAnchorId',
    title: 'Button Anchor ID',
    description: 'The anchor ID that the button will link to.',
    type: 'string',
    hidden: ({ parent }) => !parent?.showButton || parent?.buttonType !== 'anchor',
  }),
  defineField({
    name: 'buttonExternalUrl',
    title: 'Button External URL',
    description: 'The external URL that the button will link to.',
    type: 'url',
    validation: Rule => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
    hidden: ({ parent }) => !parent?.showButton || parent?.buttonType !== 'external',
  }),
  defineField({
    name: 'buttonEmailAddress',
    title: 'Button Email Address',
    description: 'The email address that the button will link to.',
    type: 'string',
    hidden: ({ parent }) => !parent?.showButton || parent?.buttonType !== 'emailAddress',
  }),
  defineField({
    name: 'buttonFileUrl',
    title: 'Button File URL',
    type: 'file',  
    hidden: ({ parent }) => !parent?.showButton || parent?.buttonType !== 'fileDownload',
  }),
  defineField({
    title: "Button Variant",
    name: "buttonVariant",
    type: "string",
    options: {
      list: [
        { title: "Primary", value: "primary" },
        { title: "Secondary", value: "secondary" },
        { title: "Tertiary", value: "tertiary" },
        { title: "Outline", value: "outline" },
        { title: "Underline", value: "underline" },
      ],
    },
    initialValue: 'primary',
    hidden: ({parent}) => !parent?.showButton,
  }),
  defineField({
    title: "Button Width",
    name: "buttonWidth",
    type: "string",
    options: {
      list: [
        { title: "Automatic", value: "auto" },
        { title: "Full-Width", value: "fullWidth" },
      ],
    },
    initialValue: 'auto',
    hidden: ({parent}) => !parent?.showButton,
  }),
]