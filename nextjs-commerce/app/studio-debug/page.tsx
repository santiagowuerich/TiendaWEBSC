'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projectId, dataset, apiVersion } from '../../sanity/env';

export default function StudioDebugPage() {
  const [cookieAuth, setCookieAuth] = useState(false);
  const [hostInfo, setHostInfo] = useState({
    hostname: '',
    origin: '',
    url: '',
  });
  const [envVars, setEnvVars] = useState({
    projectId,
    dataset,
    apiVersion,
    adminAccessKey: process.env.ADMIN_ACCESS_KEY || '456852',
  });

  useEffect(() => {
    // Verificar si existe la cookie de autenticación
    setCookieAuth(document.cookie.includes('studio_auth='));
    
    // Obtener información sobre el dominio actual
    setHostInfo({
      hostname: window.location.hostname,
      origin: window.location.origin,
      url: window.location.href,
    });
  }, []);

  // Generar URL de acceso con la clave
  const accessUrl = `${hostInfo.origin}/studio?access_key=${envVars.adminAccessKey}`;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sanity Studio - Diagnóstico</h1>
      
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Estado de autenticación</h2>
        {cookieAuth ? (
          <div className="text-green-600 dark:text-green-400">
            ✅ Tienes acceso autorizado al Studio
          </div>
        ) : (
          <div className="text-red-600 dark:text-red-400">
            ❌ No estás autorizado a acceder al Studio
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceder al Studio</h2>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="mb-4">Para acceder al Studio, usa la siguiente URL:</p>
          <div className="bg-white dark:bg-gray-900 p-3 rounded border dark:border-gray-700 mb-4 overflow-x-auto">
            <code>{accessUrl}</code>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta URL contiene la clave de acceso necesaria. El acceso será válido por 7 días.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Información del dominio</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 px-4 font-medium">Hostname</td>
                <td className="py-2 px-4">{hostInfo.hostname}</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 px-4 font-medium">Origin</td>
                <td className="py-2 px-4">{hostInfo.origin}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">URL Actual</td>
                <td className="py-2 px-4 text-xs sm:text-sm break-all">{hostInfo.url}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Variables de entorno</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 px-4 font-medium">Project ID</td>
                <td className="py-2 px-4">{envVars.projectId || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 px-4 font-medium">Dataset</td>
                <td className="py-2 px-4">{envVars.dataset || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2 px-4 font-medium">API Version</td>
                <td className="py-2 px-4">{envVars.apiVersion || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Admin Access Key</td>
                <td className="py-2 px-4">
                  {envVars.adminAccessKey ? 
                    <span className="text-green-500">Configurado (oculto por seguridad)</span> : 
                    <span className="text-yellow-500">Usando clave por defecto</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Configurar ADMIN_ACCESS_KEY</h3>
            <p className="mb-2">Para una mayor seguridad, deberías configurar una clave de administrador personalizada:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Añade la variable de entorno <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ADMIN_ACCESS_KEY</code> con un valor único y complejo.</li>
              <li>Si estás usando Vercel, añade esta variable en la configuración del proyecto.</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Actualizar CORS en Sanity</h3>
            <p className="mb-2">Es importante que configures correctamente CORS en tu proyecto Sanity:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Ve a <a href="https://sanity.io/manage" target="_blank" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">sanity.io/manage</a></li>
              <li>Selecciona tu proyecto</li>
              <li>Ve a API {'>'} CORS origins</li>
              <li>Añade tu dominio (<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{hostInfo.origin}</code>) con Allow Credentials activado</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Si sigues teniendo problemas, comprueba los logs del servidor y la configuración de Sanity.</p>
      </div>
    </div>
  );
} 