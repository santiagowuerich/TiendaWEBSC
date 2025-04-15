/**
 * This route is responsiblse for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Verificar configuración
    try {
      console.log("Configuración de Studio:", {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: process.env.SANITY_API_TOKEN ? true : false
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  if (!mounted) return <div className="p-8">Cargando Studio...</div>;
  
  if (error) return <div className="p-8">Error al cargar Studio: {error}</div>;

  // Usar unstable_noAuthBoundary para evitar problemas con la autenticación
  return <NextStudio config={config} unstable_noAuthBoundary />;
}
