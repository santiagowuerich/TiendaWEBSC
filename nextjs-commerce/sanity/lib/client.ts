import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Asegurar que estamos usando el token de API para las operaciones con el cliente
const token = process.env.SANITY_API_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Desactivar el CDN para asegurar datos frescos
  token // Incluir el token en las solicitudes
})
