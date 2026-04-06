import { defineConfig } from 'sanity';
import { schema } from '@/sanity/schemas';
import { media } from 'sanity-plugin-media';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import { structure } from '@/sanity/lib/structure';
import { presentationTool } from 'sanity/presentation';
import { resolve } from '@/sanity/presentation/resolve';
import { simplerColorInput } from 'sanity-plugin-simpler-color-input'
import { defaultDocumentNode } from '@/sanity/lib/structure/default-document-node';
import { apiVersion, dataset, projectId, studioUrl, useCdn } from '@/sanity/lib/api';

const config = defineConfig({
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  useCdn: useCdn,
  dataset: dataset,
  basePath: studioUrl,
  projectId: projectId,
  apiVersion: apiVersion,
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode
    }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    media(),
    visionTool(),
    simplerColorInput()
  ],
  schema: schema,
})

export default config