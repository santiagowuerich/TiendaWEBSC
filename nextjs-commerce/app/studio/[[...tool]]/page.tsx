/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
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
    
    // Debug de configuración
    console.log("Config:", {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: process.env.SANITY_API_TOKEN ? "Sí" : "No"
    });
    
    try {
      // Intentar cargar algo de Sanity para ver si hay errores
      fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=*[_type=="product"][0]`)
        .catch(err => setError(err.message));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  if (!mounted) return <div>Cargando Studio...</div>;
  
  if (error) return <div>Error al conectar con Sanity: {error}</div>;

  return (
    <>
      <div style={{padding: "10px", background: "#f0f0f0", margin: "10px"}}>
        Studio cargado correctamente. Si ves esto, la página funciona.
      </div>
      <NextStudio config={config} unstable_noAuthBoundary />
    </>
  );
}
