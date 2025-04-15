import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de cada petición a rutas que coincidan con el matcher
export function middleware(request: NextRequest) {
  // Verificar si la ruta comienza con /studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // Permitir acceso a la página de diagnóstico de Studio para facilitar la solución de problemas
    if (request.nextUrl.pathname === '/studio-debug') {
      return NextResponse.next();
    }

    // Obtener la clave de acceso de la query string (ideal para desarrollo y pruebas iniciales)
    const accessKey = request.nextUrl.searchParams.get('access_key');
    const adminKey = process.env.ADMIN_ACCESS_KEY || '456852'; // Por defecto asignar un valor por si no está configurado

    // Verificar si la petición proviene de localhost (para desarrollo)
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Agregar una cookie que persiste la autorización para facilitar las sesiones de edición
    const authCookie = request.cookies.get('studio_auth')?.value;
    const isAuthorized = 
      // Verificar si la cookie de autorización es válida
      authCookie === adminKey || 
      // O si la clave proporcionada en la URL coincide
      accessKey === adminKey || 
      // O si es localhost en desarrollo
      (isLocalhost && process.env.NODE_ENV === 'development');

    if (!isAuthorized) {
      // Si no está autorizado, redirigir a la página principal
      return NextResponse.redirect(new URL('/', request.url));
    } else if (accessKey && !authCookie) {
      // Si está autorizado con un access_key pero no tiene cookie, establecer la cookie
      // para autorización persistente y redireccionar sin el parámetro en la URL
      const response = NextResponse.redirect(new URL('/studio', request.url));
      // Establecer cookie de autorización por 7 días
      response.cookies.set({
        name: 'studio_auth',
        value: adminKey,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      return response;
    }
  }
  
  // Si la validación pasa o la ruta no es /studio, continuar con la petición normal
  return NextResponse.next();
}

// Especificar las rutas a las que se aplicará este middleware
export const config = {
  matcher: ['/studio/:path*', '/studio-debug'],
} 