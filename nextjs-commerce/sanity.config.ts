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

// Obtener token del entorno
const token = process.env.SANITY_API_TOKEN

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
  // Desactivar CDN para asegurar datos frescos
  useCdn: false,
  // Añadir el token para autenticación
  token
})
