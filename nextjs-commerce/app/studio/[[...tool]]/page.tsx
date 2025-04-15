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
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    // Intentar acceder directamente al token desde window si está disponible
    const checkToken = () => {
      try {
        // En el cliente, intentamos acceder a la variable global si existe
        if (typeof window !== 'undefined' && 
            window && 
            // @ts-ignore - Accedemos a una propiedad dinámica
            window.__env && 
            // @ts-ignore
            window.__env.SANITY_API_TOKEN) {
          setHasToken(true);
          return true;
        }
        
        // Verificar si el token está en las variables de entorno
        const token = process.env.SANITY_API_TOKEN;
        if (token) {
          setHasToken(true);
          return true;
        }
        
        return false;
      } catch (e) {
        console.warn("Error al verificar token:", e);
        return false;
      }
    };
    
    // Verificar configuración
    try {
      const tokenAvailable = checkToken();
      console.log("Configuración de Studio:", {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: tokenAvailable
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  if (!mounted) return <div className="p-8">Cargando Studio...</div>;
  
  if (error) return <div className="p-8">Error al cargar Studio: {error}</div>;

  return (
    <div>
      {/* Mostrar información de configuración */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          Token de API: {hasToken ? '✅ Configurado' : '❌ No configurado'}
        </div>
      )}
      
      {/* Componente principal del Studio */}
      <NextStudio config={config} unstable_noAuthBoundary />
    </div>
  );
}
