'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool({
      structure
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  useCdn: false,
  // Obtener el token directamente de las variables de entorno disponibles en cliente
  token: typeof window !== 'undefined' && 
    // @ts-ignore - En versiones recientes de Next.js puede estar disponible
    window.__env?.SANITY_API_TOKEN ||
    process.env.SANITY_API_TOKEN
})
