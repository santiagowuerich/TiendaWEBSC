'use client';

import { useEffect, useState } from 'react';

export default function StudioDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Solo mostrar variables públicas, nunca el token
    setEnvVars({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'no configurado',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'no configurado',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'no configurado',
      // Verificar si tenemos token (sin mostrarlo)
      hasToken: process.env.SANITY_API_TOKEN ? 'configurado' : 'no configurado',
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Sanity Studio</h1>
      <p className="mb-4">Esta página muestra las variables de entorno disponibles para Sanity Studio.</p>
      <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Pasos para resolver problemas:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Verificar que las variables de entorno estén configuradas en Vercel</li>
          <li>Agregar el dominio de la aplicación en CORS origins de Sanity</li>
          <li>Marcar "Allow credentials" en la configuración de CORS</li>
          <li>Hacer un nuevo despliegue después de actualizar la configuración</li>
        </ol>
      </div>
    </div>
  );
} 