import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de cada petición a rutas que coincidan con el matcher
export function middleware(request: NextRequest) {
  // Verificar si la ruta comienza con /studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // Permitir acceso a la página de diagnóstico para facilitar la solución de problemas
    if (request.nextUrl.pathname === '/studio-debug') {
      return NextResponse.next();
    }

    // Obtener la clave de acceso de la query string
    const accessKey = request.nextUrl.searchParams.get('access_key');
    const adminKey = process.env.ADMIN_ACCESS_KEY || '456852'; // Por defecto asignar un valor por si no está configurado

    // Verificar si la petición proviene de localhost
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Obtener cookie de autenticación
    const authCookie = request.cookies.get('studio_auth')?.value;
    const isAuthorized = 
      // Verificar si hay una cookie válida
      authCookie === adminKey || 
      // O si la clave en URL coincide
      accessKey === adminKey || 
      // O si es localhost en desarrollo
      (isLocalhost && process.env.NODE_ENV === 'development');

    if (!isAuthorized) {
      // Si no está autorizado, redirigir a la página de diagnóstico
      return NextResponse.redirect(new URL('/studio-debug', request.url));
    } else if (accessKey && !authCookie) {
      // Si está autorizado con accessKey pero no tiene cookie, establecerla
      const response = NextResponse.redirect(new URL('/studio', request.url));
      
      // Establecer cookie con la misma clave usada (para verificarla en futuras visitas)
      response.cookies.set({
        name: 'studio_auth',
        value: adminKey,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
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