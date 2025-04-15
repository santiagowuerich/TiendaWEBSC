'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
// Importar deskTool directamente de sanity
import {deskTool} from 'sanity/desk'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

// Obtener el token de API para Sanity
const token = typeof process !== 'undefined' && process.env && process.env.SANITY_API_TOKEN ?
  process.env.SANITY_API_TOKEN : undefined

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    // Desk tool es la herramienta principal para crear y editar contenido
    deskTool({
      structure
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  // Configuración simplificada 
  useCdn: false,
  // Agregar el token para la autenticación
  token
})
