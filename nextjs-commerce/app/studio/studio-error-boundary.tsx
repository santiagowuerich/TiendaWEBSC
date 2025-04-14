'use client';

import React, { useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function StudioErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error capturado por StudioErrorBoundary:', event.error);
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-3xl mx-auto my-8">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Error al cargar Sanity Studio</h2>
        
        <div className="mb-6">
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            Ocurrió un error al cargar el Studio. Por favor, verifica la configuración:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Variables de entorno correctamente configuradas</li>
            <li>Configuración de CORS en Sanity</li>
            <li>Configuración de imágenes en next.config.ts</li>
          </ul>
        </div>
        
        <details className="bg-red-100 dark:bg-red-900/40 p-4 rounded">
          <summary className="font-medium cursor-pointer">Detalles del error</summary>
          <pre className="mt-2 text-sm overflow-auto p-2 bg-white/50 dark:bg-black/50 rounded">
            {error?.toString() || 'Error desconocido'}
          </pre>
        </details>
        
        <div className="mt-6 flex gap-4">
          <a 
            href="/studio-debug"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Ver diagnóstico
          </a>
          <button 
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 