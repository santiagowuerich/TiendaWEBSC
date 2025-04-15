'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudioDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [urlParams, setUrlParams] = useState<string>('');
  const [domainInfo, setDomainInfo] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Solo mostrar variables públicas, nunca el token
    const adminKey = process.env.ADMIN_ACCESS_KEY || '456852';
    
    setEnvVars({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'no configurado',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'no configurado',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'no configurado',
      // Verificar si tenemos token (sin mostrarlo)
      hasToken: process.env.SANITY_API_TOKEN ? 'configurado ✅' : 'no configurado ❌',
      hasAdminKey: process.env.ADMIN_ACCESS_KEY ? 'configurado ✅' : 'no configurado ❌',
      // No mostrar la clave completa en producción
      adminKey: process.env.NODE_ENV === 'production' ? 
        `${adminKey.substring(0, 2)}****${adminKey.substring(adminKey.length - 2)}` : 
        adminKey,
    });
    
    // Obtener parámetros de URL
    setUrlParams(window.location.search);
    setDomainInfo(window.location.origin);
    
    // Verificar si hay una cookie de autenticación
    const hasAuthCookie = document.cookie.includes('studio_auth=');
    setIsAuthenticated(hasAuthCookie);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Diagnóstico de Sanity Studio</h1>
      <p className="mb-4">Esta página muestra la configuración y variables de entorno disponibles para Sanity Studio.</p>
      
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Estado de autenticación:</h2>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isAuthenticated ? 'Autenticado en Studio' : 'No autenticado'}</span>
        </div>
        {!isAuthenticated && (
          <Link 
            href={`/studio?access_key=${envVars.adminKey}`}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Acceder al Studio
          </Link>
        )}
        {isAuthenticated && (
          <Link 
            href="/studio"
            className="mt-4 inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Ir al Studio
          </Link>
        )}
      </div>
      
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
      
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">¿Cómo acceder a Studio de forma segura?</h2>
        <p className="mb-4">Para acceder al Studio en producción, usa cualquiera de estos métodos:</p>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">1. Acceso con URL + Clave</h3>
          <pre className="bg-gray-100 p-4 rounded dark:bg-gray-800 dark:text-white mb-2">
            {`${domainInfo}/studio?access_key=${envVars.adminKey}`}
          </pre>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Este método establecerá una cookie que te mantendrá autenticado por 7 días.
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">2. Acceso desde localhost (solo en desarrollo)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            En entorno de desarrollo, puedes acceder directamente desde localhost sin clave.
          </p>
        </div>
        
        <h2 className="text-xl font-bold my-4">Pasos para resolver problemas:</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Verificar que las variables de entorno estén configuradas en Vercel</li>
          <li>Agregar el dominio de la aplicación en CORS origins de Sanity</li>
          <li>Marcar "Allow credentials" en la configuración de CORS</li>
          <li>Limpiar cookies si tienes problemas de autenticación</li>
          <li>Verificar que el token de API de Sanity sea válido</li>
        </ol>
      </div>
    </div>
  );
} 