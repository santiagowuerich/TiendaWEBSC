/**
 * This route is responsiblse for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

// Asegurarse de que esta página se procese en el lado del cliente
export const dynamic = 'force-dynamic';

import { NextStudio } from 'next-sanity/studio';
import { StudioProvider, StudioLayout } from 'sanity';
import config from '../../../sanity.config';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Componente interno que usa useSearchParams
function StudioPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar la cookie existente
    const checkCookie = () => {
      return document.cookie.includes('studio_auth=');
    };

    // Establecer cookie de autenticación
    const setAuthCookie = () => {
      // Cookie válida por 7 días
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `studio_auth=true;expires=${expiryDate.toUTCString()};path=/`;
      return true;
    };

    // Verificar autenticación
    const checkAuth = () => {
      // Si ya está autenticado por cookie, continuar
      if (checkCookie()) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // En desarrollo permitimos acceso sin clave
      if (process.env.NODE_ENV === 'development') {
        setAuthCookie();
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Verificar clave de acceso
      const accessKey = searchParams.get('access_key');
      const adminKey = process.env.ADMIN_ACCESS_KEY || '456852';
      
      if (accessKey && accessKey === adminKey) {
        setAuthCookie();
        setIsAuthorized(true);
        // Redirigir sin parámetros
        router.replace('/studio');
      } else {
        setIsAuthorized(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [searchParams, router]);

  // Mostrar cargando mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no está autorizado
  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Acceso restringido</h1>
          <p className="mb-4">No tienes permiso para acceder al Sanity Studio.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Usa la URL con la clave correcta o contacta al administrador.</p>
          <div className="mt-6">
            <a href="/studio-debug" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Ir a la página de diagnóstico
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <NextStudio config={config}>
        <StudioProvider config={config}>
          <StudioLayout />
        </StudioProvider>
      </NextStudio>
    </div>
  );
}

// Componente principal envuelto en Suspense
export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p>Cargando Studio...</p>
        </div>
      </div>
    }>
      <StudioPageContent />
    </Suspense>
  );
}
