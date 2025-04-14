'use client';

import { useEffect, useState } from 'react';

export default function StudioDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [urlParams, setUrlParams] = useState<string>('');
  const [domainInfo, setDomainInfo] = useState<string>('');
  
  useEffect(() => {
    // Solo mostrar variables públicas, nunca el token
    setEnvVars({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'no configurado',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'no configurado',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'no configurado',
      // Verificar si tenemos token (sin mostrarlo)
      hasToken: process.env.SANITY_API_TOKEN ? 'configurado' : 'no configurado',
      hasAdminKey: process.env.ADMIN_ACCESS_KEY ? 'configurado' : 'no configurado',
      adminKey: process.env.ADMIN_ACCESS_KEY || 'no configurado',
    });
    
    // Obtener parámetros de URL
    setUrlParams(window.location.search);
    setDomainInfo(window.location.origin);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Sanity Studio</h1>
      <p className="mb-4">Esta página muestra la configuración y variables de entorno disponibles para Sanity Studio.</p>
      
      <h2 className="text-xl font-bold mb-2">Dominio de la aplicación:</h2>
      <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white mb-6">
        {domainInfo}
      </pre>
      
      <h2 className="text-xl font-bold mb-2">Variables de entorno:</h2>
      <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white mb-6">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <h2 className="text-xl font-bold mb-2">Parámetros de URL:</h2>
      <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white mb-6">
        {urlParams || 'No hay parámetros'}
      </pre>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">¿Cómo acceder a Studio?</h2>
        <p className="mb-2">Para acceder al Studio en producción, usa la siguiente URL:</p>
        <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white mb-4">
          {`${domainInfo}/studio?access_key=${envVars.adminKey}`}
        </pre>
        
        <h2 className="text-xl font-bold mb-2">Pasos para resolver problemas:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Verificar que las variables de entorno estén configuradas en Vercel</li>
          <li>Agregar el dominio de la aplicación ({domainInfo}) en CORS origins de Sanity</li>
          <li>Marcar "Allow credentials" en la configuración de CORS</li>
          <li>Asegurar que la variable ADMIN_ACCESS_KEY esté configurada</li>
          <li>Acceder usando el parámetro ?access_key=TU_CLAVE_ADMIN</li>
        </ol>
      </div>
    </div>
  );
} 