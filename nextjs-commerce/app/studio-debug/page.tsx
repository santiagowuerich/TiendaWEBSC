'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projectId, dataset, apiVersion } from '../../sanity/env';

export default function StudioDebugPage() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
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
    // Verificar si existe autorización en localStorage
    try {
      const savedAuth = localStorage.getItem('studioAuth');
      setAuthStatus(savedAuth === 'true');
    } catch (e) {
      console.error("Error al leer localStorage:", e);
      setAuthStatus(false);
    }
    
    // Obtener información sobre el dominio actual
    setHostInfo({
      hostname: window.location.hostname,
      origin: window.location.origin,
      url: window.location.href,
    });
  }, []);

  // Generar URL de acceso con la clave
  const accessUrl = `${hostInfo.origin}/studio?access_key=${envVars.adminAccessKey}`;

  const clearAuth = () => {
    try {
      localStorage.removeItem('studioAuth');
      setAuthStatus(false);
    } catch (e) {
      console.error("Error al eliminar auth:", e);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Sanity Studio - Diagnóstico</h1>
      
      <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-2">Estado de autenticación</h2>
        {authStatus ? (
          <div className="flex flex-col space-y-4">
            <div className="text-green-400">
              ✅ Tienes acceso autorizado al Studio
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/studio" 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Ir al Studio
              </Link>
              <button
                onClick={clearAuth}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="text-red-400">
            ❌ No estás autorizado a acceder al Studio
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceder al Studio</h2>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="mb-4">Para acceder al Studio, usa la siguiente URL:</p>
          <div className="bg-gray-950 p-3 rounded border border-gray-700 mb-4 overflow-x-auto">
            <code className="text-yellow-300">{accessUrl}</code>
          </div>
          <p className="text-sm text-gray-400">
            Esta URL contiene la clave de acceso necesaria. Una vez autorizado, el acceso será persistente.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Información del dominio</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4 font-medium">Hostname</td>
                <td className="py-2 px-4">{hostInfo.hostname}</td>
              </tr>
              <tr className="border-b border-gray-800">
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
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4 font-medium">Project ID</td>
                <td className="py-2 px-4">{envVars.projectId || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4 font-medium">Dataset</td>
                <td className="py-2 px-4">{envVars.dataset || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 px-4 font-medium">API Version</td>
                <td className="py-2 px-4">{envVars.apiVersion || <span className="text-red-500">No configurado</span>}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Admin Access Key</td>
                <td className="py-2 px-4">
                  {envVars.adminAccessKey ? (
                    <span className="text-green-500">Configurado</span>
                  ) : (
                    <span className="text-yellow-500">No configurado</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Solución de problemas</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="font-medium mb-2 text-yellow-400">Si no puedes acceder al Studio</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Verifica que estás usando la URL exacta con el parámetro <code className="text-yellow-300">access_key</code></li>
              <li>Si la autenticación falla, prueba borrar el localStorage de tu navegador</li>
              <li>Verifica que el token API de Sanity está configurado en las variables de entorno</li>
              <li>Intenta acceder en modo incógnito para evitar problemas con las cookies del navegador</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="font-medium mb-2 text-blue-400">Configuración CORS de Sanity</h3>
            <p className="mb-2">Asegúrate de que tu dominio está configurado en Sanity:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Ve a <a href="https://sanity.io/manage" target="_blank" className="text-blue-400 hover:text-blue-300">sanity.io/manage</a></li>
              <li>Selecciona tu proyecto</li>
              <li>Ve a API {'>'} CORS origins</li>
              <li>Asegúrate de que <code className="text-yellow-300">{hostInfo.origin}</code> está en la lista</li>
              <li>Activa la opción "Permitir credenciales"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 